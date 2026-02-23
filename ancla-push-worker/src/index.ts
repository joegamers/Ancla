/**
 * Ancla Push Worker — Central push notification scheduler.
 *
 * Handles Web Push (PWA) and FCM (Android) notifications.
 * CRON runs every minute, checks which users need a notification,
 * and sends it via the appropriate channel.
 */

import { getRandomAffirmation } from './affirmations';

// ── Types ──────────────────────────────────────────────────────────

interface Env {
    SUBSCRIPTIONS: KVNamespace;
    VAPID_PUBLIC_KEY: string;
    VAPID_PRIVATE_KEY: string;
    FCM_PROJECT_ID: string;
    FCM_CLIENT_EMAIL: string;
    FCM_PRIVATE_KEY: string;
}

interface Subscription {
    platform: 'web' | 'android';
    // Web Push subscription (for PWA)
    webPush?: {
        endpoint: string;
        keys: { p256dh: string; auth: string };
    };
    // FCM token (for Android)
    fcmToken?: string;
    // User config
    interval: number;       // minutes
    period: 'day' | 'night' | 'always';
    intention: string;      // mood category
    timezone: string;       // IANA timezone string
    lastSent: number;       // timestamp ms
    createdAt: number;
}

// ── CORS headers ───────────────────────────────────────────────────

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
}

// ── Web Push Crypto (VAPID + payload encryption) ───────────────────

