"use client"; // For Next.js 13+ with app directory

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Line } from '@react-three/drei';
import { MathUtils, Group, Shape, Vector2, Vector3 } from 'three';

// Define types for our data
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

// Define types for zone data
interface ZoneProps {
  id: string;
  label: string;
  description: string;
  type: 'warehouse' | 'container-yard' | 'road' | 'track' | 'field' | 'gate' | 'parking' | 'office';
  position: [number, number, number];
  dimensions: [number, number, number?]; // width, length, optional height
  color?: string;
  rotation?: [number, number, number];
}

// Add the missing props interface for IntegratedDryPortVisualization
interface IntegratedDryPortVisualizationProps {
  filter?: string;
  highlight?: string;
}

// Define the site boundary points (approximating the outer boundary of the port)
const siteBoundaryPoints: Vector2[] = [
  new Vector2(-100, -60), // Bottom left
  new Vector2(100, -60),  // Bottom right
  new Vector2(100, 60),   // Top right
  new Vector2(-100, 60),  // Top left
];

// Mock data for all zones in the dry port
const zoneData: ZoneProps[] = [
  // Main fields
  { 
    id: 'fieldE', 
    label: 'Zone E: Future Expansion', 
    description: 'Reserved area for future logistics hub expansion with IoT integration capability.',
    type: 'field',
    position: [-40, 0, 20], 
    dimensions: [50, 40, 0.1], 
    color: '#1B5E20' // Dark green
  },
  {
    id: 'fieldF',
    label: 'Zone F: Storage Area',
    description: 'Primary storage zone with automated inventory tracking and real-time capacity monitoring.',
    type: 'field',
    position: [40, 0, 20],
    dimensions: [50, 40, 0.1],
    color: '#0D47A1' // Dark blue
  },
  
  // Container yards
  {
    id: 'containerYardA',
    label: 'Container Storage A',
    description: 'High-density container stacking area with RFID scanning and weight sensors.',
    type: 'container-yard',
    position: [-20, 0, 0],
    dimensions: [30, 20, 0.5],
    color: '#E65100' // Orange
  },
  {
    id: 'containerYardB',
    label: 'Container Storage B',
    description: 'Temperature-controlled container zone for perishable goods with real-time climate monitoring.',
    type: 'container-yard',
    position: [20, 0, 0],
    dimensions: [30, 20, 0.5],
    color: '#FF9800' // Light orange
  },
  {
    id: 'containerYardC',
    label: 'Container Storage C',
    description: 'Dangerous goods container storage with enhanced security and environmental sensors.',
    type: 'container-yard',
    position: [0, 0, -20],
    dimensions: [25, 15, 0.5],
    color: '#F44336' // Red
  },
  
  // Warehouses - matching the warehouse positions that will have 3D models
  {
    id: 'warehouseZone1',
    label: 'Warehouse Zone #1',
    description: 'Smart warehouse zone with automated sorting system and fulfillment optimization.',
    type: 'warehouse',
    position: [-40, 0, -30],
    dimensions: [30, 30, 0.1],
    color: '#455A64' // Dark blue-grey
  },
  {
    id: 'warehouseZone2',
    label: 'Warehouse Zone #2',
    description: 'Cross-docking facility zone with real-time shipment tracking and automated conveyor system.',
    type: 'warehouse',
    position: [10, 0, -30],
    dimensions: [40, 25, 0.1],
    color: '#546E7A' // Medium blue-grey
  },
  
  // Railway tracks
  {
    id: 'track1',
    label: 'Track 1',
    description: 'Primary rail line with automated cargo scanning and real-time train scheduling.',
    type: 'track',
    position: [-50, 0, -50],
    dimensions: [100, 3, 0.1],
    color: '#757575' // Dark grey
  },
  {
    id: 'track2',
    label: 'Track 2',
    description: 'Secondary rail line with weight-in-motion sensors for freight verification.',
    type: 'track',
    position: [-50, 0, -55],
    dimensions: [100, 3, 0.1],
    color: '#757575' // Dark grey
  },
  {
    id: 'track3',
    label: 'Track 3',
    description: 'Express track for priority shipments with minimal stopping.',
    type: 'track',
    position: [-50, 0, -60],
    dimensions: [100, 3, 0.1],
    color: '#757575' // Dark grey
  },
  
  // Main road
  {
    id: 'highway12',
    label: 'Highway 12',
    description: 'Main access road with automated vehicle recognition and traffic monitoring.',
    type: 'road',
    position: [0, 0, 60],
    dimensions: [200, 10, 0.2],
    color: '#424242' // Asphalt grey
  },
  
  // Parking & offices
  {
    id: 'parking1',
    label: 'Truck Parking',
    description: 'Smart parking area with capacity indicators and reservation system.',
    type: 'parking',
    position: [70, 0, 30],
    dimensions: [20, 30, 0.1],
    color: '#37474F' // Very dark blue-grey
  },
  {
    id: 'office1',
    label: 'Administration Building',
    description: 'Control center with integrated management systems for all port operations.',
    type: 'office',
    position: [80, 0, 0],
    dimensions: [15, 25, 8],
    color: '#1976D2' // Medium blue
  },
  
  // Gates
  {
    id: 'gateA',
    label: 'Gate A',
    description: 'Main entrance with automated license plate recognition and weight bridge.',
    type: 'gate',
    position: [-90, 0, 40],
    dimensions: [10, 5, 3],
    color: '#D32F2F' // Bright red
  },
  {
    id: 'gateB',
    label: 'Gate B',
    description: 'Exit gate with final cargo verification and digital documentation check.',
    type: 'gate',
    position: [90, 0, 40],
    dimensions: [10, 5, 3],
    color: '#D32F2F' // Bright red
  },
  {
    id: 'gateC',
    label: 'Gate C',
    description: 'Railway access checkpoint with automated container scanning system.',
    type: 'gate',
    position: [-90, 0, -40],
    dimensions: [5, 10, 3],
    color: '#D32F2F' // Bright red
  },
  {
    id: 'gateD',
    label: 'Gate D',
    description: 'Service entrance for port personnel with biometric verification.',
    type: 'gate',
    position: [90, 0, -40],
    dimensions: [5, 10, 3],
    color: '#D32F2F' // Bright red
  },
];

