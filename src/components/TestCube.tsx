"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

/**
 * A simple test component to verify that Three.js is working correctly
 */
const TestCube = () => {
  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#111' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Large red box that should be very visible */}
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="red" />
        </mesh>
        
        <gridHelper args={[10, 10]} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default TestCube;
