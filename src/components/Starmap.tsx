import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Line, Html } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

// Utility to generate a stable pseudo-random seeded sequence based on topic names
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  return () => {
    h = Math.imul(741103597, h);
    return ((h >>> 0) / 4294967296);
  };
}

interface StarmapNode {
  id: string;
  topic: string;
  subject: string;
  completed: boolean;
  position: [number, number, number];
}

interface StarmapProps {
  topics: { id: string, subject: string, topic: string, completed: boolean }[];
  onNodeClick: (subject: string, topic: string) => void;
}

// ═══════════ INDIVIDUAL STAR COMPONENT ═══════════
function StarNode({ node, onClick }: { node: StarmapNode, onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Matching the constellation planets to the star/sun color (Solar Yellow)
  const starColor = node.completed ? "#FFC737" : "#FFD56B";
  const emissiveColor = node.completed ? "#FFC737" : "#FFC737"; 
  const emissiveIntensity = hovered ? 2.5 : (node.completed ? 1.5 : 0.4); // Dimmer glow for unexplored

  useFrame((state, delta) => {
    if (meshRef.current) {
        // Subtle pulsing for completed or hovered nodes
        if (node.completed || hovered) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
            meshRef.current.scale.set(scale, scale, scale);
        }
    }
  });

  return (
    <group position={node.position}>
      <mesh 
        ref={meshRef} 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.6, 32, 32]} /> {/* Increased size to 0.6 */}
        <meshStandardMaterial 
          color={starColor} 
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          toneMapped={false} // Guarantees the color won't be muted by the renderer
        />
      </mesh>

      {/* HTML Label on Hover */}
      {hovered && (
        <Html distanceFactor={15} zIndexRange={[100, 0]}>
          <div className="bg-[var(--color-surface2)]/90 backdrop-blur-md border border-[var(--color-border)] px-3 py-2 rounded-lg pointer-events-none transform -translate-x-1/2 -translate-y-[120%] whitespace-nowrap min-w-max shadow-[0_0_20px_rgba(255,199,55,0.2)]">
            <div className="text-[10px] uppercase font-bold text-[var(--color-accent)] mb-1 font-[Orbitron] tracking-widest">{node.subject}</div>
            <div className="text-sm text-white font-semibold">{node.topic}</div>
            <div className={`mt-1 text-[9px] px-2 py-0.5 rounded-full inline-block ${node.completed ? 'bg-[var(--color-green)]/20 text-[var(--color-green)] border border-[var(--color-green)]/30' : 'bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-border)]'}`}>
                {node.completed ? 'MASTERED' : 'UNEXPLORED'}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ═══════════ CONSTELLATION CONNECTOR ═══════════
function ConstellationLines({ nodes }: { nodes: StarmapNode[] }) {
  // Group nodes by subject to draw lines between sequential topics in the same subject
  const linesBySubject = useMemo(() => {
    const subjects: Record<string, [number, number, number][]> = {};
    const colors: Record<string, string> = {};

    nodes.forEach(node => {
        if (!subjects[node.subject]) {
            subjects[node.subject] = [];
            // If the first node in this subject is completed, color line yellow, else bright blue/grey
            colors[node.subject] = node.completed ? "#FFC737" : "#88CCFF"; 
        }
        subjects[node.subject].push(node.position);
        
        // If any node in the path is completed, upgrade the path color to glow
        if (node.completed) colors[node.subject] = "#FFC737";
    });

    return Object.entries(subjects).map(([subject, points]) => ({
      subject,
      points,
      color: colors[subject]
    }));
  }, [nodes]);

  return (
    <>
      {linesBySubject.map((line, idx) => (
        line.points.length > 1 && (
          <Line
            key={idx}
            points={line.points}
            color={line.color}
            lineWidth={line.color === "#FFC737" ? 3 : 2} // Thicker lines
            dashed={line.color !== "#FFC737"}
            dashScale={50}
            dashSize={2}
            dashOffset={0}
            transparent
            opacity={line.color === "#FFC737" ? 1.0 : 0.7} // Greatly increased opacity
          />
        )
      ))}
    </>
  );
}

// ═══════════ MAIN STARMAP COMPONENT ═══════════
export default function Starmap({ topics, onNodeClick }: StarmapProps) {
  
  // Transform topics into 3D spaced nodes
  const nodes = useMemo(() => {
    const spread = 25; // Galaxy radius (wider because there are many topics)
    return topics.map((item, idx) => {
      const rand = seededRandom(item.topic + item.subject);
      
      // Calculate a spiral/galaxy placement
      const angle = idx * 0.8 + rand() * 0.5;
      const radius = 2 + (idx * 0.2) + rand() * 2;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (rand() - 0.5) * spread * 0.5; // Vertical spread

      return {
        id: item.id,
        topic: item.topic,
        subject: item.subject,
        completed: item.completed,
        position: [x, y, z] as [number, number, number]
      };
    });
  }, [topics]);

  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-transparent">
      <Canvas 
        camera={{ position: [0, 8, 20], fov: 45 }}
        gl={{ antialias: true, alpha: true, toneMappingExposure: 1.5 }}
      >
        <fog attach="fog" args={["#050505", 25, 80]} /> {/* Pushed fog extremely far back */}

        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          
          <ambientLight intensity={1.5} /> {/* Increased ambient light */}
          <pointLight position={[0, 0, 0]} intensity={3} color="#FFC737" /> {/* Increased core light */}

          {/* Render Connections */}
          <ConstellationLines nodes={nodes} />

          {/* Render Stars */}
          {nodes.map(node => (
            <StarNode key={node.id} node={node} onClick={() => onNodeClick(node.subject, node.topic)} />
          ))}

          {/* Galaxy Center Glow */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#FFC737" transparent opacity={0.1} />
          </mesh>

          {/* Controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            minDistance={5}
            maxDistance={35}
            autoRotate
            autoRotateSpeed={0.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
