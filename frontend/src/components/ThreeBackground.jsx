import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Moon = () => {
  const meshRef = useRef();
  
  try {
    const gltf = useLoader(GLTFLoader, '/assets/scene.gltf');
    
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.005;
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      }
    });

    return (
      <primitive 
        ref={meshRef}
        object={gltf.scene} 
        scale={[2, 2, 2]} 
        position={[3, 0, -2]}
      />
    );
  } catch (error) {
    // Fallback to simple sphere if GLTF fails to load
    return (
      <Sphere ref={meshRef} args={[1, 32, 32]} position={[3, 0, -2]} scale={[2, 2, 2]}>
        <meshStandardMaterial 
          color="#e5e7eb" 
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>
    );
  }
};

const FloatingParticles = () => {
  const particlesRef = useRef();
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.rotation.x += 0.0005;
    }
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4f46e5"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#4f46e5" />
        
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
        
        <Moon />
        <FloatingParticles />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;