// Integrated 3D object data - positioned to align with the site plan
const objectData: DryPortObject[] = [
  // Trains - positioned on the tracks
  { 
    id: 'train1', 
    type: 'train', 
    name: 'Express Freight 101',
    description: 'Connected to Transport Management System for real-time scheduling and tracking.', 
    position: [-30, 0, -50], // Aligned with Track 1
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
    position: [20, 0, -55], // Aligned with Track 2
    dimensions: [5, 1, 1], 
    color: '#34A853',
    status: 'Loading',
    module: 'Transport Management',
    rotation: [0, Math.PI, 0] // Facing the opposite direction
  },
  
  // Warehouses - aligned with warehouse zones
  { 
    id: 'wh1', 
    type: 'warehouse', 
    name: 'General Storage Hub',
    description: 'Smart inventory management with automated stock level monitoring.', 
    position: [-40, 0, -30], // Matching warehouseZone1 position
    dimensions: [5, 3, 5], 
    color: '#FBBC05',
    module: 'Inventory Management'
  },
  { 
    id: 'wh2', 
    type: 'warehouse', 
    name: 'High-Security Storage',
    description: 'Temperature-controlled facility for sensitive goods with access control.', 
    position: [10, 0, -30], // Matching warehouseZone2 position
    dimensions: [4, 4, 4], 
    color: '#EA4335',
    module: 'Security Management'
  },
  { 
    id: 'wh3', 
    type: 'warehouse', 
    name: 'Express Distribution Center',
    description: 'Automated sorting and distribution system with conveyor integration.', 
    position: [-10, 0, -30], // Positioned between warehouses
    dimensions: [6, 2.5, 4], 
    color: '#9C27B0',
    module: 'Distribution Management'
  },
  
  // Containers - positioned in container yards
  { 
    id: 'cont1', 
    type: 'container', 
    name: 'Food Goods #F-2234',
    description: 'Temperature-controlled container with IoT monitoring.', 
    position: [-25, 0.5, -5], // Within Container Storage A
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
    position: [15, 0.5, -5], // Within Container Storage B
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
    position: [-15, 0.5, 5], // Within Container Storage A
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
    position: [0, 0.5, -18], // Within Container Storage C
    dimensions: [2, 1.5, 1], 
    color: '#4CAF50',
    status: 'Priority',
    module: 'Distribution Management'
  },
  
  // Forklifts - positioned near warehouses and container yards
  { 
    id: 'fork1', 
    type: 'forklift', 
    name: 'Forklift #FL-01',
    description: 'AI-assisted load optimization with maintenance prediction.', 
    position: [-30, 0, -25], // Near Warehouse 1
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
    position: [5, 0, -15], // Near Container Storage C
    dimensions: [1, 1.2, 1.5], 
    color: '#FF9800',
    status: 'Maintenance',
    module: 'Fleet Management',
    rotation: [0, -Math.PI / 3, 0]
  },
  
  // IoT Sensors - strategically placed across the port
  { 
    id: 'sensor1', 
    type: 'sensor', 
    name: 'Temperature Sensor #TS-01',
    description: 'Real-time temperature monitoring for food goods containers.', 
    position: [-25, 2.5, -5], // Above container in Container Storage A
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
    position: [15, 2.5, -5], // Above container in Container Storage B
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
    position: [0, 0.5, 20], // Central location in Field F
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

// Component for displaying the port boundary
const PortBoundary = () => {
  // Create a shape from the boundary points
  const shape = new Shape();
  shape.moveTo(siteBoundaryPoints[0].x, siteBoundaryPoints[0].y);
  
  for (let i = 1; i < siteBoundaryPoints.length; i++) {
    shape.lineTo(siteBoundaryPoints[i].x, siteBoundaryPoints[i].y);
  }
  
  shape.lineTo(siteBoundaryPoints[0].x, siteBoundaryPoints[0].y); // Close the shape
  
  // Extrude settings
  const extrudeSettings = {
    depth: 0.2,
    bevelEnabled: false
  };
  
  return (
    <group>
      {/* Main port boundary */}
      <mesh receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color="#212121" roughness={0.8} />
      </mesh>
      
      {/* Boundary outline */}
      <Line
        points={[...siteBoundaryPoints.map(p => new Vector3(p.x, 0, p.y)), new Vector3(siteBoundaryPoints[0].x, 0, siteBoundaryPoints[0].y)]}
        color="#555555"
        lineWidth={1}
        position={[0, 0.1, 0]}
      />
      
      {/* Label for the entire port */}
      <Text
        position={[0, 5, 50]}
        rotation={[0, 0, 0]}
        fontSize={8}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        DRY PORT INTEGRATED VISUALIZATION
      </Text>
    </group>
  );
};

// Component for displaying a zone with label
const Zone = ({ 
  zone, 
  onSelect,
  isHighlighted = false 
}: { 
  zone: ZoneProps, 
  onSelect: (zone: ZoneProps | null) => void,
  isHighlighted?: boolean 
}) => {
  const [hovered, setHovered] = useState(false);
  const height = zone.dimensions[2] || 0.1; // Default height if not specified
  
  // Don't render 3D buildings for warehouse zones since we'll have 3D warehouse models
  if (zone.id.includes('warehouse')) {
    return (
      <group
        position={zone.position}
        rotation={zone.rotation || [0, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(zone);
        }}
      >
        {/* Just render a flat zone */}
        <mesh receiveShadow position={[0, 0.01, 0]}>
          <planeGeometry args={[zone.dimensions[0], zone.dimensions[1]]} />
          <meshStandardMaterial 
            color={zone.color || '#AAAAAA'} 
            opacity={0.3}
            transparent={true}
          />
        </mesh>
      </group>
    );
  }
  
  return (
    <group
      position={zone.position}
      rotation={zone.rotation || [0, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(zone);
      }}
    >
      {/* Zone shape */}
      {zone.type === 'office' ? (
        // Taller building for offices
        <mesh castShadow position={[0, height / 2, 0]}>
          <boxGeometry args={[zone.dimensions[0], height, zone.dimensions[1]]} />
          <meshStandardMaterial 
            color={zone.color || '#1976D2'} 
            emissive={hovered ? '#333' : '#000'}
            metalness={0.4}
            roughness={0.6}
          />
          
          {/* Windows */}
          <mesh position={[0, 0, zone.dimensions[1]/2 + 0.01]}>
            <planeGeometry args={[zone.dimensions[0] * 0.8, height * 0.7]} />
            <meshStandardMaterial color="#81D4FA" opacity={0.7} transparent={true} metalness={0.8} />
          </mesh>
        </mesh>
      ) : (
        // Flat plane for other zone types
        <mesh receiveShadow position={[0, height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[zone.dimensions[0], zone.dimensions[1]]} />
          <meshStandardMaterial 
            color={zone.color || '#AAAAAA'} 
            emissive={isHighlighted ? zone.color || '#AAAAAA' : '#000000'}
            emissiveIntensity={isHighlighted ? 0.5 : (hovered ? 0.3 : 0)}
            opacity={zone.type === 'track' || zone.type === 'road' ? 0.9 : 0.7}
            transparent={true}
          />
        </mesh>
      )}
      
      {/* Zone label */}
      <Text
        position={[0, height + 0.5, 0]}
        rotation={[0, 0, 0]}
        fontSize={Math.min(zone.dimensions[0] / 10, 2)}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {zone.label}
      </Text>
      
      {/* Highlight border when hovered */}
      {hovered && (
        <Line
          points={[
            new Vector3(-zone.dimensions[0]/2, 0.05, -zone.dimensions[1]/2),
            new Vector3(zone.dimensions[0]/2, 0.05, -zone.dimensions[1]/2),
            new Vector3(zone.dimensions[0]/2, 0.05, zone.dimensions[1]/2),
            new Vector3(-zone.dimensions[0]/2, 0.05, zone.dimensions[1]/2),
            new Vector3(-zone.dimensions[0]/2, 0.05, -zone.dimensions[1]/2),
          ]}
          color="white"
          lineWidth={1}
        />
      )}
    </group>
  );
};

// Train component
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
          emissive={hovered ? '#333' : '#000'}
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
      {wagons}
      {label}
      {statusIndicator}
    </group>
  );
};

// Warehouse component
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
          emissive={hovered ? '#333' : '#000'}
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
          emissive={hovered ? '#333' : '#000'}
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
  const groupRef = useRef<Group>(null);
  
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
          emissive={hovered ? '#333' : '#000'}
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
      
      {/* Wheels */}
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
    </group>
  );
};

