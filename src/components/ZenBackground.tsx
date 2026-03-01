import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

/**
 * ZenBackground — Optimized Advanced Environment:
 * - Persistent Renderer (No more freezes on "Nueva")
 * - Reactive Geometry update (In-place swap)
 * - Memory leak protection (Proper disposal of clones)
 */
export const ZenBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const componentsRef = useRef<{
        renderer: THREE.WebGLRenderer;
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        coreMesh: THREE.Mesh;
        shellMesh: THREE.Mesh;
        particles: THREE.Points;
        lines: THREE.LineSegments;
        particlesGeo: THREE.BufferGeometry;
        lineGeo: THREE.BufferGeometry;
        particleVelocities: THREE.Vector3[];
        fragments: THREE.Mesh[];
    } | null>(null);

    const currentVibe = useStore((state) => state.currentVibe);
    const geometrySeed = useStore((state) => state.geometrySeed);
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 100 : 250;
    const lineMaxConnections = isMobile ? 400 : 1000;

    // ─── Phase 1: Engine Initialization (Once) ───
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({
            antialias: !isMobile,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Core 3D objects
        const placeholderGeo = new THREE.SphereGeometry(0.1, 8, 8); // Placeholder geometry
        placeholderGeo.name = 'placeholder';
        const coreMat = new THREE.MeshPhysicalMaterial({ color: 0x5eead4, metalness: 0.3, roughness: 0.1, transmission: 0.8, transparent: true, opacity: 0.45 });
        const coreMesh = new THREE.Mesh(placeholderGeo, coreMat);

        const shellMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, wireframe: true, transparent: true, opacity: 0.15 });
        const shellMesh = new THREE.Mesh(placeholderGeo.clone(), shellMat); // Clone for shell
        shellMesh.geometry.name = 'placeholder';
        shellMesh.scale.setScalar(1.6);

        scene.add(coreMesh, shellMesh);

        // Fragments
        const fragments: THREE.Mesh[] = [];
        const fragCount = isMobile ? 8 : 15;
        const fragGeo = new THREE.OctahedronGeometry(0.1, 0);
        const fragMat = new THREE.MeshPhysicalMaterial({ color: 0x5eead4, transparent: true, opacity: 0.2 });
        for (let i = 0; i < fragCount; i++) {
            const f = new THREE.Mesh(fragGeo, fragMat);
            f.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8);
            scene.add(f);
            fragments.push(f);
        }

        // Particles
        const particlesPos = new Float32Array(particleCount * 3);
        const particleVelocities: THREE.Vector3[] = [];
        for (let i = 0; i < particleCount; i++) {
            particlesPos[i * 3] = (Math.random() - 0.5) * 15;
            particlesPos[i * 3 + 1] = (Math.random() - 0.5) * 15;
            particlesPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
            particleVelocities.push(new THREE.Vector3((Math.random() - 0.5) * 0.008, (Math.random() - 0.5) * 0.008, (Math.random() - 0.5) * 0.008));
        }
        const particlesGeo = new THREE.BufferGeometry();
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlesPos, 3));
        const particlesMat = new THREE.PointsMaterial({ color: 0x5eead4, size: 0.015, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending });
        const particles = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particles);

        // Lines
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineMaxConnections * 6), 3));
        const lineMat = new THREE.LineBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending });
        const lines = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(lines);

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const spot = new THREE.SpotLight(0x5eead4, 2, 25, 0.6, 0.5);
        spot.position.set(5, 5, 8);
        scene.add(spot);

        componentsRef.current = { renderer, scene, camera, coreMesh, shellMesh, particles, lines, particlesGeo, lineGeo, particleVelocities, fragments };

        // Handlers
        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onResize);

        // Animate loop
        let animId = 0;
        const animate = () => {
            const time = performance.now() * 0.001;
            const mouseVec = new THREE.Vector3(mouseRef.current.x * 5, -mouseRef.current.y * 5, 0);

            // Core motion
            const breath = 1 + Math.sin(time * 0.8) * 0.05;
            coreMesh.scale.setScalar(breath);
            shellMesh.scale.setScalar(1.6 * breath);
            coreMesh.rotation.y = time * 0.15;
            shellMesh.rotation.y = -time * 0.1;

            fragments.forEach((f, i) => { f.position.y += Math.sin(time + i) * 0.002; f.rotation.x += 0.01; });

            // Particles & Links
            const pos = particlesGeo.attributes.position.array as Float32Array;
            const lPos = lineGeo.attributes.position.array as Float32Array;
            let lIdx = 0;

            for (let i = 0; i < particleCount; i++) {
                // Move
                pos[i * 3] += particleVelocities[i].x; pos[i * 3 + 1] += particleVelocities[i].y; pos[i * 3 + 2] += particleVelocities[i].z;
                // Bounds
                if (Math.abs(pos[i * 3]) > 8) particleVelocities[i].x *= -1;
                if (Math.abs(pos[i * 3 + 1]) > 8) particleVelocities[i].y *= -1;
                if (Math.abs(pos[i * 3 + 2]) > 6) particleVelocities[i].z *= -1;

                // Mouse Repulse
                const dM = Math.sqrt((pos[i * 3] - mouseVec.x) ** 2 + (pos[i * 3 + 1] - mouseVec.y) ** 2);
                if (dM < 2) { pos[i * 3] += (pos[i * 3] - mouseVec.x) * 0.02; pos[i * 3 + 1] += (pos[i * 3 + 1] - mouseVec.y) * 0.02; }

                // Mouse Link
                if (dM < 2.5 && lIdx < lineMaxConnections) {
                    lPos[lIdx * 6] = pos[i * 3]; lPos[lIdx * 6 + 1] = pos[i * 3 + 1]; lPos[lIdx * 6 + 2] = pos[i * 3 + 2];
                    lPos[lIdx * 6 + 3] = mouseVec.x; lPos[lIdx * 6 + 4] = mouseVec.y; lPos[lIdx * 6 + 5] = mouseVec.z;
                    lIdx++;
                }

                // Inter-particle links (SKIPPED ON MOBILE OR SIMPLIFIED)
                if (!isMobile) {
                    for (let j = i + 1; j < particleCount && lIdx < lineMaxConnections; j++) {
                        const d = Math.sqrt((pos[i * 3] - pos[j * 3]) ** 2 + (pos[i * 3 + 1] - pos[j * 3 + 1]) ** 2 + (pos[i * 3 + 2] - pos[j * 3 + 2]) ** 2);
                        if (d < 1.5) {
                            lPos[lIdx * 6] = pos[i * 3]; lPos[lIdx * 6 + 1] = pos[i * 3 + 1]; lPos[lIdx * 6 + 2] = pos[i * 3 + 2];
                            lPos[lIdx * 6 + 3] = pos[j * 3]; lPos[lIdx * 6 + 4] = pos[j * 3 + 1]; lPos[lIdx * 6 + 5] = pos[j * 3 + 2];
                            lIdx++;
                        }
                    }
                }
            }
            // Clear rest
            for (let k = lIdx; k < lineMaxConnections; k++) { for (let m = 0; m < 6; m++) lPos[k * 6 + m] = 0; }
            particlesGeo.attributes.position.needsUpdate = true;
            lineGeo.attributes.position.needsUpdate = true;

            camera.position.x += (mouseRef.current.x * 0.8 - camera.position.x) * 0.05;
            camera.position.y += (-mouseRef.current.y * 0.8 - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
            animId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animId);

            // Dispose of all Three.js resources
            if (componentsRef.current) {
                const { renderer, scene, coreMesh, shellMesh, particlesGeo, lineGeo } = componentsRef.current;

                // Dispose materials
                (coreMesh.material as THREE.Material).dispose();
                (shellMesh.material as THREE.Material).dispose();
                (particles.material as THREE.Material).dispose();
                (lines.material as THREE.Material).dispose();
                fragments.forEach(f => (f.material as THREE.Material).dispose());
                fragMat.dispose(); // Dispose the shared fragment material

                // Dispose geometries
                coreMesh.geometry.dispose(); // Dispose current core geometry
                shellMesh.geometry.dispose(); // Dispose current shell geometry
                placeholderGeo.dispose(); // Dispose the initial placeholder geometry
                fragGeo.dispose(); // Dispose the shared fragment geometry
                particlesGeo.dispose();
                lineGeo.dispose();

                scene.clear(); // Clear all objects from the scene
                renderer.dispose();
                if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
            }
            componentsRef.current = null;
        };
    }, []);

    // ─── Phase 2: Reactive Geometry Update (Fast) ───
    useEffect(() => {
        if (!componentsRef.current) return;
        const { coreMesh, shellMesh } = componentsRef.current;
        const s = geometrySeed % 3;

        const mapping: Record<string, THREE.BufferGeometry> = {
            'Todas': s === 0 ? new THREE.IcosahedronGeometry(0.8, 1) : s === 1 ? new THREE.TorusKnotGeometry(0.5, 0.2, 128, 16) : new THREE.DodecahedronGeometry(0.8, 0),
            'Calma': new THREE.TorusGeometry(0.6, 0.2, 16, 100),
            'Fuerza': new THREE.DodecahedronGeometry(0.8, 0),
            'Amor': new THREE.SphereGeometry(0.8, 32, 32),
            'Crecimiento': new THREE.OctahedronGeometry(0.8, 0),
            'Abundancia': new THREE.IcosahedronGeometry(0.9, 0),
            'Confianza': new THREE.TetrahedronGeometry(0.9, 0),
            'Claridad': new THREE.OctahedronGeometry(0.8, 2),
            'Bienestar': new THREE.CapsuleGeometry(0.4, 0.8, 4, 16),
        };

        const newGeo = mapping[currentVibe] || mapping['Todas'];

        // Dispose old and swap
        const oldCoreGeo = coreMesh.geometry;
        const oldShellGeo = shellMesh.geometry;

        coreMesh.geometry = newGeo;
        shellMesh.geometry = newGeo.clone();

        // Important: Garbage collection
        // Only dispose if it's not the initial placeholder geometry
        // The placeholder geometry is disposed in the main cleanup effect
        if (oldCoreGeo.name !== 'placeholder') {
            oldCoreGeo.dispose();
            oldShellGeo.dispose();
        }
    }, [currentVibe, geometrySeed]);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className="fixed inset-0 z-0 pointer-events-none transition-colors duration-1000"
            style={{ background: 'linear-gradient(135deg, #0a1428 0%, #0d1f2d 40%, #0a1212 100%)' }}
        />
    );
};
