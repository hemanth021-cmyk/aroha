import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from 'three';

// Sub-component for the main Planet
function CorePlanet({ onActivate, isActive }: { onActivate: () => void, isActive: boolean }) {
  const planetRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.05;
      
      // Pulsing effect if active or hovered
      const material = planetRef.current.material as THREE.MeshStandardMaterial;
      if (isActive) {
        material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      } else if (hovered) {
        material.emissiveIntensity = 0.6;
      } else {
        material.emissiveIntensity = 0.4;
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh 
        ref={planetRef} 
        receiveShadow 
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          color={isActive ? "#3a2a5e" : "#1a1a2e"} 
          emissive={isActive ? "#FFC737" : "#2D1B4E"}
          emissiveIntensity={0.4}
          roughness={0.7}
          metalness={0.3}
          wireframe={true} // Sci-fi wireframe aesthetic
        />
        
        {/* Glowing Atmosphere */}
        <mesh scale={[1.05, 1.05, 1.05]}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial 
            color={isActive ? "#FFC737" : "#FFC737"} 
            transparent 
            opacity={isActive ? 0.15 : 0.05} 
            side={THREE.BackSide} 
          />
        </mesh>
      </mesh>
    </Float>
  );
}


// Sub-component for orbiting task satellites
function OrbitingSatellite({ radius, speed, color, offset }: { radius: number, speed: number, color: string, offset: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + offset;
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(t) * radius;
      groupRef.current.position.z = Math.cos(t) * radius;
      // Slight vertical bobbing
      groupRef.current.position.y = Math.sin(t * 2) * 0.5;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.5} 
          roughness={0.2} 
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}

export default function Universe({ onPlanetClick, isBotActive }: { onPlanetClick: () => void, isBotActive: boolean }) {
  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-transparent">
      <Canvas 
        camera={{ position: [0, 2, 8], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={["#050505", 5, 20]} />

        <Suspense fallback={null}>
          {/* Cosmic Environment */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1.5} 
            color="#FFC737" 
            castShadow 
          />
          <pointLight position={[-5, -5, -5]} intensity={1} color="#EB3322" />

          {/* Central Planet */}
          <CorePlanet onActivate={onPlanetClick} isActive={isBotActive} />

          {/* Quest Satellites */}
          <OrbitingSatellite radius={4} speed={0.5} color="#FFC737" offset={0} />
          <OrbitingSatellite radius={5} speed={0.3} color="#EB3322" offset={Math.PI} />
          <OrbitingSatellite radius={4.5} speed={0.4} color="#5cd8a0" offset={Math.PI / 2} />

          {/* Camera Controls */}
          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
