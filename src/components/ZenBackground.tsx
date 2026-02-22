import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ZenBackground — Full-screen Three.js canvas with:
 * - A breathing icosahedron sphere
 * - Floating particles
 * - Slowly rotating color palette
 */
export const ZenBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number>(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // ─── Scene setup ───
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 4;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap for mobile perf
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // ─── Breathing Sphere ───
        const sphereGeo = new THREE.IcosahedronGeometry(1.2, 3);
        const sphereMat = new THREE.MeshStandardMaterial({
            color: 0x0d9488,
            wireframe: true,
            transparent: true,
            opacity: 0.15,
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(sphere);

        // Inner glow sphere
        const glowGeo = new THREE.IcosahedronGeometry(1.15, 2);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x14b8a6,
            transparent: true,
            opacity: 0.04,
        });
        const glowSphere = new THREE.Mesh(glowGeo, glowMat);
        scene.add(glowSphere);

        // ─── Particles ───
        const particleCount = 150;
        const particlesGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
            velocities[i * 3] = (Math.random() - 0.5) * 0.003;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
        }

        particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particlesMat = new THREE.PointsMaterial({
            color: 0x5eead4,
            size: 0.025,
            transparent: true,
            opacity: 0.5,
            sizeAttenuation: true,
        });

        const particles = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particles);

        // ─── Lighting ───
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x14b8a6, 1.5, 10);
        pointLight.position.set(2, 2, 3);
        scene.add(pointLight);

        // ─── Animation loop ───
        const startTime = performance.now();

        const animate = () => {
            const elapsed = (performance.now() - startTime) / 1000;

            // Breathing sphere (4s cycle)
            const breathScale = 1 + Math.sin(elapsed * Math.PI / 2) * 0.08;
            sphere.scale.setScalar(breathScale);
            glowSphere.scale.setScalar(breathScale * 0.98);

            // Slow rotation
            sphere.rotation.y = elapsed * 0.08;
            sphere.rotation.x = elapsed * 0.04;
            glowSphere.rotation.y = elapsed * 0.06;

            // Subtle color shift
            const hue = (elapsed * 0.01) % 1;
            sphereMat.color.setHSL(0.47 + hue * 0.05, 0.7, 0.4);
            particlesMat.color.setHSL(0.45 + hue * 0.08, 0.6, 0.6);

            // Animate particles
            const posArray = particlesGeo.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                posArray[i * 3] += velocities[i * 3];
                posArray[i * 3 + 1] += velocities[i * 3 + 1];
                posArray[i * 3 + 2] += velocities[i * 3 + 2];

                // Wrap around boundaries
                for (let j = 0; j < 3; j++) {
                    const limit = j === 2 ? 2 : 4;
                    if (Math.abs(posArray[i * 3 + j]) > limit) {
                        posArray[i * 3 + j] *= -0.9;
                    }
                }
            }
            particlesGeo.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
            animRef.current = requestAnimationFrame(animate);
        };

        animate();

        // ─── Resize handler ───
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // ─── Cleanup ───
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animRef.current);
            renderer.dispose();
            sphereGeo.dispose();
            sphereMat.dispose();
            glowGeo.dispose();
            glowMat.dispose();
            particlesGeo.dispose();
            particlesMat.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #0a0f18 0%, #0d1f2d 40%, #0a1a1a 100%)' }}
        />
    );
};
