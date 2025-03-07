"use client"; // For Next.js 13+ with app directory

// Required packages:
// npm install @react-three/fiber @react-three/drei three @types/three

import { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Text } from '@react-three/drei';
import { MathUtils, Group } from 'three'; // Add Group import from three
import LoadingProgress from './LoadingProgress';

// Define enhanced types for our data
interface DryPortObject {
  id: string;
  type: 'train' | 'warehouse' | 'container' | 'forklift' | 'truck' | 'sensor';
  name: string;
  description: string;
  position: [number, number, number]; // x, y, z in 3D space
  dimensions?: [number, number, number]; // width, height, depth
  rotation?: [number, number, number]; // rotation in radians
  color?: string;
  status?: string; // e.g., "Loaded", "In Transit", "Damaged"
  module?: string; // e.g., "Transport Management", "Fleet Management"
  sensorData?: {
    temperature?: number;
    humidity?: number;
    batteryLevel?: number;
    lastUpdated?: string;
    [key: string]: any;
  };
}

// Enhanced mock data
const mockData: DryPortObject[] = [
  // Trains
  { 
    id: 'train1', 
    type: 'train', 
    name: 'Express Freight 101',
    description: 'Connected to Transport Management System for real-time scheduling and tracking.', 
    position: [-5, 0, 0], 
    dimensions: [4, 1, 1], 
    color: '#4285F4',
    status: 'Arriving',
    module: 'Transport Management'
  },
  { 
    id: 'train2', 
    type: 'train', 
    name: 'Cargo Express 202',
    description: 'AI-optimized loading sequence based on destination priorities.', 
    position: [5, 0, 0], 
    dimensions: [5, 1, 1], 
    color: '#34A853',
    status: 'Loading',
    module: 'Transport Management'
  },
  
  // Warehouses
  { 
    id: 'wh1', 
    type: 'warehouse', 
    name: 'General Storage Hub',
    description: 'Smart inventory management with automated stock level monitoring.', 
    position: [-10, 0, -10], 
    dimensions: [5, 3, 5], 
    color: '#FBBC05',
    module: 'Inventory Management'
  },
  { 
    id: 'wh2', 
    type: 'warehouse', 
    name: 'High-Security Storage',
    description: 'Temperature-controlled facility for sensitive goods with access control.', 
    position: [10, 0, -10], 
    dimensions: [4, 4, 4], 
    color: '#EA4335',
    module: 'Security Management'
  },
  { 
    id: 'wh3', 
    type: 'warehouse', 
    name: 'Express Distribution Center',
    description: 'Automated sorting and distribution system with conveyor integration.', 
    position: [0, 0, -15], 
    dimensions: [6, 2.5, 4], 
    color: '#9C27B0',
    module: 'Distribution Management'
  },
  
  // Containers
  { 
    id: 'cont1', 
    type: 'container', 
    name: 'Food Goods #F-2234',
    description: 'Temperature-controlled container with IoT monitoring.', 
    position: [-8, 0.5, -5], 
    dimensions: [2, 1.5, 1], 
    color: '#3F51B5',
    status: 'Monitored',
    module: 'Inventory Management'
  },
  { 
    id: 'cont2', 
    type: 'container', 
    name: 'Dangerous Goods #D-5577',
    description: 'RFID tracked hazardous materials with secure lock system.', 
    position: [7, 0.5, -5], 
    dimensions: [2, 1.5, 1], 
    color: '#F44336',
    status: 'Secured',
    module: 'Security Management'
  },
  { 
    id: 'cont3', 
    type: 'container', 
    name: 'Electronics #E-8812',
    description: 'Humidity-controlled container with shock monitors.', 
    position: [0, 0.5, -8], 
    dimensions: [2, 1.5, 1], 
    color: '#2196F3',
    status: 'Ready for Transit',
    module: 'Inventory Management'
  },
  { 
    id: 'cont4', 
    type: 'container', 
    name: 'Medical Supplies #M-1290',
    description: 'Priority shipment with end-to-end temperature logging.', 
    position: [-3, 0.5, -12], 
    dimensions: [2, 1.5, 1], 
    color: '#4CAF50',
    status: 'Priority',
    module: 'Distribution Management'
  },
  
  // Forklifts
  { 
    id: 'fork1', 
    type: 'forklift', 
    name: 'Forklift #FL-01',
    description: 'AI-assisted load optimization with maintenance prediction.', 
    position: [-6, 0, -7], 
    dimensions: [1, 1.2, 1.5], 
    color: '#FFC107',
    status: 'Active',
    module: 'Fleet Management',
    rotation: [0, Math.PI / 4, 0]
  },
  { 
    id: 'fork2', 
    type: 'forklift', 
    name: 'Forklift #FL-02',
    description: 'Real-time location tracking and utilization analytics.', 
    position: [3, 0, -13], 
    dimensions: [1, 1.2, 1.5], 
    color: '#FF9800',
    status: 'Maintenance',
    module: 'Fleet Management',
    rotation: [0, -Math.PI / 3, 0]
  },
  
  // Trucks
  { 
    id: 'truck1', 
    type: 'truck', 
    name: 'Delivery Truck #DT-55',
    description: 'Route-optimized last-mile delivery with capacity planning.', 
    position: [15, 0, 0], 
    dimensions: [3, 2, 1.8], 
    color: '#607D8B',
    status: 'En Route',
    module: 'Transport Management',
    rotation: [0, -Math.PI / 2, 0]
  },
  
  // IoT Sensors
  { 
    id: 'sensor1', 
    type: 'sensor', 
    name: 'Temperature Sensor #TS-01',
    description: 'Real-time temperature monitoring for food goods containers.', 
    position: [-8, 2.5, -5], 
    color: '#00BCD4',
    module: 'IoT Monitoring',
    sensorData: {
      temperature: 2.4,
      humidity: 35,
      batteryLevel: 92,
      lastUpdated: new Date().toISOString()
    }
  },
  { 
    id: 'sensor2', 
    type: 'sensor', 
    name: 'Security Sensor #SS-05',
    description: 'Motion and tamper detection for high-value goods.', 
    position: [7, 2.5, -5], 
    color: '#FF5722',
    module: 'Security Management',
    sensorData: {
      status: 'Secure',
      batteryLevel: 85,
      lastMovement: '2 hrs ago',
      lastUpdated: new Date().toISOString()
    }
  },
  { 
    id: 'sensor3', 
    type: 'sensor', 
    name: 'Environmental Hub #EH-12',
    description: 'Multi-parameter environmental monitoring station.', 
    position: [0, 0.5, 0], 
    color: '#8BC34A',
    module: 'IoT Monitoring',
    sensorData: {
      temperature: 18.6,
      humidity: 42,
      airQuality: 'Good',
      noise: 68,
      batteryLevel: 97,
      lastUpdated: new Date().toISOString()
    }
  },
];

