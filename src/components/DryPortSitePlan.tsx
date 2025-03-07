"use client"; 

import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Group } from 'three';

// Maximum simplification but with visual appeal
const DryPortSitePlan = ({ 
  filter = 'all', 
  highlight = 'none',
  onLoad = () => {}
}: { 
  filter?: string, 
  highlight?: string,
  onLoad?: () => void
}) => {
  const [loadError, setLoadError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadedRef = useRef(false);

  // Function to handle successful loading
  const handleSceneLoaded = () => {
    console.log("Scene loaded successfully, clearing timeout");
    
    // Clear the timeout when the scene loads
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Flag that we've loaded
    loadedRef.current = true;
    
    // Call the onLoad callback
    try {
      if (onLoad) onLoad();
    } catch (err) {
      console.error("Error calling onLoad callback:", err);
    }
  };

  useEffect(() => {
    console.log("DryPortSitePlan component mounted");
    
    // Set a timeout to detect if the content doesn't load
    timeoutRef.current = setTimeout(() => {
      // Only show the error if we haven't already loaded
      if (!loadedRef.current) {
        console.log("Visualization taking too long to load, showing fallback");
        setLoadError("Visualization is taking too long to load.");
      }
    }, 8000);
    
    return () => {
      // Clean up the timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []); // Remove onLoad from dependencies to avoid re-running effect

  // If there's an error and we haven't loaded, show error screen
  if (loadError && !loadedRef.current) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#000',
        color: 'white',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2>Unable to load visualization</h2>
        <p>{loadError}</p>
        <p>Please try the "Simple View" option from the controls panel instead.</p>
        
        {/* Technical info section */}
        <div style={{ marginTop: '30px' }}>
          <h3>Technical Information:</h3>
          <ul style={{ textAlign: 'left' }}>
            <li>Filter: {filter}</li>
            <li>Highlight: {highlight}</li>
          </ul>
        </div>
        
        <button 
          onClick={() => window.location.reload()} 
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#000000' }}>
      <Canvas 
        camera={{ position: [0, 15, 30], fov: 60 }}
        shadows
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }}
        onCreated={() => {
          console.log("Canvas created successfully");
          // Mark as loaded when canvas is created
          handleSceneLoaded();
        }}
      >
        {/* Enhanced visual scene with port-like elements */}
        <EnhancedDryPortScene filter={filter} highlight={highlight} />
      </Canvas>
      
      {/* Debug information overlay */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        maxWidth: '300px',
        zIndex: 100
      }}>
        <div><strong>Filter:</strong> {filter}</div>
        <div><strong>Highlight:</strong> {highlight}</div>
        <div><strong>Renderer:</strong> Enhanced Scene</div>
      </div>
    </div>
  );
};

// Port outline component
const PortOutline = () => {
  return (
    <mesh position={[0, -0.48, 0]} rotation={[-Math.PI/2, 0, 0]}>
      <ringGeometry args={[39, 40, 32]} />
      <meshBasicMaterial color="#4299e1" />
    </mesh>
  );
};

