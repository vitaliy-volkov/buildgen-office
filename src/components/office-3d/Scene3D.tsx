import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useOfficeStore } from "@/store/office-store";
import { Environment3D } from "./Environment3D";
import { OfficeLayout3D } from "./OfficeLayout3D";
import { AgentCharacter } from "./AgentCharacter";

const SCENE_CENTER: [number, number, number] = [8, 0, 6];
const BG_COLOR = "#e8ecf2";

function SceneContent() {
  const agents = useOfficeStore((s) => s.agents);
  const agentList = Array.from(agents.values());

  return (
    <>
      {/* Set WebGL clear color so the background is light, not black */}
      <color attach="background" args={[BG_COLOR]} />
      <OrbitControls
        enableRotate={true}
        enablePan={true}
        enableZoom={true}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.8}
        minDistance={10}
        maxDistance={40}
        target={SCENE_CENTER}
        enableDamping
        dampingFactor={0.08}
      />
      <Environment3D />
      <OfficeLayout3D />
      {agentList.map((agent) => (
        <AgentCharacter key={agent.id} agent={agent} />
      ))}
    </>
  );
}

export default function Scene3D() {
  return (
    <div className="h-full w-full">
      <Canvas
        gl={{ antialias: true, alpha: false }}
        shadows
        camera={{
          fov: 42,
          position: [22, 15, 22],
          near: 0.1,
          far: 200,
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
