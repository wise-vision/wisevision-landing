import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Head from 'next/head';

// Ultra-simple demo page that shows basic Three.js capabilities
export default function BasicDemo() {
  return (
    <>
      <Head>
        <title>Basic Three.js Demo</title>
        <meta name="description" content="A simple Three.js demo page" />
      </Head>
      
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#000' }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          {/* Red cube */}
          <mesh position={[-3, 0, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="red" />
          </mesh>
          
          {/* Blue sphere */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial color="blue" />
          </mesh>
          
          {/* Green cone */}
          <mesh position={[3, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[1, 2, 32]} />
            <meshStandardMaterial color="green" />
          </mesh>
          
          <OrbitControls />
        </Canvas>
        
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          color: 'white',
          padding: '10px',
          background: 'rgba(0,0,0,0.7)',
          borderRadius: '5px'
        }}>
          <p>This is a basic Three.js demo with simple objects</p>
        </div>
      </div>
    </>
  );
}
