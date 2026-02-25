import { useMemo } from "react";
import * as THREE from "three";

const WALL_HEIGHT = 2.8;
const WALL_THICKNESS = 0.12;
const FLOOR_COLOR = "#d4dbe6";
const WALL_COLOR = "#c8d0dc";
const WALL_EDGE_COLOR = "#9ca8b8";
const WINDOW_COLOR = "#a8d4f5";
const WINDOW_EMISSIVE = "#7ec8f0";

function Wall({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={WALL_COLOR} roughness={0.75} metalness={0.02} />
    </mesh>
  );
}

function WallWithWindows({
  start,
  end,
  windowCount = 2,
  side = "front",
}: {
  start: [number, number, number];
  end: [number, number, number];
  windowCount?: number;
  side?: "front" | "back" | "left" | "right";
}) {
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[2] + end[2]) / 2;

  const isXAxis = Math.abs(dx) > Math.abs(dz);
  const rotY = isXAxis ? 0 : Math.PI / 2;

  const wallThick = WALL_THICKNESS;
  const windowWidth = 1.2;
  const windowHeight = 1.3;
  const windowY = 1.3;

  const windows = useMemo(() => {
    const wins: Array<{ pos: [number, number, number] }> = [];
    for (let i = 1; i <= windowCount; i++) {
      const t = i / (windowCount + 1);
      wins.push({
        pos: [start[0] + dx * t, windowY, start[2] + dz * t],
      });
    }
    return wins;
  }, [start, dx, dz, windowCount, windowY]);

  const thickDir: [number, number, number] = isXAxis ? [0, 0, wallThick] : [wallThick, 0, 0];

  return (
    <group>
      <mesh
        position={[midX, WALL_HEIGHT / 2, midZ]}
        rotation={[0, rotY, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[length, WALL_HEIGHT, wallThick]} />
        <meshStandardMaterial
          color={WALL_COLOR}
          roughness={0.75}
          metalness={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wall top edge */}
      <mesh position={[midX, WALL_HEIGHT - 0.02, midZ]} rotation={[0, rotY, 0]}>
        <boxGeometry args={[length, 0.04, wallThick + 0.02]} />
        <meshStandardMaterial color={WALL_EDGE_COLOR} roughness={0.5} />
      </mesh>

      {/* Windows */}
      {windows.map((w, i) => (
        <mesh
          key={`win-${side}-${i}`}
          position={[w.pos[0] + thickDir[0] * 0.5, w.pos[1], w.pos[2] + thickDir[2] * 0.5]}
          rotation={[0, rotY, 0]}
        >
          <planeGeometry args={[windowWidth, windowHeight]} />
          <meshStandardMaterial
            color={WINDOW_COLOR}
            emissive={WINDOW_EMISSIVE}
            emissiveIntensity={0.15}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function Stairs({
  position,
  rotation = 0,
  steps = 6,
}: {
  position: [number, number, number];
  rotation?: number;
  steps?: number;
}) {
  const stepElements = useMemo(() => {
    const elems: Array<{ y: number; z: number }> = [];
    for (let i = 0; i < steps; i++) {
      elems.push({
        y: (i * WALL_HEIGHT * 0.4) / steps,
        z: (i * 1.5) / steps,
      });
    }
    return elems;
  }, [steps]);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {stepElements.map((s, i) => (
        <mesh key={`step-${i}`} position={[0, s.y + 0.05, s.z]} castShadow>
          <boxGeometry args={[0.8, 0.1, 1.5 / steps + 0.02]} />
          <meshStandardMaterial color="#b0b8c4" roughness={0.6} />
        </mesh>
      ))}
      {/* Railing */}
      <mesh position={[0.45, WALL_HEIGHT * 0.25, 0.75]}>
        <boxGeometry args={[0.03, WALL_HEIGHT * 0.35, 1.6]} />
        <meshStandardMaterial color="#8898a8" roughness={0.4} metalness={0.4} />
      </mesh>
    </group>
  );
}

function ServerRack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.5, 1.8, 0.4]} />
        <meshStandardMaterial color="#5a6878" roughness={0.5} metalness={0.35} />
      </mesh>
      {[0.3, 0.6, 0.9, 1.2, 1.5].map((y) => (
        <mesh key={`led-${y}`} position={[0.26, y, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

export function Environment3D() {
  return (
    <group>
      {/* === Lighting — bright, warm office === */}
      <ambientLight intensity={0.65} color="#f5f0e8" />
      <directionalLight
        position={[12, 18, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.001}
        color="#fff8ee"
      />
      <directionalLight position={[-8, 10, -5]} intensity={0.4} color="#dde4f0" />
      <hemisphereLight args={["#e0e8f5", "#b0a090", 0.4]} />

      {/* === Ground / Base Platform === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, -0.08, 6]} receiveShadow>
        <planeGeometry args={[22, 18]} />
        <meshStandardMaterial color="#bcc4d0" roughness={0.95} />
      </mesh>

      {/* Platform edge (subtle 3D depth) */}
      <mesh position={[8, -0.04, 6]}>
        <boxGeometry args={[17, 0.08, 13]} />
        <meshStandardMaterial color="#a8b2c0" roughness={0.8} />
      </mesh>

      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, 0.01, 6]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.7} metalness={0.02} />
      </mesh>

      {/* Floor grid lines (very subtle) */}
      <gridHelper args={[16, 16, "#c0c8d4", "#cad2dc"]} position={[8, 0.02, 6]} />

      {/* === Walls === */}
      {/* Back wall (north) */}
      <WallWithWindows start={[0, 0, 0]} end={[16, 0, 0]} windowCount={4} side="back" />
      {/* Left wall (west) */}
      <WallWithWindows start={[0, 0, 0]} end={[0, 0, 12]} windowCount={3} side="left" />
      {/* Right wall (east) — partial, open section in middle */}
      <Wall position={[16, WALL_HEIGHT / 2, 2]} size={[WALL_THICKNESS, WALL_HEIGHT, 4]} />
      <Wall position={[16, WALL_HEIGHT / 2, 10]} size={[WALL_THICKNESS, WALL_HEIGHT, 4]} />
      {/* Right wall windows */}
      {[2, 10].map((z) => (
        <mesh key={`rwin-${z}`} position={[16.07, 1.3, z]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.2, 1.3]} />
          <meshStandardMaterial
            color={WINDOW_COLOR}
            emissive={WINDOW_EMISSIVE}
            emissiveIntensity={0.15}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* === Interior Dividers (glass-like, lower) === */}
      {/* Divider between desk zone and meeting zone */}
      <Wall position={[8, WALL_HEIGHT * 0.35, 3]} size={[WALL_THICKNESS, WALL_HEIGHT * 0.7, 5.5]} />
      {/* Top accent stripe on divider */}
      <mesh position={[8, WALL_HEIGHT * 0.7, 3]}>
        <boxGeometry args={[0.04, 0.03, 5.5]} />
        <meshStandardMaterial color="#5b9bd5" emissive="#4a8ac4" emissiveIntensity={0.2} />
      </mesh>

      {/* Divider between work area and lounge */}
      <Wall
        position={[8, WALL_HEIGHT * 0.28, 9]}
        size={[WALL_THICKNESS, WALL_HEIGHT * 0.56, 5.5]}
      />

      {/* Horizontal divider separating top/bottom zones */}
      <Wall position={[4, WALL_HEIGHT * 0.3, 6]} size={[7.5, WALL_HEIGHT * 0.6, WALL_THICKNESS]} />

      {/* === Stairs === */}
      <Stairs position={[15, 0, 5.5]} rotation={Math.PI} steps={5} />

      {/* === Server Racks === */}
      <ServerRack position={[15.2, 0, 1]} />
      <ServerRack position={[15.2, 0, 1.7]} />
    </group>
  );
}