// Warehouse component
const Warehouse = ({ position, size, color, name }: { position: [number, number, number], size: [number, number, number], color: string, name: string }) => {
  return (
    <group position={position}>
      {/* Main building */}
      <mesh position={[0, size[1]/2, 0]} castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, size[1] + size[1]/8, 0]} castShadow>
        <coneGeometry args={[Math.max(size[0], size[2])/1.5, size[1]/4, 4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, size[1] + size[1]/4 + 1, 0]}
        fontSize={1.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

// Container stack component
const ContainerStack = ({ position, color }: { position: [number, number, number], color: string }) => {
  return (
    <group position={position}>
      {/* 3 containers stacked */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[5, 1.5, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      <mesh position={[0, 2.25, 0]} castShadow>
        <boxGeometry args={[5, 1.5, 2]} />
        <meshStandardMaterial color={color} metalness={0.1} />
      </mesh>
      
      <mesh position={[0, 3.75, 0]} castShadow>
        <boxGeometry args={[5, 1.5, 2]} />
        <meshStandardMaterial color={color} metalness={0.2} />
      </mesh>
    </group>
  );
};

// Container yard with container stacks
const ContainerYard = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Container yard base */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[25, 0.1, 15]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      
      {/* Container stacks */}
      <ContainerStack position={[-8, 0, -5]} color="#f59e0b" />
      <ContainerStack position={[-8, 0, 0]} color="#ef4444" />
      <ContainerStack position={[-8, 0, 5]} color="#10b981" />
      
      <ContainerStack position={[0, 0, -5]} color="#3b82f6" />
      <ContainerStack position={[0, 0, 0]} color="#8b5cf6" />
      <ContainerStack position={[0, 0, 5]} color="#ec4899" />
      
      <ContainerStack position={[8, 0, -5]} color="#84cc16" />
      <ContainerStack position={[8, 0, 0]} color="#f97316" />
      <ContainerStack position={[8, 0, 5]} color="#06b6d4" />
      
      {/* Label */}
      <Text
        position={[0, 4, 0]}
        fontSize={1.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Container Storage
      </Text>
    </group>
  );
};

// Moving train component
const MovingTrain = () => {
  const trainRef = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    if (trainRef.current) {
      // Move the train along x-axis
      trainRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.2) * 25;
    }
  });
  
  return (
    <group ref={trainRef} position={[0, 0.8, 0]}>
      {/* Locomotive */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[4, 1.6, 1.8]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
      
      {/* Cab */}
      <mesh position={[1.5, 0.4, 0]} castShadow>
        <boxGeometry args={[1, 2.4, 1.8]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      
      {/* Cargo cars */}
      <mesh position={[-4, 0, 0]} castShadow>
        <boxGeometry args={[3, 1.6, 1.8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      
      <mesh position={[-8, 0, 0]} castShadow>
        <boxGeometry args={[3, 1.6, 1.8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      
      <mesh position={[-12, 0, 0]} castShadow>
        <boxGeometry args={[3, 1.6, 1.8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
};

// Railway track with train
const Railway = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Tracks */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[60, 0.1, 3]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      
      {/* Rails */}
      <mesh position={[0, 0.05, -0.8]} receiveShadow>
        <boxGeometry args={[60, 0.1, 0.2]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} />
      </mesh>
      
      <mesh position={[0, 0.05, 0.8]} receiveShadow>
        <boxGeometry args={[60, 0.1, 0.2]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} />
      </mesh>
      
      {/* Moving train */}
      <MovingTrain />
      
      {/* Label */}
      <Text
        position={[0, 3, 5]}
        fontSize={1.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Railway Line
      </Text>
    </group>
  );
};

// Road component
const Road = ({ position, rotation, length }: { position: [number, number, number], rotation: [number, number, number], length: number }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[length, 0.1, 4]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      
      {/* Road markings */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[length, 0.2]} />
        <meshBasicMaterial color="white" opacity={0.7} transparent={true} />
      </mesh>
    </group>
  );
};

// Moving truck component
const MovingTruck = ({ position = [0, 0, 0], direction = 1, speed = 0.1, color = "#dc2626" }: { position?: [number, number, number], direction?: number, speed?: number, color?: string }) => {
  const truckRef = useRef<Group>(null);
  
  useFrame(() => {
    if (truckRef.current) {
      // Move the truck along x-axis
      truckRef.current.position.x += speed * direction;
      
      // Loop position when out of bounds
      if (direction > 0 && truckRef.current.position.x > 30) {
        truckRef.current.position.x = -30;
      } else if (direction < 0 && truckRef.current.position.x < -30) {
        truckRef.current.position.x = 30;
      }
    }
  });
  
  return (
    <group position={position}>
      <group 
        ref={truckRef} 
        position={[0, 0.8, 0]}
        rotation={[0, direction > 0 ? 0 : Math.PI, 0]} // Face direction of travel
      >
        {/* Truck body */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[3, 1.6, 1.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Truck cabin */}
        <mesh position={[-1.2, 0.4, 0]} castShadow>
          <boxGeometry args={[1, 1, 1.8]} />
          <meshStandardMaterial color={color} metalness={0.2} />
        </mesh>
        
        {/* Windows */}
        <mesh position={[-1.71, 0.4, 0]} castShadow>
          <boxGeometry args={[0.1, 0.6, 1.4]} />
          <meshStandardMaterial color="#90cdf4" opacity={0.7} transparent={true} metalness={0.8} />
        </mesh>
        
        {/* Wheels */}
        <mesh position={[-1, 0, -0.9]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[-1, 0, 0.9]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0.8, 0, -0.9]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0.8, 0, 0.9]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>
    </group>
  );
};

// Enhanced scene component with more port-like elements
const EnhancedDryPortScene = ({ filter, highlight }: { filter: string, highlight: string }) => {
  return (
    <>
      {/* Lighting for better visual appearance */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <hemisphereLight args={['#87ceeb', '#4a6a8a', 0.5]} />
      
      {/* Base ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      
      {/* Grid for reference */}
      <gridHelper args={[80, 40]} position={[0, -0.49, 0]} />
      
      {/* Port outline - large rectangle */}
      <PortOutline />
      
      {/* Main title */}
      <Text
        position={[0, 8, 0]}
        fontSize={4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        DRY PORT FACILITY
      </Text>
      
      {/* Warehouses */}
      <Warehouse position={[-15, 0, -10]} size={[10, 5, 8]} color="#1e40af" name="Main Warehouse" />
      <Warehouse position={[15, 0, -10]} size={[12, 4, 6]} color="#0f766e" name="Storage Facility" />
      
      {/* Container area */}
      <ContainerYard position={[0, 0, 5]} />
      
      {/* Railway with moving train */}
      <Railway position={[0, 0, -20]} />
      
      {/* Roads */}
      <Road position={[0, 0, 15]} rotation={[0, 0, 0]} length={60} />
      <Road position={[-20, 0, 0]} rotation={[0, Math.PI/2, 0]} length={30} />
      
      {/* Moving trucks */}
      <MovingTruck position={[0, 0, 15]} direction={1} speed={0.1} />
      <MovingTruck position={[15, 0, 15]} direction={-1} speed={0.08} color="#5a4fcf" />
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={100}
        maxPolarAngle={Math.PI/2.2} // Limit to prevent seeing under the ground
      />
    </>
  );
};

export default DryPortSitePlan;