function base64UrlDecode(str: string): Uint8Array {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

function base64UrlEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function importVapidKey(privateKeyBase64Url: string): Promise<CryptoKey> {
    const rawKey = base64UrlDecode(privateKeyBase64Url);
    // ECDSA P-256 private key in raw (32 bytes) — build PKCS8
    const pkcs8 = buildPKCS8(rawKey);
    return crypto.subtle.importKey('pkcs8', pkcs8, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
}

function buildPKCS8(rawPrivateKey: Uint8Array): ArrayBuffer {
    // Wraps a raw 32-byte P-256 private key into PKCS8 DER format
    const header = new Uint8Array([
        0x30, 0x81, 0x87, 0x02, 0x01, 0x00, 0x30, 0x13, 0x06, 0x07,
        0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01, 0x06, 0x08, 0x2a,
        0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07, 0x04, 0x6d, 0x30,
        0x6b, 0x02, 0x01, 0x01, 0x04, 0x20,
    ]);
    const footer = new Uint8Array([
        0xa1, 0x44, 0x03, 0x42, 0x00,
    ]);
    // We need the public key too, but for signing JWT we only need the private key
    // Use simplified PKCS8 without public key component
    const simplified = new Uint8Array([
        0x30, 0x41, 0x02, 0x01, 0x00, 0x30, 0x13, 0x06, 0x07,
        0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01, 0x06, 0x08, 0x2a,
        0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07, 0x04, 0x27, 0x30,
        0x25, 0x02, 0x01, 0x01, 0x04, 0x20,
        ...rawPrivateKey
    ]);
    return simplified.buffer;
}

async function createVapidJwt(
    audience: string,
    subject: string,
    privateKey: CryptoKey,
): Promise<string> {
    const header = { typ: 'JWT', alg: 'ES256' };
    const now = Math.floor(Date.now() / 1000);
    const payload = { aud: audience, exp: now + 86400, sub: subject };

    const encodedHeader = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
    const encodedPayload = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;

    const signature = await crypto.subtle.sign(
        { name: 'ECDSA', hash: 'SHA-256' },
        privateKey,
        new TextEncoder().encode(unsignedToken),
    );

    // Convert DER signature to raw r||s format
    const rawSig = derToRaw(new Uint8Array(signature));
    return `${unsignedToken}.${base64UrlEncode(rawSig)}`;
}

function derToRaw(der: Uint8Array): ArrayBuffer {
    // If already raw (64 bytes), return as-is
    if (der.length === 64) return der.buffer;

    // DER format: 0x30 <len> 0x02 <rLen> <r> 0x02 <sLen> <s>
    let offset = 2; // skip 0x30 + length byte
    if (der[1] > 0x80) offset += der[1] - 0x80; // handle long form length

    offset++; // 0x02
    const rLen = der[offset++];
    const rStart = offset;
    offset += rLen;

    offset++; // 0x02
    const sLen = der[offset++];
    const sStart = offset;

    const raw = new Uint8Array(64);
    // Copy r (right-aligned to 32 bytes)
    const rBytes = der.slice(rStart, rStart + rLen);
    raw.set(rLen > 32 ? rBytes.slice(rLen - 32) : rBytes, 32 - Math.min(rLen, 32));
    // Copy s (right-aligned to 32 bytes)
    const sBytes = der.slice(sStart, sStart + sLen);
    raw.set(sLen > 32 ? sBytes.slice(sLen - 32) : sBytes, 32 - Math.min(sLen, 32));

    return raw.buffer;
}

// Encrypt payload for Web Push (RFC 8291 aes128gcm)
async function encryptPayload(
    payload: string,
    p256dhKey: string,
    authSecret: string,
): Promise<{ ciphertext: ArrayBuffer; salt: Uint8Array; localPublicKey: ArrayBuffer }> {
    const clientPublicKey = base64UrlDecode(p256dhKey);
    const clientAuth = base64UrlDecode(authSecret);

    // Generate local ECDH keypair
    const localKeyPair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
    const localPublicKeyRaw = await crypto.subtle.exportKey('raw', localKeyPair.publicKey);

    // Import client public key
    const clientKey = await crypto.subtle.importKey('raw', clientPublicKey, { name: 'ECDH', namedCurve: 'P-256' }, false, []);

    // ECDH shared secret
    const sharedSecret = await crypto.subtle.deriveBits({ name: 'ECDH', public: clientKey }, localKeyPair.privateKey, 256);

    // Salt
    const salt = crypto.getRandomValues(new Uint8Array(16));

    // PRK for auth
    const authInfo = concatBuffers(
        new TextEncoder().encode('WebPush: info\0'),
        clientPublicKey,
        new Uint8Array(localPublicKeyRaw),
    );
    const prkKey = await crypto.subtle.importKey('raw', clientAuth, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const ikm = await crypto.subtle.sign('HMAC', prkKey, sharedSecret);

    // HKDF extract
    const prkHmacKey = await crypto.subtle.importKey('raw', salt, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const prk = await crypto.subtle.sign('HMAC', prkHmacKey, ikm);

    // Derive auth IKM
    const authIkmKey = await crypto.subtle.importKey('raw', prk, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const authIkm = await crypto.subtle.sign('HMAC', authIkmKey, concatBuffers(authInfo, new Uint8Array([1])));

    // HKDF for content encryption key  
    const cekInfo = new TextEncoder().encode('Content-Encoding: aes128gcm\0');
    const cekPrkKey = await crypto.subtle.importKey('raw', salt, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const cekPrk = await crypto.subtle.sign('HMAC', cekPrkKey, new Uint8Array(authIkm).slice(0, 32));
    const cekHmacKey = await crypto.subtle.importKey('raw', cekPrk, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const cekFull = await crypto.subtle.sign('HMAC', cekHmacKey, concatBuffers(cekInfo, new Uint8Array([1])));
    const cek = new Uint8Array(cekFull).slice(0, 16);

    // HKDF for nonce
    const nonceInfo = new TextEncoder().encode('Content-Encoding: nonce\0');
    const nonceHmacKey = await crypto.subtle.importKey('raw', cekPrk, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const nonceFull = await crypto.subtle.sign('HMAC', nonceHmacKey, concatBuffers(nonceInfo, new Uint8Array([1])));
    const nonce = new Uint8Array(nonceFull).slice(0, 12);

    // Encrypt with AES-GCM
    const aesKey = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
    const paddedPayload = concatBuffers(new TextEncoder().encode(payload), new Uint8Array([2])); // delimiter
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, paddedPayload);

    // Build aes128gcm header: salt(16) + rs(4) + idlen(1) + keyid(65) + ciphertext
    const rs = new Uint8Array(4);
    new DataView(rs.buffer).setUint32(0, 4096);
    const localPubKeyBytes = new Uint8Array(localPublicKeyRaw);
    const header = concatBuffers(salt, rs, new Uint8Array([localPubKeyBytes.length]), localPubKeyBytes);
    const ciphertext = concatBuffers(header, new Uint8Array(encrypted));

    return { ciphertext: ciphertext.buffer, salt, localPublicKey: localPublicKeyRaw };
}

function concatBuffers(...buffers: (Uint8Array | ArrayBuffer)[]): Uint8Array {
    const arrays = buffers.map(b => b instanceof Uint8Array ? b : new Uint8Array(b));
    const length = arrays.reduce((acc, a) => acc + a.length, 0);
    const result = new Uint8Array(length);
    let offset = 0;
    for (const a of arrays) {
        result.set(a, offset);
        offset += a.length;
    }
    return result;
}

// ── Send Web Push notification ─────────────────────────────────────

async function sendWebPush(
    sub: { endpoint: string; keys: { p256dh: string; auth: string } },
    payloadObj: { title: string; body: string; icon?: string },
    env: Env,
): Promise<boolean> {
    try {
        const payload = JSON.stringify(payloadObj);
        const url = new URL(sub.endpoint);
        const audience = `${url.protocol}//${url.host}`;

        const vapidKey = await importVapidKey(env.VAPID_PRIVATE_KEY);
        const jwt = await createVapidJwt(audience, 'mailto:push@ancla.app', vapidKey);

        const { ciphertext } = await encryptPayload(payload, sub.keys.p256dh, sub.keys.auth);

        const response = await fetch(sub.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `vapid t=${jwt}, k=${env.VAPID_PUBLIC_KEY}`,
                'Content-Type': 'application/octet-stream',
                'Content-Encoding': 'aes128gcm',
                'TTL': '86400',
                'Urgency': 'normal',
            },
            body: ciphertext,
        });

        if (!response.ok) {
            console.error(`[WebPush] Failed (${response.status}): ${await response.text()}`);
            return false;
        }
        return true;
    } catch (e) {
        console.error('[WebPush] Error:', e);
        return false;
    }
}

// ── Send FCM notification (v1 API with service account) ────────────

async function getFCMAccessToken(env: Env): Promise<string> {
    // Build JWT for service account
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: env.FCM_CLIENT_EMAIL,
        scope: 'https://www.googleapis.com/auth/firebase.messaging',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
    };

    const headerB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
    const payloadB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
    const unsignedToken = `${headerB64}.${payloadB64}`;

    // Import RSA private key
    const pemBody = env.FCM_PRIVATE_KEY
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\\n/g, '')
        .replace(/\s/g, '');
    const keyBuffer = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));

    const rsaKey = await crypto.subtle.importKey(
        'pkcs8', keyBuffer,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false, ['sign']
    );

    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        rsaKey,
        new TextEncoder().encode(unsignedToken),
    );

    const jwt = `${unsignedToken}.${base64UrlEncode(signature)}`;

    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    const tokenData = await tokenResponse.json() as { access_token: string };
    return tokenData.access_token;
}