// Ground plane component
const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#111" roughness={0.8} />
      
      {/* Grid lines for visual reference */}
      <gridHelper 
        args={[100, 100, '#333', '#222']} 
        position={[0, 0.01, 0]} 
        rotation={[Math.PI / 2, 0, 0]}
      />
    </mesh>
  );
};

// Train component (enhanced)
const Train = ({ 
  item, 
  onSelect,
  isHighlighted = false 
}: { 
  item: DryPortObject; 
  onSelect: (item: DryPortObject | null) => void;
  isHighlighted?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const width = item.dimensions?.[0] || 4;
  
  // Create train with multiple wagons
  const wagons = [];
  const wagonCount = Math.ceil(width / 1.5);
  
  for (let i = 0; i < wagonCount; i++) {
    wagons.push(
      <mesh 
        key={`${item.id}-wagon-${i}`}
        position={[i * 1.2 - (wagonCount * 1.2 / 2) + 0.6, 0.5, 0]}
        castShadow
      >
        <boxGeometry args={[1, 1, 1.5]} />
        <meshStandardMaterial 
          color={item.color || '#4285F4'} 
          emissive={hovered || isHighlighted ? item.color || '#4285F4' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.8 : (hovered ? 0.3 : 0)}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
    );
  }

  // Add rails
  const rails = (
    <>
      <mesh position={[0, 0, -0.6]} receiveShadow>
        <boxGeometry args={[width + 2, 0.1, 0.2]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 0, 0.6]} receiveShadow>
        <boxGeometry args={[width + 2, 0.1, 0.2]} />
        <meshStandardMaterial color="#555" />
      </mesh>
    </>
  );

  // Add text label above train
  const label = (
    <Text
      position={[0, 1.8, 0]}
      rotation={[0, 0, 0]}
      fontSize={0.4}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      {item.name}
    </Text>
  );

  // Status indicator
  const statusColor = item.status === 'Arriving' ? '#4CAF50' : 
                     item.status === 'Loading' ? '#FFC107' : '#2196F3';
  
  const statusIndicator = (
    <mesh position={[-(wagonCount * 1.2 / 2) - 0.3, 0.5, 0]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={0.5} />
    </mesh>
  );

  return (
    <group 
      position={item.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
    >
      {wagons}
      {rails}
      {label}
      {statusIndicator}
    </group>
  );
};

// Warehouse component (enhanced)
const Warehouse = ({ 
  item, 
  onSelect,
  isHighlighted = false 
}: { 
  item: DryPortObject; 
  onSelect: (item: DryPortObject | null) => void;
  isHighlighted?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const dimensions = item.dimensions || [4, 3, 4];
  
  return (
    <group
      position={item.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
    >
      {/* Main building */}
      <mesh position={[0, dimensions[1]/2, 0]} castShadow>
        <boxGeometry args={dimensions} />
        <meshStandardMaterial 
          color={item.color || '#FBBC05'} 
          emissive={hovered || isHighlighted ? item.color || '#FBBC05' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.8 : (hovered ? 0.3 : 0)}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, dimensions[1] + 0.5, 0]} castShadow>
        <coneGeometry args={[Math.max(dimensions[0], dimensions[2]) / 1.5, 1, 4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Windows */}
      <mesh position={[0, dimensions[1]/2, dimensions[2]/2 + 0.01]} castShadow>
        <planeGeometry args={[dimensions[0] * 0.6, dimensions[1] * 0.4]} />
        <meshStandardMaterial color="#1E88E5" opacity={0.7} transparent={true} metalness={0.8} />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, dimensions[1] + 1.2, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {item.name}
      </Text>
      
      {/* Module indicator */}
      <Text
        position={[0, dimensions[1] + 0.7, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.25}
        color="#AAA"
        anchorX="center"
        anchorY="middle"
      >
        {item.module}
      </Text>
    </group>
  );
};

// Container component
const Container = ({ 
  item, 
  onSelect,
  isHighlighted = false 
}: { 
  item: DryPortObject; 
  onSelect: (item: DryPortObject | null) => void;
  isHighlighted?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const dimensions = item.dimensions || [2, 1.5, 1];
  
  // Status color indicator
  const statusColor = item.status === 'Monitored' ? '#2196F3' : 
                     item.status === 'Secured' ? '#F44336' :
                     item.status === 'Priority' ? '#FF9800' : '#4CAF50';

  return (
    <group
      position={item.position}
      rotation={item.rotation || [0, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
    >
      {/* Main container body */}
      <mesh castShadow>
        <boxGeometry args={dimensions} />
        <meshStandardMaterial 
          color={item.color || '#3F51B5'} 
          emissive={hovered || isHighlighted ? item.color || '#3F51B5' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.8 : (hovered ? 0.3 : 0)}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      
      {/* Container ridges for visual detail */}
      <mesh position={[0, 0, dimensions[2]/2 + 0.01]}>
        <planeGeometry args={[dimensions[0], dimensions[1]]} />
        <meshStandardMaterial 
          color={item.color || '#3F51B5'} 
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      {/* Status indicator */}
      <mesh position={[dimensions[0]/2 - 0.1, dimensions[1]/2 - 0.1, dimensions[2]/2 + 0.01]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color={statusColor} />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, dimensions[1] + 0.2, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {item.name}
      </Text>
    </group>
  );
};

// Forklift component
const Forklift = ({ 
  item, 
  onSelect,
  isHighlighted = false 
}: { 
  item: DryPortObject; 
  onSelect: (item: DryPortObject | null) => void;
  isHighlighted?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const dimensions = item.dimensions || [1, 1.2, 1.5];
  const groupRef = useRef<Group>(null); // Fixed Group reference
  
  // Simple animation for the forklift
  useFrame((state) => {
    if (item.status === 'Active' && groupRef.current) {
      // Make active forklifts move slightly
      groupRef.current.position.x += Math.sin(state.clock.elapsedTime * 0.5) * 0.002;
      groupRef.current.position.z += Math.cos(state.clock.elapsedTime * 0.3) * 0.002;
    }
  });
  
  return (
    <group
      ref={groupRef}
      position={item.position}
      rotation={item.rotation || [0, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
    >
      {/* Forklift body */}
      <mesh position={[0, dimensions[1]/2, 0]} castShadow>
        <boxGeometry args={[dimensions[0], dimensions[1], dimensions[2]]} />
        <meshStandardMaterial 
          color={item.color || '#FFC107'} 
          emissive={hovered || isHighlighted ? item.color || '#FFC107' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.8 : (hovered ? 0.3 : 0)}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Forks */}
      <mesh position={[dimensions[0]/2 + 0.3, dimensions[1]/4, 0]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.8]} />
        <meshStandardMaterial color="#777" metalness={0.6} />
      </mesh>
      
      {/* Lift mast */}
      <mesh position={[dimensions[0]/2, dimensions[1]/2, 0]} castShadow>
        <boxGeometry args={[0.1, dimensions[1], 0.4]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      
      {/* Wheels - fixed rotation by moving it to mesh rotation */}
      <mesh position={[-dimensions[0]/3, 0.2, dimensions[2]/3]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-dimensions[0]/3, 0.2, -dimensions[2]/3]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      
      {/* Status light */}
      <mesh position={[0, dimensions[1] + 0.1, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={item.status === 'Active' ? '#4CAF50' : '#F44336'} 
          emissive={item.status === 'Active' ? '#4CAF50' : '#F44336'}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, dimensions[1] + 0.4, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {item.name}
      </Text>
    </group>
  );
};

// Truck component
const Truck = ({ 
  item, 
  onSelect,
  isHighlighted = false 
}: { 
  item: DryPortObject; 
  onSelect: (item: DryPortObject | null) => void;
  isHighlighted?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const dimensions = item.dimensions || [3, 2, 1.8];
  const groupRef = useRef<Group>(null); // Fixed Group reference
  
  // Simple animation for the truck if it's en route
  useFrame((state) => {
    if (item.status === 'En Route' && groupRef.current) {
      // Make the truck move slightly to simulate being in motion
      const speed = 0.02;
      groupRef.current.position.x += speed;
      
      // Reset position when it goes too far
      if (groupRef.current.position.x > 25) {
        groupRef.current.position.x = -25;
      }
    }
  });
  
  return (
    <group
      ref={groupRef}
      position={item.position}
      rotation={item.rotation || [0, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
    >
      {/* Truck cabin */}
      <mesh position={[-dimensions[0]/3, dimensions[1]/1.8, 0]} castShadow>
        <boxGeometry args={[dimensions[0]/3, dimensions[1]/1.2, dimensions[2]]} />
        <meshStandardMaterial 
          color={item.color || '#607D8B'} 
          emissive={hovered || isHighlighted ? item.color || '#607D8B' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.8 : (hovered ? 0.3 : 0)}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      
      {/* Truck cargo area */}
      <mesh position={[dimensions[0]/6, dimensions[1]/2, 0]} castShadow>
        <boxGeometry args={[dimensions[0]/1.5, dimensions[1], dimensions[2]]} />
        <meshStandardMaterial 
          color={'#455A64'} 
          emissive={hovered || isHighlighted ? '#455A64' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.8 : (hovered ? 0.3 : 0)}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Wheels - fixed rotation by moving it to mesh rotation */}
      <mesh position={[-dimensions[0]/2.2, 0.3, dimensions[2]/2 - 0.1]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-dimensions[0]/2.2, 0.3, -dimensions[2]/2 + 0.1]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[dimensions[0]/3, 0.3, dimensions[2]/2 - 0.1]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[dimensions[0]/3, 0.3, -dimensions[2]/2 + 0.1]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      
      {/* Windows */}
      <mesh position={[-dimensions[0]/3, dimensions[1]/1.5, dimensions[2]/2 + 0.01]} castShadow>
        <planeGeometry args={[dimensions[0]/3 - 0.2, dimensions[1]/3]} />
        <meshStandardMaterial color="#1E88E5" opacity={0.7} transparent={true} metalness={0.8} />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, dimensions[1] + 0.4, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {item.name}
      </Text>
    </group>
  );
};

// IoT Sensor component
const Sensor = ({ 
  item, 
  onSelect,
  isHighlighted = false 
}: { 
  item: DryPortObject; 
  onSelect: (item: DryPortObject | null) => void;
  isHighlighted?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
  const groupRef = useRef<Group>(null); // Fixed Group reference type
  
  // Pulse animation for sensors
  useFrame((state) => {
    setPulseScale((Math.sin(state.clock.elapsedTime * 2) + 3) / 4 + 0.75);
  });
  
  return (
    <group
      ref={groupRef}
      position={item.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
    >
      {/* Sensor device */}
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial 
          color={item.color || '#00BCD4'} 
          emissive={hovered || isHighlighted ? item.color || '#00BCD4' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.8 : (hovered ? 0.3 : 0)}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      {/* Pulse effect */}
      <mesh scale={[pulseScale, pulseScale, pulseScale]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial 
          color={item.color || '#00BCD4'} 
          transparent={true} 
          opacity={0.2}
        />
      </mesh>
      
      {/* Antenna */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
        <meshStandardMaterial color="#777" />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 0.6, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {item.name}
      </Text>
    </group>
  );
};

// Enhanced tooltip component with real-time data
const ItemTooltip = ({ item }: { item: DryPortObject | null }) => {
  const [sensorValue, setSensorValue] = useState<{[key: string]: any}>({});
  
  // Simulate real-time updates for sensor data
  useEffect(() => {
    if (!item || item.type !== 'sensor') return;
    
    const interval = setInterval(() => {
      if (item.sensorData) {
        const newData = { ...item.sensorData };
        if (newData.temperature !== undefined) {
          newData.temperature += MathUtils.randFloatSpread(0.2);
        }
        if (newData.humidity !== undefined) {
          newData.humidity += MathUtils.randFloatSpread(1);
        }
        if (newData.batteryLevel !== undefined) {
          newData.batteryLevel -= Math.random() * 0.1;
        }
        newData.lastUpdated = new Date().toISOString();
        setSensorValue(newData);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [item]);
  
  if (!item) return null;
  
  return (
    <Html position={[item.position[0], item.position[1] + 4, item.position[2]]}>
      <div style={{
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        fontFamily: 'Arial',
        width: '250px',
        textAlign: 'center',
        transform: 'translate(-50%, -50%)'
      }}>
        <strong>{item.name}</strong>
        <p>{item.description}</p>
        {item.module && <p><em>Module: {item.module}</em></p>}
        {item.status && <p>Status: {item.status}</p>}
        {item.sensorData && (
          <div>
            <p>Temperature: {sensorValue.temperature?.toFixed(1)}°C</p>
            <p>Humidity: {sensorValue.humidity?.toFixed(1)}%</p>
            <p>Battery: {sensorValue.batteryLevel?.toFixed(1)}%</p>
            <p>Last Updated: {new Date(sensorValue.lastUpdated).toLocaleTimeString()}</p>
          </div>
        )}
      </div>
    </Html>
  );
};

// Main scene component
const DryPortScene = ({ 
  filter, 
  highlight 
}: { 
  filter: string, 
  highlight: string 
}) => {
  const [selectedItem, setSelectedItem] = useState<DryPortObject | null>(null);
  
  const handleSelect = (item: DryPortObject | null) => {
    setSelectedItem(item === selectedItem ? null : item);
  };

  // Clear selection when clicking on empty space
  const handleCanvasClick = () => {
    setSelectedItem(null);
  };

  // Filter objects based on the filter prop
  const filteredObjects = mockData.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'transportation' && (item.type === 'train' || item.type === 'truck')) return true;
    if (filter === 'storage' && (item.type === 'warehouse' || item.type === 'container')) return true;
    if (filter === 'sensors' && item.type === 'sensor') return true;
    return false;
  });

  return (
    <group onClick={handleCanvasClick}>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.5} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />
      
      {/* Ground plane */}
      <Ground />
      
      {/* Items from filtered mock data */}
      {filteredObjects.map(item => {
        // Apply highlighting based on highlight prop
        const isHighlighted = 
          highlight === 'activity' && (item.status === 'Active' || item.status === 'Arriving' || item.status === 'En Route') ||
          highlight === 'priority' && item.status === 'Priority';
        
        switch (item.type) {
          case 'train':
            return <Train key={item.id} item={item} onSelect={handleSelect} isHighlighted={isHighlighted} />;
          case 'warehouse':
            return <Warehouse key={item.id} item={item} onSelect={handleSelect} isHighlighted={isHighlighted} />;
          case 'container':
            return <Container key={item.id} item={item} onSelect={handleSelect} isHighlighted={isHighlighted} />;
          case 'forklift':
            return <Forklift key={item.id} item={item} onSelect={handleSelect} isHighlighted={isHighlighted} />;
          case 'truck':
            return <Truck key={item.id} item={item} onSelect={handleSelect} isHighlighted={isHighlighted} />;
          case 'sensor':
            return <Sensor key={item.id} item={item} onSelect={handleSelect} isHighlighted={isHighlighted} />;
          default:
            return null;
        }
      })}
      
      {/* Selection tooltip */}
      {selectedItem && <ItemTooltip item={selectedItem} />}
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
      />
    </group>
  );
};

// Loading fallback
const Loader = () => {
  return (
    <Html center>
      <div style={{ color: 'white', fontSize: '1.5em' }}>
        Loading 3D scene...
      </div>
    </Html>
  );
};

// Main component - updated to accept filter and highlight props
const DryPortVisualization = ({ 
  filter = 'all', 
  highlight = 'none' 
}: { 
  filter?: string, 
  highlight?: string 
}) => {
  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#000' }}>
      <Canvas shadows camera={{ position: [0, 15, 25], fov: 45 }}>
        <Suspense fallback={<LoadingProgress />}>
          <DryPortScene filter={filter} highlight={highlight} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default DryPortVisualization;