// Truck component with proper orientation
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
  const groupRef = useRef<Group>(null);
  
  // Simple animation for the truck if it's en route
  useFrame((state) => {
    if (item.status === 'En Route' && groupRef.current) {
      // Calculate proper movement along the road (x-axis)
      const time = state.clock.getElapsedTime();
      const xPos = Math.sin(time * 0.2) * 30; // Move along x-axis with 30 units amplitude
      
      // Update truck position
      groupRef.current.position.x = item.position[0] + xPos;
      
      // Rotate truck to face movement direction
      if (Math.cos(time * 0.2) > 0) {
        groupRef.current.rotation.y = Math.PI / 2; // Face right when moving right
      } else {
        groupRef.current.rotation.y = -Math.PI / 2; // Face left when moving left
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
          emissive={hovered ? '#333' : '#000'}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      
      {/* Truck cargo area */}
      <mesh position={[dimensions[0]/6, dimensions[1]/2, 0]} castShadow>
        <boxGeometry args={[dimensions[0]/1.5, dimensions[1], dimensions[2]]} />
        <meshStandardMaterial 
          color={'#455A64'} 
          emissive={hovered ? '#333' : '#000'}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Wheels */}
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
  const groupRef = useRef<Group>(null);
  
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
          emissive={hovered ? item.color || '#00BCD4' : '#000'}
          emissiveIntensity={hovered ? 0.5 : 0}
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
    </group>
  );
};

// Highway moving truck component
const MovingTruck = ({ isHighlighted = false }: { isHighlighted?: boolean }) => {
  const truckRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (truckRef.current) {
      // Calculate proper movement along the road (x-axis)
      const time = state.clock.getElapsedTime();
      const xPos = Math.sin(time * 0.2) * 80; // Move along x-axis with 80 units amplitude
      
      // Update truck position
      truckRef.current.position.x = xPos;
      
      // Rotate truck to face movement direction
      if (Math.cos(time * 0.2) > 0) {
        truckRef.current.rotation.y = Math.PI; // Face left when moving left
      } else {
        truckRef.current.rotation.y = 0; // Face right when moving right
      }
    }
  });
  
  return (
    <group ref={truckRef} position={[0, 0, 45]}>
      {/* Truck body */}
      <mesh castShadow position={[0, 1, 0]}>
        <boxGeometry args={[4, 2, 1.8]} />
        <meshStandardMaterial color="#607D8B" />
      </mesh>
      
      {/* Truck cabin */}
      <mesh castShadow position={[2, 1.5, 0]}>
        <boxGeometry args={[2, 1, 1.8]} />
        <meshStandardMaterial color="#455A64" />
      </mesh>
      
      {/* Truck wheels */}
      <mesh position={[-1, 0.5, -1]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-1, 0.5, 1]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[1.5, 0.5, -1]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[1.5, 0.5, 1]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 3, 0]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Highway Traffic
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
            <p>Temperature: {(sensorValue.temperature || item.sensorData.temperature)?.toFixed(1)}°C</p>
            <p>Humidity: {(sensorValue.humidity || item.sensorData.humidity)?.toFixed(1)}%</p>
            <p>Battery: {(sensorValue.batteryLevel || item.sensorData.batteryLevel)?.toFixed(1)}%</p>
            <p>Last Updated: {new Date(sensorValue.lastUpdated || item.sensorData.lastUpdated).toLocaleTimeString()}</p>
          </div>
        )}
      </div>
    </Html>
  );
};

