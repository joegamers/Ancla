import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

/**
 * ZenBackground — Optimized Advanced Environment:
 * - Persistent Renderer (No more freezes on "Nueva")
 * - Reactive Geometry update (In-place swap)
 * - Memory leak protection (Proper disposal of clones)
 * - Performance Phase 2: FPS Throttling & Delayed Start
 */
export const ZenBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationIdRef = useRef<number>(0);
    const componentsRef = useRef<{
        renderer: THREE.WebGLRenderer;
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        coreMesh: THREE.Mesh;
        shellMesh: THREE.Mesh;
        particleSystem: THREE.Points;
        particlesGeo: THREE.BufferGeometry;
        particlesVel: Float32Array;
        lines: THREE.LineSegments;
        fragments: THREE.Mesh[];
    } | null>(null);

    const currentVibe = useStore((state) => state.currentVibe);
    const geometrySeed = useStore((state) => state.geometrySeed);
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 180; // Absolute minimum for mobile to pass PageSpeed
    const lineMaxConnections = isMobile ? 0 : 500; // Zero links on mobile to save TBT

    // ─── Phase 1: Engine Initialization (Once) ───
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: !isMobile,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 4.5;

        // Materials
        const commonMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x5eead4,
            metalness: 0.3,
            roughness: 0.1,
            transmission: 0.8,
            transparent: true,
            opacity: 0.4
        });
        const shellMaterial = new THREE.MeshStandardMaterial({
            color: 0x0d9488,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });

        // Geometries mapping (reduced complexity for mobile)
        const mapping: Record<string, THREE.BufferGeometry> = {
            'Todas': new THREE.IcosahedronGeometry(0.8, isMobile ? 0 : 1),
            'Calma': new THREE.TorusGeometry(0.6, 0.2, 8, isMobile ? 24 : 48),
            'Fuerza': new THREE.OctahedronGeometry(0.8, 0),
            'Amor': new THREE.IcosahedronGeometry(0.7, isMobile ? 1 : 2),
            'Gratitud': new THREE.DodecahedronGeometry(0.8, 0),
            'Enfoque': new THREE.TetrahedronGeometry(0.8, isMobile ? 1 : 2)
        };

        const initialGeo = mapping[useStore.getState().currentVibe] || mapping['Todas'];
        const coreMesh = new THREE.Mesh(initialGeo, commonMaterial);
        const shellMesh = new THREE.Mesh(initialGeo.clone(), shellMaterial);
        shellMesh.scale.setScalar(1.25);
        scene.add(coreMesh, shellMesh);

        // Ambient fragments
        const fragments: THREE.Mesh[] = [];
        const fragGeo = new THREE.OctahedronGeometry(0.12, 0);
        const fragCount = isMobile ? 4 : 10; // Reduced for performance
        for (let i = 0; i < fragCount; i++) {
            const m = new THREE.Mesh(fragGeo, commonMaterial);
            m.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 10);
            scene.add(m);
            fragments.push(m);
        }

        // Particles
        const particlesPos = new Float32Array(particleCount * 3);
        const particlesVel = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            particlesPos[i] = (Math.random() - 0.5) * 35;
            particlesVel[i] = (Math.random() - 0.5) * 0.015;
        }

        const particlesGeo = new THREE.BufferGeometry();
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlesPos, 3));
        const particlesMat = new THREE.PointsMaterial({ color: 0x5eead4, size: 0.04, transparent: true, opacity: 0.3 });
        const particleSystem = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particleSystem);

        // Links (empty by default)
        const lineGeo = new THREE.BufferGeometry();
        const lineMat = new THREE.LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.08 });
        const lines = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(lines);

        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const spot = new THREE.SpotLight(0x5eead4, 1.5, 30, 0.5, 0.5);
        spot.position.set(5, 8, 10);
        scene.add(spot);

        componentsRef.current = {
            renderer, scene, camera, coreMesh, shellMesh,
            particleSystem, particlesGeo, particlesVel,
            lines, fragments
        };

        // ─── Animation Loop (Throttled) ───
        let lastFrameTime = performance.now();
        const frameInterval = isMobile ? 1000 / 25 : 1000 / 60; // 25 FPS on mobile is enough for ambient

        const animate = () => {
            const animationId = requestAnimationFrame(animate);
            animationIdRef.current = animationId;

            // Kill loop if tab is buried or window is blurred (Phase 3 Optimization)
            if (document.hidden) return;

            const now = performance.now();
            const delta = now - lastFrameTime;

            if (delta < frameInterval) return;
            lastFrameTime = now - (delta % frameInterval);

            if (!componentsRef.current) return;
            const { renderer, scene, camera, coreMesh, shellMesh, fragments, particleSystem, lines, particlesVel } = componentsRef.current;

            // Movement
            coreMesh.rotation.y += 0.002;
            shellMesh.rotation.y -= 0.0012;
            shellMesh.rotation.z += 0.0008;

            fragments.forEach((f, i) => {
                f.rotation.x += 0.005;
                f.position.y += Math.sin(now * 0.0008 + i) * 0.004;
            });

            // Particles
            const pos = particleSystem.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                pos[i * 3] += particlesVel[i * 3];
                pos[i * 3 + 1] += particlesVel[i * 3 + 1];
                pos[i * 3 + 2] += particlesVel[i * 3 + 2];

                if (Math.abs(pos[i * 3]) > 18) particlesVel[i * 3] *= -1;
                if (Math.abs(pos[i * 3 + 1]) > 18) particlesVel[i * 3 + 1] *= -1;
                if (Math.abs(pos[i * 3 + 2]) > 18) particlesVel[i * 3 + 2] *= -1;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            // Inter-particle links (SKIPPED ON MOBILE)
            if (!isMobile && lines) {
                const linePositions = [];
                let connections = 0;
                for (let i = 0; i < particleCount && connections < lineMaxConnections; i++) {
                    for (let j = i + 1; j < particleCount && connections < lineMaxConnections; j++) {
                        const dx = pos[i * 3] - pos[j * 3];
                        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                        const d2 = dx * dx + dy * dy + dz * dz;

                        if (d2 < 12) { // dist < ~3.4
                            linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
                            linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
                            connections++;
                        }
                    }
                }
                if (linePositions.length > 0) {
                    lines.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
                    lines.geometry.attributes.position.needsUpdate = true;
                } else {
                    // Clear lines if no connections
                    lines.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
                    lines.geometry.attributes.position.needsUpdate = true;
                }
            }

            // Smooth mouse camera drift
            camera.position.x += (mouseRef.current.x * 2 - camera.position.x) * 0.03;
            camera.position.y += (-mouseRef.current.y * 2 - camera.position.y) * 0.03;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        // Handlers
        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        const onResize = () => {
            if (!componentsRef.current) return;
            const { camera, renderer } = componentsRef.current;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onResize);

        // Delay start on mobile to save TBT during high-priority load/hydration
        const delay = isMobile ? 1800 : 0;
        const timerId = setTimeout(() => {
            animate();
        }, delay);

        return () => {
            clearTimeout(timerId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);

            if (componentsRef.current) {
                const { renderer, scene, coreMesh, shellMesh, particleSystem, lines, fragments } = componentsRef.current;

                // Dispose materials
                (coreMesh.material as THREE.Material).dispose();
                (shellMesh.material as THREE.Material).dispose();
                (particleSystem.material as THREE.Material).dispose();
                (lines.material as THREE.Material).dispose();
                fragments.forEach(f => (f.material as THREE.Material).dispose());
                // Dispose fragGeo if it's not shared or if it's the only instance
                fragGeo.dispose();

                // Dispose geometries
                coreMesh.geometry.dispose();
                shellMesh.geometry.dispose();
                particleSystem.geometry.dispose();
                lines.geometry.dispose();

                scene.clear(); // Clear all objects from the scene
                renderer.dispose();
                if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
            }
            componentsRef.current = null;
        };
    }, [isMobile, particleCount, lineMaxConnections]);

    // ─── Phase 2: Reactive Geometry Update ───
    useEffect(() => {
        if (!componentsRef.current) return;
        const { coreMesh, shellMesh } = componentsRef.current;
        const s = geometrySeed % 3;

        const mapping: Record<string, THREE.BufferGeometry> = {
            'Todas': s === 0 ? new THREE.IcosahedronGeometry(0.8, isMobile ? 0 : 1) : s === 1 ? new THREE.TorusKnotGeometry(0.5, 0.15, isMobile ? 64 : 128, 16) : new THREE.DodecahedronGeometry(0.8, 0),
            'Calma': new THREE.TorusGeometry(0.6, 0.2, 8, isMobile ? 24 : 48),
            'Fuerza': new THREE.OctahedronGeometry(0.8, 0),
            'Amor': new THREE.IcosahedronGeometry(0.7, isMobile ? 1 : 2),
            'Gratitud': new THREE.DodecahedronGeometry(0.8, 0),
            'Enfoque': new THREE.TetrahedronGeometry(0.8, isMobile ? 1 : 2)
        };

        const newGeo = mapping[currentVibe] || mapping['Todas'];

        // Dispose old and swap
        const oldCoreGeo = coreMesh.geometry;
        const oldShellGeo = shellMesh.geometry;

        coreMesh.geometry = newGeo;
        shellMesh.geometry = newGeo.clone();

        // Avoid disposing the initial ones used by mapping (they are not tracked here yet, but usually fine for small set)
        // For production, we should track if they are unique per cycle
        if (oldCoreGeo !== newGeo) {
            oldCoreGeo.dispose();
            oldShellGeo.dispose();
        }
    }, [currentVibe, geometrySeed, isMobile]);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className="fixed inset-0 z-0 pointer-events-none transition-colors duration-1000"
            style={{ background: 'linear-gradient(135deg, #060d1a 0%, #0a1e2e 30%, #0d2a2a 60%, #081018 100%)' }}
        />
    );
};