async function sendFCMPush(
    fcmToken: string,
    payloadObj: { title: string; body: string },
    env: Env,
): Promise<boolean> {
    try {
        const accessToken = await getFCMAccessToken(env);

        const response = await fetch(
            `https://fcm.googleapis.com/v1/projects/${env.FCM_PROJECT_ID}/messages:send`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: {
                        token: fcmToken,
                        notification: {
                            title: payloadObj.title,
                            body: payloadObj.body,
                        },
                        android: {
                            priority: 'high',
                            notification: {
                                channel_id: 'affirmations',
                                sound: 'zen_bell',
                            },
                        },
                    },
                }),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            console.error(`[FCM] Failed (${response.status}): ${errText}`);
            // Remove invalid tokens
            if (response.status === 404 || response.status === 400) return false;
            return false;
        }
        return true;
    } catch (e) {
        console.error('[FCM] Error:', e);
        return false;
    }
}

// ── Time period check ──────────────────────────────────────────────

function isInActivePeriod(period: string, timezone: string): boolean {
    if (period === 'always') return true;

    let hour: number;
    try {
        const timeStr = new Date().toLocaleString('en-US', { timeZone: timezone, hour12: false, hour: 'numeric' });
        hour = parseInt(timeStr);
    } catch {
        hour = new Date().getUTCHours();
    }

    if (period === 'day') return hour >= 8 && hour < 22;
    if (period === 'night') return hour >= 22 || hour < 8;
    return true;
}

// ── Main Worker ────────────────────────────────────────────────────