// Zone tooltip component
const ZoneTooltip = ({ zone }: { zone: ZoneProps | null }) => {
  if (!zone) return null;
  
  return (
    <Html position={[zone.position[0], zone.position[1] + 10, zone.position[2]]}>
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
        <strong>{zone.label}</strong>
        <p>{zone.description}</p>
        <p><em>Type: {zone.type}</em></p>
      </div>
    </Html>
  );
};

// Loading fallback
const Loader = () => {
  return (
    <Html center>
      <div style={{ color: 'white', fontSize: '1.5em' }}>
        Loading integrated dry port visualization...
      </div>
    </Html>
  );
};

// Main scene component
const IntegratedDryPortScene = ({ filter, highlight }: { filter: string, highlight: string }) => {
  const [selectedZone, setSelectedZone] = useState<ZoneProps | null>(null);
  const [selectedObject, setSelectedObject] = useState<DryPortObject | null>(null);
  
  // Apply filtering based on the filter prop
  const filteredZones = zoneData.filter(zone => {
    if (filter === 'all') return true;
    if (filter === 'transportation' && (zone.type === 'track' || zone.type === 'road')) return true;
    if (filter === 'storage' && (zone.type === 'warehouse' || zone.type === 'container-yard')) return true;
    return false;
  });

  const filteredObjects = objectData.filter(object => {
    if (filter === 'all') return true;
    if (filter === 'transportation' && (object.type === 'train' || object.type === 'truck')) return true;
    if (filter === 'storage' && (object.type === 'warehouse' || object.type === 'container')) return true;
    if (filter === 'sensors' && object.type === 'sensor') return true;
    return false;
  });
  
  const handleSelectZone = (zone: ZoneProps | null) => {
    setSelectedZone(zone === selectedZone ? null : zone);
    setSelectedObject(null); // Clear any selected object when selecting a zone
  };
  
  const handleSelectObject = (object: DryPortObject | null) => {
    setSelectedObject(object === selectedObject ? null : object);
    setSelectedZone(null); // Clear any selected zone when selecting an object
  };

  // Clear selection when clicking on empty space
  const handleCanvasClick = () => {
    setSelectedZone(null);
    setSelectedObject(null);
  };

  return (
    <group onClick={handleCanvasClick}>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[50, 100, 50]} 
        intensity={0.7} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048}
      />
      <hemisphereLight 
        args={['#94a3b8', '#334155', 0.5]}
      />
      
      {/* Port boundary */}
      <PortBoundary />
      
      {/* Filtered zones */}
      {filteredZones.map(zone => (
        <Zone 
          key={zone.id} 
          zone={zone} 
          onSelect={handleSelectZone}
          isHighlighted={
            highlight === 'activity' && (zone.type === 'track' || zone.type === 'road') ||
            highlight === 'priority' && zone.id.includes('container')
          }
        />
      ))}
      
      {/* Filtered 3D objects */}
      {filteredObjects.map(object => {
        const isHighlighted = 
          highlight === 'activity' && (object.status === 'Active' || object.status === 'Arriving') ||
          highlight === 'priority' && object.status === 'Priority';
          
        switch (object.type) {
          case 'train':
            return <Train key={object.id} item={object} onSelect={handleSelectObject} isHighlighted={isHighlighted} />;
          case 'warehouse':
            return <Warehouse key={object.id} item={object} onSelect={handleSelectObject} isHighlighted={isHighlighted} />;
          case 'container':
            return <Container key={object.id} item={object} onSelect={handleSelectObject} isHighlighted={isHighlighted} />;
          case 'forklift':
            return <Forklift key={object.id} item={object} onSelect={handleSelectObject} isHighlighted={isHighlighted} />;
          case 'truck':
            return <Truck key={object.id} item={object} onSelect={handleSelectObject} isHighlighted={isHighlighted} />;
          case 'sensor':
            return <Sensor key={object.id} item={object} onSelect={handleSelectObject} isHighlighted={isHighlighted} />;
          default:
            return null;
        }
      })}
      
      {/* Moving truck on the highway */}
      <MovingTruck isHighlighted={highlight === 'activity'} />
      
      {/* Selection tooltips */}
      {selectedZone && <ZoneTooltip zone={selectedZone} />}
      {selectedObject && <ItemTooltip item={selectedObject} />}
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={20}
        maxDistance={200}
        maxPolarAngle={Math.PI / 2.5} // Limit rotation to prevent seeing under the ground
      />
    </group>
  );
};

// Main component
const IntegratedDryPortVisualization: React.FC<IntegratedDryPortVisualizationProps> = ({ 
  filter = 'all', 
  highlight = 'none' 
}) => {
  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#000' }}>
      <Canvas shadows camera={{ position: [0, 80, 80], fov: 45 }}>
        <Suspense fallback={<Loader />}>
          <IntegratedDryPortScene filter={filter} highlight={highlight} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default IntegratedDryPortVisualization;