export default {
    // Handle HTTP requests (subscribe, unsubscribe, config)
    async fetch(request: Request, env: Env): Promise<Response> {
        // CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: CORS_HEADERS });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        // ── POST /subscribe ──
        if (path === '/subscribe' && request.method === 'POST') {
            try {
                const body = await request.json() as Partial<Subscription> & { id?: string };
                if (!body.platform) return jsonResponse({ error: 'platform required' }, 400);

                const id = body.id || crypto.randomUUID();
                const sub: Subscription = {
                    platform: body.platform,
                    webPush: body.webPush,
                    fcmToken: body.fcmToken,
                    interval: body.interval || 60,
                    period: body.period || 'day',
                    intention: body.intention || 'Todas',
                    timezone: body.timezone || 'America/Caracas',
                    lastSent: 0, // Send first notification on next CRON cycle
                    createdAt: Date.now(),
                };

                await env.SUBSCRIPTIONS.put(`sub:${id}`, JSON.stringify(sub));

                // Also maintain an index of all subscription IDs
                const indexRaw = await env.SUBSCRIPTIONS.get('index');
                const index: string[] = indexRaw ? JSON.parse(indexRaw) : [];
                if (!index.includes(id)) {
                    index.push(id);
                    await env.SUBSCRIPTIONS.put('index', JSON.stringify(index));
                }

                return jsonResponse({ ok: true, id });
            } catch (e) {
                return jsonResponse({ error: String(e) }, 500);
            }
        }

        // ── PUT /config ──
        if (path === '/config' && request.method === 'PUT') {
            try {
                const body = await request.json() as { id: string; interval?: number; period?: string; intention?: string; timezone?: string };
                if (!body.id) return jsonResponse({ error: 'id required' }, 400);

                const raw = await env.SUBSCRIPTIONS.get(`sub:${body.id}`);
                if (!raw) return jsonResponse({ error: 'not found' }, 404);

                const sub: Subscription = JSON.parse(raw);
                if (body.interval !== undefined) sub.interval = body.interval;
                if (body.period) sub.period = body.period as Subscription['period'];
                if (body.intention) sub.intention = body.intention;
                if (body.timezone) sub.timezone = body.timezone;
                // Reset lastSent so next notification comes on the new schedule
                sub.lastSent = 0;

                await env.SUBSCRIPTIONS.put(`sub:${body.id}`, JSON.stringify(sub));
                return jsonResponse({ ok: true });
            } catch (e) {
                return jsonResponse({ error: String(e) }, 500);
            }
        }

        // ── DELETE /unsubscribe ──
        if (path === '/unsubscribe' && request.method === 'DELETE') {
            try {
                const body = await request.json() as { id: string };
                if (!body.id) return jsonResponse({ error: 'id required' }, 400);

                await env.SUBSCRIPTIONS.delete(`sub:${body.id}`);

                // Remove from index
                const indexRaw = await env.SUBSCRIPTIONS.get('index');
                if (indexRaw) {
                    const index: string[] = JSON.parse(indexRaw);
                    const filtered = index.filter(i => i !== body.id);
                    await env.SUBSCRIPTIONS.put('index', JSON.stringify(filtered));
                }

                return jsonResponse({ ok: true });
            } catch (e) {
                return jsonResponse({ error: String(e) }, 500);
            }
        }

        // ── GET /health ──
        if (path === '/health') {
            const indexRaw = await env.SUBSCRIPTIONS.get('index');
            const count = indexRaw ? JSON.parse(indexRaw).length : 0;
            return jsonResponse({ status: 'ok', subscriptions: count });
        }

        return jsonResponse({ error: 'not found' }, 404);
    },

    // CRON handler — runs every minute
    async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
        const indexRaw = await env.SUBSCRIPTIONS.get('index');
        if (!indexRaw) return;

        const index: string[] = JSON.parse(indexRaw);
        const now = Date.now();
        const staleIds: string[] = [];

        for (const id of index) {
            const raw = await env.SUBSCRIPTIONS.get(`sub:${id}`);
            if (!raw) {
                staleIds.push(id);
                continue;
            }

            const sub: Subscription = JSON.parse(raw);
            const intervalMs = sub.interval * 60 * 1000;
            const elapsed = now - sub.lastSent;

            // Check if enough time has passed
            if (elapsed < intervalMs) continue;

            // Check if we're in the active period
            if (!isInActivePeriod(sub.period, sub.timezone)) continue;

            // Get a random affirmation for the user's intention
            const aff = getRandomAffirmation(sub.intention);
            const payload = {
                title: '✨ Ancla',
                body: aff.text,
                icon: '/app-icon.svg',
            };

            let success = false;

            if (sub.platform === 'web' && sub.webPush) {
                success = await sendWebPush(sub.webPush, payload, env);
            } else if (sub.platform === 'android' && sub.fcmToken) {
                success = await sendFCMPush(sub.fcmToken, payload, env);
            }

            if (success) {
                sub.lastSent = now;
                await env.SUBSCRIPTIONS.put(`sub:${id}`, JSON.stringify(sub));
            } else {
                // If push failed (e.g. expired token), remove the subscription
                staleIds.push(id);
            }
        }

        // Cleanup stale subscriptions
        if (staleIds.length > 0) {
            for (const id of staleIds) {
                await env.SUBSCRIPTIONS.delete(`sub:${id}`);
            }
            const updatedIndex = index.filter(id => !staleIds.includes(id));
            await env.SUBSCRIPTIONS.put('index', JSON.stringify(updatedIndex));
            console.log(`[CRON] Cleaned ${staleIds.length} stale subscriptions`);
        }
    },
};
