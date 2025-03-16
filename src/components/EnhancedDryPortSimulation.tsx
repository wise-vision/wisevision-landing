"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Html, 
  Line, 
  Sparkles,
  useTexture,
  Billboard,
  Cloud, 
  Sky, 
  Stars 
} from '@react-three/drei';
import { Group, Vector3, MathUtils } from 'three';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

// Define mock IoT data interfaces
interface IoTSensorData {
  speed: number;             // km/h
  temperature: number;       // Celsius
  humidity?: number;         // Percentage
  fuelLevel?: number;        // Percentage
  batteryLevel?: number;     // Percentage
  location: string;          // Location description
  nextCheckpoint: string;    // Next destination
  loadCapacity: number;      // Percentage
  status: string;            // Operational status
  autonomyLevel: string;     // Manual/Autonomous level
  lastMaintenance: string;   // Date
  cameras?: boolean;         // Camera systems
  lidar?: boolean;           // LIDAR systems
  radar?: boolean;           // RADAR systems
}

// Business impact data
interface BusinessImpact {
  efficiencyGain: string;    // Description of efficiency gain
  costSavings: string;       // Description of cost savings
  safetyImprovement: string; // Description of safety improvement
  roi: string;               // Return on investment
}

// Vehicle data
interface VehicleData {
  id: string;
  name: string;
  type: 'train' | 'truck' | 'forklift' | 'scanner' | 'crane';
  description: string;
  position: [number, number, number];
  dimensions?: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  sensorData: IoTSensorData;
  businessImpact: BusinessImpact;
  cargoDescription?: string;
  module?: string; // Add module property to fix the TypeScript error
}

// Enhanced mock data with more vehicles and infrastructure
const vehicleData: VehicleData[] = [
  {
    id: 'train-1',
    name: 'SmartFreight Express',
    type: 'train',
    description: 'Autonomous freight train with integrated IoT monitoring systems',
    position: [0, 0.8, 0],
    color: '#2563eb',
    sensorData: {
      speed: 65.3,
      temperature: 22.4,
      fuelLevel: 72,
      location: 'Track 3, Section B',
      nextCheckpoint: 'Loading Dock A',
      loadCapacity: 87.5,
      status: 'In Transit',
      autonomyLevel: 'Level 4 - Full Automation',
      lastMaintenance: '2023-10-15',
      cameras: true,
      lidar: true,
      radar: true
    },
    businessImpact: {
      efficiencyGain: '32% increased throughput compared to manual trains',
      costSavings: 'Reduces operational costs by 45% through optimized fuel consumption and staffing',
      safetyImprovement: 'Collision detection systems reduced incidents by 78% in the past year',
      roi: '27 months payback period with 38% annual ROI thereafter'
    },
    cargoDescription: 'Currently carrying 42 containers: 18 refrigerated, 14 standard, 10 hazardous materials'
  },
  {
    id: 'train-2',
    name: 'FreightConnect 303',
    type: 'train',
    description: 'High-capacity electric freight train with containerized cargo management',
    position: [0, 0.8, -20],
    color: '#8b5cf6', // Purple
    sensorData: {
      speed: 55.8,
      temperature: 21.7,
      fuelLevel: 64,
      location: 'Track 2, North Line',
      nextCheckpoint: 'Container Terminal B',
      loadCapacity: 92.5,
      status: 'Loading',
      autonomyLevel: 'Level 3 - Semi-Automated',
      lastMaintenance: '2023-11-12',
      cameras: true,
      lidar: true,
      radar: false
    },
    businessImpact: {
      efficiencyGain: '28% increased cargo volume per journey',
      costSavings: 'Reduces energy consumption by 37% through regenerative braking',
      safetyImprovement: 'Automated coupling system eliminated 94% of coupling-related incidents',
      roi: '34 months payback period with 29% annual ROI thereafter'
    },
    cargoDescription: 'Currently loading 38 containers: 22 standard, 10 refrigerated, 6 specialized equipment'
  },
  {
    id: 'train-3',
    name: 'HybridRail 505',
    type: 'train',
    description: 'Hybrid diesel-electric train with on-board energy management system',
    position: [0, 0.8, -40],
    color: '#10b981', // Green
    sensorData: {
      speed: 42.3,
      temperature: 23.4,
      fuelLevel: 89,
      location: 'Track 4, West Junction',
      nextCheckpoint: 'Refueling Station',
      loadCapacity: 78.5,
      status: 'Departing',
      autonomyLevel: 'Level 2 - Driver Assistance',
      lastMaintenance: '2023-10-28',
      cameras: true,
      lidar: false,
      radar: true
    },
    businessImpact: {
      efficiencyGain: '42% emission reduction compared to traditional diesel trains',
      costSavings: 'Extends maintenance intervals by 60% through predictive diagnostics',
      safetyImprovement: 'Reduced operator fatigue through intelligent assist systems',
      roi: '30 months payback period with 33% annual ROI thereafter'
    },
    cargoDescription: 'Transporting 45 containers of mixed cargo for regional distribution'
  },
  {
    id: 'truck-1',
    name: 'AutonomousTruck-A37',
    type: 'truck',
    description: 'Self-driving logistics vehicle with real-time cargo monitoring',
    position: [0, 0, 15],
    color: '#dc2626',
    sensorData: {
      speed: 48.2,
      temperature: 24.1,
      batteryLevel: 83,
      location: 'Main Road, Section C',
      nextCheckpoint: 'Gate B',
      loadCapacity: 92.1,
      status: 'Delivery In Progress',
      autonomyLevel: 'Level 3 - Conditional Automation',
      lastMaintenance: '2023-11-02',
      cameras: true,
      lidar: true,
      radar: true
    },
    businessImpact: {
      efficiencyGain: '24/7 operations without driver fatigue constraints',
      costSavings: 'Reduces delivery costs by 37% compared to traditional trucking',
      safetyImprovement: 'Autonomous driving systems eliminate human error, reducing accidents by 62%',
      roi: '32 months payback period with 29% annual ROI thereafter'
    },
    cargoDescription: 'Transporting 18 pallets of electronics with humidity-controlled environment'
  },
  {
    id: 'truck-2',
    name: 'AutonomousTruck-B14',
    type: 'truck',
    description: 'Electric autonomous truck with predictive maintenance',
    position: [15, 0, 15],
    color: '#5a4fcf',
    sensorData: {
      speed: 52.7,
      temperature: 23.2,
      batteryLevel: 64,
      location: 'East Road, Section A',
      nextCheckpoint: 'Charging Station 3',
      loadCapacity: 78.3,
      status: 'Return Trip',
      autonomyLevel: 'Level 3 - Conditional Automation',
      lastMaintenance: '2023-10-28',
      cameras: true,
      lidar: true,
      radar: true
    },
    businessImpact: {
      efficiencyGain: 'Predictive maintenance reduces downtime by 42%',
      costSavings: '68% reduction in fuel costs through electric propulsion',
      safetyImprovement: 'Zero emissions improve air quality and worker health',
      roi: '38 months payback period with 26% annual ROI thereafter'
    },
    cargoDescription: 'Returning with 12 empty containers for recycling'
  },
  {
    id: 'truck-3',
    name: 'EcoHauler-C89',
    type: 'truck',
    description: 'Hydrogen fuel cell truck with extended range and zero emissions',
    position: [-15, 0, 40],
    color: '#059669',
    sensorData: {
      speed: 62.1,
      temperature: 22.8,
      batteryLevel: 77,
      location: 'Industrial Zone Access Road',
      nextCheckpoint: 'Hydrogen Refueling Station',
      loadCapacity: 84.2,
      status: 'In Transit',
      autonomyLevel: 'Level 3 - Conditional Automation',
      lastMaintenance: '2023-11-09',
      cameras: true,
      lidar: true,
      radar: true
    },
    businessImpact: {
      efficiencyGain: '800 km range without refueling stops',
      costSavings: 'Qualifies for carbon tax exemptions and green logistics incentives',
      safetyImprovement: 'Remote monitoring reduces driver stress in hazardous environments',
      roi: '40 months payback period with 25% annual ROI thereafter'
    },
    cargoDescription: 'Carrying construction materials and prefabricated components for the port expansion project'
  },
  {
    id: 'truck-4',
    name: 'LastMile-D27',
    type: 'truck',
    description: 'Small electric delivery truck for final distribution operations',
    position: [30, 0, 40],
    color: '#f59e0b',
    sensorData: {
      speed: 38.4,
      temperature: 21.5,
      batteryLevel: 45,
      location: 'Local Distribution Road',
      nextCheckpoint: 'Sorting Facility D4',
      loadCapacity: 56.7,
      status: 'Delivery In Progress',
      autonomyLevel: 'Level 2 - Partial Automation',
      lastMaintenance: '2023-11-07',
      cameras: true,
      lidar: false,
      radar: false
    },
    businessImpact: {
      efficiencyGain: 'Optimized for multi-stop urban delivery with 31% better time efficiency',
      costSavings: 'Reduces operational costs by 44% compared to diesel counterparts',
      safetyImprovement: 'Enhanced visibility systems reduce urban accidents by 57%',
      roi: '22 months payback period with 40% annual ROI thereafter'
    },
    cargoDescription: 'Distributing 24 parcels for local businesses from the port logistics hub'
  },
  {
    id: 'forklift-1',
    name: 'RoboLift-F22',
    type: 'forklift',
    description: 'AI-powered forklift with precision lifting and obstacle avoidance',
    position: [-15, 0, 5],
    color: '#eab308',
    sensorData: {
      speed: 12.4,
      temperature: 26.3,
      batteryLevel: 91,
      location: 'Warehouse Zone 2',
      nextCheckpoint: 'Container Stack B',
      loadCapacity: 84.7,
      status: 'Loading Operation',
      autonomyLevel: 'Level 4 - Full Automation',
      lastMaintenance: '2023-11-10',
      cameras: true,
      lidar: true,
      radar: false
    },
    businessImpact: {
      efficiencyGain: 'Precision stacking increases storage density by 28%',
      costSavings: 'Reduces labor costs by 52% while operating 24/7',
      safetyImprovement: 'Zero workplace injuries since deployment (vs. 8 annually previously)',
      roi: '18 months payback period with 45% annual ROI thereafter'
    },
    cargoDescription: 'Currently lifting refrigerated container with temperature-sensitive pharmaceuticals'
  },
  {
    id: 'forklift-2',
    name: 'StackMaster-G35',
    type: 'forklift',
    description: 'Heavy-duty autonomous forklift with extended lift capability',
    position: [15, 0, -30],
    color: '#d97706',
    sensorData: {
      speed: 8.2,
      temperature: 25.8,
      batteryLevel: 83,
      location: 'Heavy Lift Zone 1',
      nextCheckpoint: 'Oversized Container Area',
      loadCapacity: 92.3,
      status: 'Heavy Lift Operation',
      autonomyLevel: 'Level 4 - Full Automation',
      lastMaintenance: '2023-11-15',
      cameras: true,
      lidar: true,
      radar: true
    },
    businessImpact: {
      efficiencyGain: 'Handles loads up to 15 tons with precision placement',
      costSavings: 'Reduces specialized equipment needs by 35% through versatility',
      safetyImprovement: '100% reduction in operator injuries for heavy lift operations',
      roi: '24 months payback period with 42% annual ROI thereafter'
    },
    cargoDescription: 'Currently handling oversized machinery components for export'
  },
  {
    id: 'forklift-3',
    name: 'NarrowAisle-H11',
    type: 'forklift',
    description: 'Compact warehouse forklift for high-density storage operations',
    position: [25, 0, -15],
    color: '#f97316',
    sensorData: {
      speed: 6.8,
      temperature: 24.6,
      batteryLevel: 62,
      location: 'High-Density Storage Zone',
      nextCheckpoint: 'Charging Station 4',
      loadCapacity: 71.6,
      status: 'Active',
      autonomyLevel: 'Level 3 - Conditional Automation',
      lastMaintenance: '2023-11-01',
      cameras: true,
      lidar: true,
      radar: false
    },
    businessImpact: {
      efficiencyGain: 'Operates in aisles 40% narrower than standard forklifts',
      costSavings: 'Increases warehouse storage capacity by 27% through space optimization',
      safetyImprovement: 'Proximity detection prevents 99.8% of potential collisions',
      roi: '20 months payback period with 48% annual ROI thereafter'
    },
    cargoDescription: 'Moving high-value electronics in temperature-controlled containers'
  },
  {
    id: 'scanner-1',
    name: 'SecurityScan-X1',
    type: 'scanner',
    description: 'AI-powered container scanning system with anomaly detection',
    position: [-30, 0, -15],
    color: '#06b6d4',
    sensorData: {
      speed: 0,
      temperature: 22.1,
      batteryLevel: 100,
      location: 'Gate A Entry Point',
      nextCheckpoint: 'N/A (Stationary)',
      loadCapacity: 100,
      status: 'Active Scanning',
      autonomyLevel: 'Level 5 - Full AI Operation',
      lastMaintenance: '2023-10-30',
      cameras: true,
      lidar: false,
      radar: true
    },
    businessImpact: {
      efficiencyGain: 'Processes 120 containers per hour (vs. 40 with manual inspection)',
      costSavings: 'Reduces staffing needs by 75% for entry processing',
      safetyImprovement: 'Detects 99.7% of contraband and dangerous goods',
      roi: '14 months payback period with 61% annual ROI thereafter'
    },
    cargoDescription: 'Currently scanning incoming shipments for customs clearance'
  },
  {
    id: 'scanner-2',
    name: 'SafetyScan-Y3',
    type: 'scanner',
    description: 'Advanced radiation and chemical detection system for hazardous materials',
    position: [30, 0, -30],
    color: '#ef4444',
    sensorData: {
      speed: 0,
      temperature: 22.7,
      batteryLevel: 100,
      location: 'Hazardous Materials Checkpoint',
      nextCheckpoint: 'N/A (Stationary)',
      loadCapacity: 100,
      status: 'Monitoring',
      autonomyLevel: 'Level 5 - Full AI Operation',
      lastMaintenance: '2023-11-14',
      cameras: true,
      lidar: false,
      radar: false
    },
    businessImpact: {
      efficiencyGain: 'Enables safe handling of hazardous materials with 99.96% detection accuracy',
      costSavings: 'Reduces insurance premiums by 38% through enhanced safety protocols',
      safetyImprovement: 'Prevents environmental contamination incidents worth $2.7M annually',
      roi: '18 months payback period with 56% annual ROI thereafter'
    },
    cargoDescription: 'Currently monitoring and scanning Class 7-9 hazardous materials shipments'
  },
  {
    id: 'crane-1',
    name: 'SmartCrane-C5',
    type: 'crane',
    description: 'Automated gantry crane with wind compensation and precision placement',
    position: [20, 5, -5],
    color: '#0ea5e9',
    sensorData: {
      speed: 8.3,
      temperature: 24.5,
      batteryLevel: 76,
      location: 'Container Yard Section D',
      nextCheckpoint: 'Storage Block F12',
      loadCapacity: 95.2,
      status: 'Container Transfer',
      autonomyLevel: 'Level 4 - Full Automation with Human Override',
      lastMaintenance: '2023-11-05',
      cameras: true,
      lidar: true,
      radar: true
    },
    businessImpact: {
      efficiencyGain: 'Operates in all weather conditions, increasing port uptime by 32%',
      costSavings: '41% reduction in energy usage through optimized movements',
      safetyImprovement: 'Precision placement eliminates container damage (saving $430K annually)',
      roi: '36 months payback period with 31% annual ROI thereafter'
    },
    cargoDescription: 'Currently handling 40ft high-cube container with electronics'
  },
  {
    id: 'crane-2',
    name: 'MegaLift-D8',
    type: 'crane',
    description: 'Heavy-duty gantry crane with advanced stabilization for extreme weather operation',
    position: [-30, 5, -30],
    color: '#3b82f6',
    sensorData: {
      speed: 6.2,
      temperature: 23.4,
      batteryLevel: 88,
      location: 'Heavy Lift Terminal Section A',
      nextCheckpoint: 'Oversized Cargo Bay',
      loadCapacity: 98.7,
      status: 'Heavy Lift Operation',
      autonomyLevel: 'Level 4 - Full Automation with Human Override',
      lastMaintenance: '2023-11-03',
      cameras: true,
      lidar: true,
      radar: true
    },
    businessImpact: {
      efficiencyGain: 'Handles loads up to 150 tons with wind compensation up to 65km/h',
      costSavings: 'Reduces specialized equipment rental costs by 87%',
      safetyImprovement: 'AI-driven stabilization eliminated all weather-related incidents',
      roi: '48 months payback period with 29% annual ROI thereafter'
    },
    cargoDescription: 'Currently handling power generation turbines for the energy sector'
  }
];

// Tooltip component for displaying IoT data (only the hover tooltip remains here)
const InteractiveTooltip = ({ 
  vehicle, 
  position, 
  visible, 
  detailed 
}: { 
  vehicle: VehicleData; 
  position: [number, number, number]; 
  visible: boolean; 
  detailed: boolean;
}) => {
  if (!visible || detailed) return null;
  
  const tooltipPosition: [number, number, number] = [position[0], position[1] + 2, position[2]];

  // Only render hover tooltip in 3D space (not the detailed view)
  return (
    <Html position={tooltipPosition} center>
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        width: '200px',
        textAlign: 'center',
        pointerEvents: 'none',
        transform: 'translate3d(-50%, -100%, 0)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{vehicle.name}</div>
        <div style={{ fontSize: '0.8em', opacity: 0.8 }}>{vehicle.description}</div>
        <div style={{ marginTop: '5px', fontSize: '0.8em' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Status:</span>
            <span style={{ color: vehicle.sensorData.status === 'Active Scanning' ? '#4ade80' : '#3b82f6' }}>
              {vehicle.sensorData.status}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Speed:</span>
            <span>{vehicle.sensorData.speed} km/h</span>
          </div>
          <div style={{ fontSize: '0.7em', marginTop: '5px', fontStyle: 'italic' }}>
            Click for details
          </div>
        </div>
      </div>
    </Html>
  );
};

// Moving truck component with IoT data
const SmartTruck = ({ 
  data,
  position = [0, 0, 0], 
  direction = 1, 
  speed = 0.1,
  onSelect,
  selected
}: { 
  data: VehicleData;
  position?: [number, number, number];
  direction?: number;
  speed?: number;
  onSelect: (vehicle: VehicleData | null) => void;
  selected: boolean;
}) => {
  const truckRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  // Mock dynamic sensor data
  const [sensorData, setSensorData] = useState(data.sensorData);
  
  // Update truck position and sensor data
  useFrame((state) => {
    if (truckRef.current) {
      // Move the truck along x-axis
      truckRef.current.position.x += speed * direction;
      
      // Loop position when out of bounds
      if (direction > 0 && truckRef.current.position.x > 30) {
        truckRef.current.position.x = -30;
      } else if (direction < 0 && truckRef.current.position.x < -30) {
        truckRef.current.position.x = 30;
      }
      
      // Update sensor data periodically
      if (state.clock.elapsedTime % 2 < 0.1) {
        setSensorData(prev => ({
          ...prev,
          speed: prev.speed + MathUtils.randFloatSpread(0.2),
          temperature: prev.temperature + MathUtils.randFloatSpread(0.1),
          batteryLevel: Math.max(prev.batteryLevel! - 0.01, 0),
        }));
      }
    }
  });

  // Add signal indicator when hovering
  const signalEffect = (hovered || selected) && (
    <group position={[0, 2, 0]}>
      <Sparkles count={20} scale={[1, 1, 1]} size={6} speed={0.3} color={data.color} />
      
      {/* Signal waves */}
      <Billboard>
        <mesh>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.8 * (1 + Math.sin(Date.now() * 0.005))} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.7, 0.75, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.6 * (1 + Math.sin(Date.now() * 0.005 - 0.5))} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.9, 0.95, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.4 * (1 + Math.sin(Date.now() * 0.005 - 1))} />
        </mesh>
      </Billboard>
    </group>
  );
  
  return (
    <group position={position}>
      <group 
        ref={truckRef} 
        position={[0, 0.8, 0]}
        rotation={[0, direction > 0 ? 0 : Math.PI, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(selected ? null : data);
        }}
      >
        {/* Truck body */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[3, 1.6, 1.8]} />
          <meshStandardMaterial 
            color={data.color} 
            emissive={data.color}
            emissiveIntensity={hovered || selected ? 0.3 : 0}
          />
        </mesh>
        
        {/* Truck cabin */}
        <mesh position={[-1.2, 0.4, 0]} castShadow>
          <boxGeometry args={[1, 1, 1.8]} />
          <meshStandardMaterial 
            color={data.color} 
            metalness={0.2} 
            emissive={data.color}
            emissiveIntensity={hovered || selected ? 0.2 : 0}
          />
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
        
        {/* IoT visual effects */}
        {signalEffect}
      </group>
      
      {/* Tooltip */}
      <InteractiveTooltip 
        vehicle={{...data, sensorData}} 
        position={[position[0] + (truckRef.current?.position.x || 0), position[1], position[2]]}
        visible={hovered || selected}
        detailed={selected}
      />
    </group>
  );
};

// Moving train component with IoT data
const SmartTrain = ({
  data,
  onSelect,
  selected
}: {
  data: VehicleData;
  onSelect: (vehicle: VehicleData | null) => void;
  selected: boolean;
}) => {
  const trainRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  // Mock dynamic sensor data
  const [sensorData, setSensorData] = useState(data.sensorData);
  
  // Animate train and update sensor data
  useFrame(({ clock }) => {
    if (trainRef.current) {
      // Move the train along x-axis following the central rail corridor
      const xPosition = Math.sin(clock.getElapsedTime() * 0.2) * 50;
      trainRef.current.position.x = xPosition;
      trainRef.current.rotation.y = Math.cos(clock.getElapsedTime() * 0.2) > 0 ? 0 : Math.PI;
      
      // Update sensor data periodically
      if (clock.elapsedTime % 3 < 0.1) {
        setSensorData(prev => ({
          ...prev,
          speed: 65.3 + MathUtils.randFloatSpread(2),
          temperature: prev.temperature + MathUtils.randFloatSpread(0.2),
          fuelLevel: Math.max(prev.fuelLevel! - 0.01, 0),
        }));
      }
    }
  });
  
  // Add signal indicator when hovering
  const signalEffect = (hovered || selected) && (
    <group position={[0, 2.5, 0]}>
      <Sparkles count={30} scale={[3, 1, 1.5]} size={6} speed={0.4} color={data.color} />
      
      {/* Signal waves */}
      <Billboard>
        <mesh>
          <ringGeometry args={[0.6, 0.65, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.8 * (1 + Math.sin(Date.now() * 0.005))} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.8, 0.85, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.6 * (1 + Math.sin(Date.now() * 0.005 - 0.5))} />
        </mesh>
        <mesh>
          <ringGeometry args={[1, 1.05, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.4 * (1 + Math.sin(Date.now() * 0.005 - 1))} />
        </mesh>
      </Billboard>
    </group>
  );

  return (
    <group position={data.position}>
      <group 
        ref={trainRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(selected ? null : data);
        }}
      >
        {/* Locomotive */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[4, 2, 1.8]} />
          <meshStandardMaterial 
            color={data.color} 
            emissive={data.color}
            emissiveIntensity={hovered || selected ? 0.3 : 0}
            metalness={0.4}
          />
        </mesh>
        
        {/* Locomotive Cabin */}
        <mesh position={[1.5, 1.8, 0]} castShadow>
          <boxGeometry args={[1, 1.5, 1.8]} />
          <meshStandardMaterial 
            color={data.color} 
            metalness={0.2} 
            emissive={data.color}
            emissiveIntensity={hovered || selected ? 0.2 : 0}
          />
        </mesh>
        
        {/* Windows */}
        <mesh position={[1.8, 1.8, 0]} castShadow>
          <boxGeometry args={[0.1, 1, 1.6]} />
          <meshStandardMaterial color="#90cdf4" opacity={0.7} transparent={true} metalness={0.8} />
        </mesh>
        
        {/* Cargo wagons */}
        <mesh position={[-3, 1, 0]} castShadow>
          <boxGeometry args={[2.5, 2, 1.8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        
        <mesh position={[-6, 1, 0]} castShadow>
          <boxGeometry args={[2.5, 2, 1.8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        
        <mesh position={[-9, 1, 0]} castShadow>
          <boxGeometry args={[2.5, 2, 1.8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        
        {/* Wheels */}
        <mesh position={[1, 0.4, -0.9]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[1, 0.4, 0.9]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[-1, 0.4, -0.9]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[-1, 0.4, 0.9]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        
        {/* IoT visual effects */}
        {signalEffect}
      </group>
      
      {/* Track */}
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
      
      {/* Tooltip - positioned based on trainRef position */}
      <InteractiveTooltip 
        vehicle={{...data, sensorData}} 
        position={[trainRef.current?.position.x || 0, data.position[1], data.position[2]]}
        visible={hovered || selected}
        detailed={selected}
      />
    </group>
  );
};

// Forklift component with IoT data
const SmartForklift = ({
  data,
  onSelect,
  selected
}: {
  data: VehicleData;
  onSelect: (vehicle: VehicleData | null) => void;
  selected: boolean;
}) => {
  const forkliftRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  // Mock dynamic sensor data
  const [sensorData, setSensorData] = useState(data.sensorData);
  const [liftHeight, setLiftHeight] = useState(0);
  
  // Animate forklift and update sensor data
  useFrame(({ clock }) => {
    if (forkliftRef.current) {
      // Small movements to simulate working
      forkliftRef.current.position.x = data.position[0] + Math.sin(clock.getElapsedTime() * 0.5) * 0.5;
      forkliftRef.current.position.z = data.position[2] + Math.cos(clock.getElapsedTime() * 0.3) * 0.5;
      
      // Occasional rotation changes
      if (Math.sin(clock.getElapsedTime() * 0.1) > 0.95) {
        forkliftRef.current.rotation.y = forkliftRef.current.rotation.y + 0.02;
      }
      
      // Animate lifting forks
      setLiftHeight(Math.sin(clock.getElapsedTime() * 0.2) * 0.5 + 0.5);
      
      // Update sensor data periodically
      if (clock.elapsedTime % 2 < 0.1) {
        setSensorData(prev => ({
          ...prev,
          speed: Math.abs(prev.speed + MathUtils.randFloatSpread(0.5)),
          temperature: prev.temperature + MathUtils.randFloatSpread(0.1),
          batteryLevel: Math.max(prev.batteryLevel! - 0.02, 0),
          loadCapacity: 50 + Math.sin(clock.getElapsedTime() * 0.1) * 20
        }));
      }
    }
  });
  
  // Add signal indicator when hovering
  const signalEffect = (hovered || selected) && (
    <group position={[0, 2, 0]}>
      <Sparkles count={15} scale={[1, 1, 1]} size={4} speed={0.3} color={data.color} />
      
      {/* Signal waves */}
      <Billboard>
        <mesh>
          <ringGeometry args={[0.4, 0.45, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.8 * (1 + Math.sin(Date.now() * 0.005))} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.6, 0.65, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.6 * (1 + Math.sin(Date.now() * 0.005 - 0.5))} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.8, 0.85, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.4 * (1 + Math.sin(Date.now() * 0.005 - 1))} />
        </mesh>
      </Billboard>
    </group>
  );

  return (
    <group ref={forkliftRef} position={data.position}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(selected ? null : data);
        }}
      >
        {/* Forklift body */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[1.2, 1.2, 0.8]} />
          <meshStandardMaterial 
            color={data.color} 
            emissive={data.color}
            emissiveIntensity={hovered || selected ? 0.3 : 0}
          />
        </mesh>
        
        {/* Driver cabin/roof */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[1, 0.3, 0.8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        
        {/* Lift mast */}
        <mesh position={[0.7, 0.8, 0]} castShadow>
          <boxGeometry args={[0.1, 1.6, 0.6]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        
        {/* Forks - animated up and down */}
        <mesh position={[0.7, liftHeight, 0]} castShadow>
          <boxGeometry args={[0.8, 0.1, 0.6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} />
        </mesh>
        
        {/* Wheels */}
        <mesh position={[-0.4, 0.2, -0.4]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[-0.4, 0.2, 0.4]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0.4, 0.2, -0.4]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0.4, 0.2, 0.4]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        
        {/* Status light */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color={data.sensorData.status === 'Loading Operation' ? '#4CAF50' : '#F44336'} 
            emissive={data.sensorData.status === 'Loading Operation' ? '#4CAF50' : '#F44336'}
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* IoT visual effects */}
        {signalEffect}
      </group>
      
      {/* Tooltip */}
      <InteractiveTooltip 
        vehicle={{...data, sensorData}} 
        position={[0, 1.6, 0]}
        visible={hovered || selected}
        detailed={selected}
      />
    </group>
  );
};

// Static scanning system with IoT data
const ScannerSystem = ({
  data,
  onSelect,
  selected
}: {
  data: VehicleData;
  onSelect: (vehicle: VehicleData | null) => void;
  selected: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  // Mock dynamic sensor data
  const [sensorData, setSensorData] = useState(data.sensorData);
  const [scanAngle, setScanAngle] = useState(0);
  
  // Animate scanner and update sensor data
  useFrame(({ clock }) => {
    // Animate scanning beam
    setScanAngle(Math.sin(clock.getElapsedTime() * 2) * Math.PI / 4);
    
    // Update sensor data periodically
    if (clock.elapsedTime % 3 < 0.1) {
      setSensorData(prev => ({
        ...prev,
        temperature: prev.temperature + MathUtils.randFloatSpread(0.2),
        batteryLevel: 100, // Always plugged in
      }));
    }
  });
  
  // Add signal indicator when hovering
  const signalEffect = (hovered || selected) && (
    <group position={[0, 2.5, 0]}>
      <Sparkles count={30} scale={[2, 2, 2]} size={4} speed={0.2} color={data.color} />
      
      {/* Signal waves */}
      <Billboard>
        <mesh>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.8 * (1 + Math.sin(Date.now() * 0.005))} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.7, 0.75, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.6 * (1 + Math.sin(Date.now() * 0.005 - 0.5))} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.9, 0.95, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.4 * (1 + Math.sin(Date.now() * 0.005 - 1))} />
        </mesh>
      </Billboard>
    </group>
  );

  return (
    <group position={data.position}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(selected ? null : data);
        }}
      >
        {/* Scanner base */}
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial 
            color={data.color} 
            emissive={data.color}
            emissiveIntensity={hovered || selected ? 0.3 : 0}
            metalness={0.6}
          />
        </mesh>
        
        {/* Scanner arm */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <boxGeometry args={[0.5, 1, 0.5]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} />
        </mesh>
        
        {/* Scanning element - rotates */}
        <group position={[0, 3, 0]} rotation={[0, scanAngle, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.3, 1.5]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          
          {/* Scanning beam */}
          <mesh position={[0, 0, 1]} castShadow>
            <coneGeometry args={[0.2, 1, 16]} />
            <meshBasicMaterial 
              color={data.color} 
              transparent={true} 
              opacity={0.6}
            />
          </mesh>
        </group>
        
        {/* Status indicators */}
        <mesh position={[0.8, 1.8, -1.1]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color="#4CAF50" 
            emissive="#4CAF50"
            emissiveIntensity={0.5 * (1 + Math.sin(Date.now() * 0.002))}
          />
        </mesh>
        
        <mesh position={[0.8, 1.5, -1.1]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color="#FFC107" 
            emissive="#FFC107"
            emissiveIntensity={0.5 * (1 + Math.sin(Date.now() * 0.003))}
          />
        </mesh>
        
        {/* IoT visual effects */}
        {signalEffect}
      </group>
      
      {/* Tooltip */}
      <InteractiveTooltip 
        vehicle={{...data, sensorData}} 
        position={[0, 4, 0]}
        visible={hovered || selected}
        detailed={selected}
      />
    </group>
  );
};

// Crane component with IoT data
const SmartCrane = ({
  data,
  onSelect,
  selected
}: {
  data: VehicleData;
  onSelect: (vehicle: VehicleData | null) => void;
  selected: boolean;
}) => {
  const craneRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  // Mock dynamic sensor data
  const [sensorData, setSensorData] = useState(data.sensorData);
  const [craneHeight, setCraneHeight] = useState(0);
  const [cranePosition, setCranePosition] = useState(0);
  
  // Animate crane and update sensor data
  useFrame(({ clock }) => {
    // Animate crane
    setCraneHeight(2 + Math.sin(clock.getElapsedTime() * 0.1) * 1);
    setCranePosition(Math.sin(clock.getElapsedTime() * 0.05) * 3);
    
    // Update sensor data periodically
    if (clock.elapsedTime % 2 < 0.1) {
      setSensorData(prev => ({
        ...prev,
        speed: Math.abs(5 + Math.sin(clock.getElapsedTime() * 0.2) * 3),
        temperature: prev.temperature + MathUtils.randFloatSpread(0.1),
        loadCapacity: 70 + Math.sin(clock.getElapsedTime() * 0.1) * 20
      }));
    }
  });
  
  // Add signal indicator when hovering
  const signalEffect = (hovered || selected) && (
    <group position={[0, 12, 0]}>
      <Sparkles count={30} scale={[4, 3, 2]} size={6} speed={0.2} color={data.color} />
      
      {/* Signal waves */}
      <Billboard>
        <mesh>
          <ringGeometry args={[0.8, 0.9, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.8 * (1 + Math.sin(Date.now() * 0.005))} />
        </mesh>
        <mesh>
          <ringGeometry args={[1.1, 1.2, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.6 * (1 + Math.sin(Date.now() * 0.005 - 0.5))} />
        </mesh>
        <mesh>
          <ringGeometry args={[1.4, 1.5, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.4 * (1 + Math.sin(Date.now() * 0.005 - 1))} />
        </mesh>
      </Billboard>
    </group>
  );

  return (
    <group position={data.position} ref={craneRef}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(selected ? null : data);
        }}
      >
        {/* Crane base/tower */}
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[2, 10, 2]} />
          <meshStandardMaterial color="#334155" metalness={0.3} />
        </mesh>
        
        {/* Crane horizontal arm */}
        <mesh position={[0, 10, 0]} castShadow>
          <boxGeometry args={[10, 0.5, 0.5]} />
          <meshStandardMaterial 
            color={data.color} 
            emissive={data.color}
            emissiveIntensity={hovered || selected ? 0.3 : 0}
            metalness={0.4}
          />
        </mesh>
        
        {/* Crane cabin */}
        <mesh position={[0, 8, 1]} castShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        
        {/* Windows */}
        <mesh position={[0, 8, 1.8]} castShadow>
          <boxGeometry args={[1.3, 1.3, 0.1]} />
          <meshStandardMaterial color="#38bdf8" opacity={0.7} transparent={true} metalness={0.8} />
        </mesh>
        
        {/* Crane hook system - animated */}
        <group position={[cranePosition, 0, 0]}>
          <mesh position={[0, 10 - craneHeight/2, 0]} castShadow>
            <boxGeometry args={[0.2, craneHeight, 0.2]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          
          {/* Hook */}
          <mesh position={[0, 10 - craneHeight, 0]} castShadow>
            <boxGeometry args={[0.8, 0.3, 0.8]} />
            <meshStandardMaterial color="#64748b" metalness={0.5} />
          </mesh>
          
          {/* Container being moved */}
          <mesh position={[0, 10 - craneHeight - 0.9, 0]} castShadow>
            <boxGeometry args={[2, 1.5, 1]} />
            <meshStandardMaterial color="#1e40af" metalness={0.2} />
          </mesh>
        </group>
        
        {/* IoT visual effects */}
        {signalEffect}
      </group>
      
      {/* Tooltip positioned above crane */}
      <InteractiveTooltip 
        vehicle={{...data, sensorData}} 
        position={[0, 12, 0]}
        visible={hovered || selected}
        detailed={selected}
      />
    </group>
  );
};

// Enhanced Ground component with layout based on Chełm concept
const Ground = () => {
  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[250, 250]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      
      {/* Main terminal area - Central rectangle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]} receiveShadow>
        <planeGeometry args={[200, 100]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
      
      {/* Railway corridors - Multiple parallel tracks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.47, -10]} receiveShadow>
        <planeGeometry args={[180, 25]} />
        <meshStandardMaterial color="#374151" roughness={0.6} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.47, 25]} receiveShadow>
        <planeGeometry args={[180, 25]} />
        <meshStandardMaterial color="#374151" roughness={0.6} />
      </mesh>
      
      {/* Terminal roads - Perimeter circulation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.46, -45]} receiveShadow>
        <planeGeometry args={[200, 10]} />
        <meshStandardMaterial color="#4b5563" roughness={0.5} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.46, 45]} receiveShadow>
        <planeGeometry args={[200, 10]} />
        <meshStandardMaterial color="#4b5563" roughness={0.5} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-95, -0.46, 0]} receiveShadow>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial color="#4b5563" roughness={0.5} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[95, -0.46, 0]} receiveShadow>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial color="#4b5563" roughness={0.5} />
      </mesh>
      
      {/* Container storage areas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-50, -0.45, -30]} receiveShadow>
        <planeGeometry args={[50, 20]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[50, -0.45, -30]} receiveShadow>
        <planeGeometry args={[50, 20]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-50, -0.45, 30]} receiveShadow>
        <planeGeometry args={[50, 20]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[50, -0.45, 30]} receiveShadow>
        <planeGeometry args={[50, 20]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
    </group>
  );
};

// Additional infrastructure components based on Chełm dry port concept
const AdditionalInfrastructure = () => {
  return (
    <group>
      {/* Main Terminal Building */}
      <group position={[-65, 0, -30]}>
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[30, 10, 15]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 11, 0]} castShadow>
          <boxGeometry args={[32, 2, 17]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <Text position={[0, 14, 0]} fontSize={2} color="white" anchorX="center" anchorY="middle">
          Main Terminal
        </Text>
      </group>
      
      {/* Intermodal Handling Facility */}
      <group position={[65, 0, -30]}>
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[35, 8, 18]} />
          <meshStandardMaterial color="#0f766e" />
        </mesh>
        <mesh position={[0, 9, 0]} castShadow>
          <boxGeometry args={[37, 2, 20]} />
          <meshStandardMaterial color="#0e7490" />
        </mesh>
        <Text position={[0, 12, 0]} fontSize={1.8} color="white" anchorX="center" anchorY="middle">
          Intermodal Facility
        </Text>
      </group>
      
      {/* Customs Clearance Building */}
      <group position={[0, 0, -35]}>
        <mesh position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[25, 7, 12]} />
          <meshStandardMaterial color="#7e22ce" />
        </mesh>
        <mesh position={[0, 7.5, 0]} castShadow>
          <boxGeometry args={[27, 1, 14]} />
          <meshStandardMaterial color="#6b21a8" />
        </mesh>
        <Text position={[0, 10, 0]} fontSize={1.5} color="white" anchorX="center" anchorY="middle">
          Customs Clearance
        </Text>
      </group>
      
      {/* Administration Office */}
      <group position={[30, 0, 30]}>
        <mesh position={[0, 7, 0]} castShadow>
          <boxGeometry args={[15, 14, 12]} />
          <meshStandardMaterial color="#1e40af" metalness={0.3} />
        </mesh>
        <mesh position={[0, 15, 0]} castShadow>
          <boxGeometry args={[17, 2, 14]} />
          <meshStandardMaterial color="#60a5fa" opacity={0.7} transparent={true} metalness={0.8} />
        </mesh>
        <Text position={[0, 18, 0]} fontSize={1.5} color="white" anchorX="center" anchorY="middle">
          Administration
        </Text>
      </group>
      
      {/* Maintenance Facility */}
      <group position={[-30, 0, 30]}>
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[20, 8, 15]} />
          <meshStandardMaterial color="#b91c1c" />
        </mesh>
        <mesh position={[0, 9, 0]} castShadow>
          <boxGeometry args={[22, 2, 17]} />
          <meshStandardMaterial color="#991b1b" />
        </mesh>
        <Text position={[0, 12, 0]} fontSize={1.5} color="white" anchorX="center" anchorY="middle">
          Maintenance Facility
        </Text>
      </group>
      
      {/* Container yards with stacked containers */}
      {/* Eastern Container Storage */}
      <ContainerStack position={[-50, 0, -30]} count={3} height={3} color="#e11d48" />
      <ContainerStack position={[-60, 0, -30]} count={2} height={3} color="#9333ea" />
      <ContainerStack position={[-40, 0, -30]} count={4} height={2} color="#2563eb" />
      
      {/* Western Container Storage */}
      <ContainerStack position={[50, 0, -30]} count={3} height={3} color="#f97316" />
      <ContainerStack position={[60, 0, -30]} count={2} height={3} color="#0ea5e9" />
      <ContainerStack position={[40, 0, -30]} count={4} height={2} color="#84cc16" />
      
      {/* Northern Container Storage */}
      <ContainerStack position={[-50, 0, 30]} count={3} height={2} color="#8b5cf6" />
      <ContainerStack position={[-40, 0, 30]} count={2} height={3} color="#ec4899" />
      
      {/* Southern Container Storage */}
      <ContainerStack position={[50, 0, 30]} count={3} height={2} color="#14b8a6" />
      <ContainerStack position={[60, 0, 30]} count={2} height={3} color="#f59e0b" />
      
      {/* Main rail tracks based on Chełm dry port design */}
      <group position={[0, -0.3, -10]}>
        {/* Multiple parallel rail lines */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[180, 0.1, 22]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
        
        {/* Rail track 1 */}
        <RailTrack position={[0, 0.06, -8]} length={180} />
        
        {/* Rail track 2 */}
        <RailTrack position={[0, 0.06, -4]} length={180} />
        
        {/* Rail track 3 */}
        <RailTrack position={[0, 0.06, 0]} length={180} />
        
        {/* Rail track 4 */}
        <RailTrack position={[0, 0.06, 4]} length={180} />
        
        {/* Rail track 5 */}
        <RailTrack position={[0, 0.06, 8]} length={180} />
      </group>
      
      {/* Second rail yard */}
      <group position={[0, -0.3, 25]}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[180, 0.1, 22]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
        
        {/* Rail tracks */}
        <RailTrack position={[0, 0.06, -8]} length={180} />
        <RailTrack position={[0, 0.06, -4]} length={180} />
        <RailTrack position={[0, 0.06, 0]} length={180} />
        <RailTrack position={[0, 0.06, 4]} length={180} />
        <RailTrack position={[0, 0.06, 8]} length={180} />
      </group>
      
      {/* Loading/unloading areas */}
      <group position={[-40, -0.4, -30]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 15]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>
      
      <group position={[40, -0.4, -30]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 15]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>
      
      <group position={[-40, -0.4, 30]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 15]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>
      
      <group position={[40, -0.4, 30]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 15]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>
      
      {/* Gantry cranes over rail lines */}
      <GantryCrane position={[-60, 0, -10]} width={30} height={18} color="#3b82f6" />
      <GantryCrane position={[0, 0, -10]} width={30} height={18} color="#3b82f6" />
      <GantryCrane position={[60, 0, -10]} width={30} height={18} color="#3b82f6" />
      <GantryCrane position={[-60, 0, 25]} width={30} height={18} color="#3b82f6" />
      <GantryCrane position={[0, 0, 25]} width={30} height={18} color="#3b82f6" />
      <GantryCrane position={[60, 0, 25]} width={30} height={18} color="#3b82f6" />
      
      {/* Truck scales at entry points */}
      <group position={[-95, 0, -35]} rotation={[0, Math.PI/2, 0]}>
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[8, 0.2, 3]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[6, 0.4, 2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <Text position={[0, 1, 0]} fontSize={0.6} color="white" anchorX="center" anchorY="middle">
          Truck Scale
        </Text>
      </group>
      
      <group position={[95, 0, -35]} rotation={[0, Math.PI/2, 0]}>
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[8, 0.2, 3]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[6, 0.4, 2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <Text position={[0, 1, 0]} fontSize={0.6} color="white" anchorX="center" anchorY="middle">
          Truck Scale
        </Text>
      </group>
      
      {/* Security perimeter fencing */}
      <group>
        {/* North fence */}
        <mesh position={[0, 1, -55]} castShadow>
          <boxGeometry args={[210, 2, 0.2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        
        {/* South fence */}
        <mesh position={[0, 1, 55]} castShadow>
          <boxGeometry args={[210, 2, 0.2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        
        {/* East fence */}
        <mesh position={[105, 1, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
          <boxGeometry args={[110, 2, 0.2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        
        {/* West fence */}
        <mesh position={[-105, 1, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
          <boxGeometry args={[110, 2, 0.2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      </group>
      
      {/* Entry/Exit gates */}
      <group position={[-95, 0, -45]}>
        <mesh position={[0, 3, 0]} castShadow>
          <boxGeometry args={[1, 6, 1]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[5, 3, 0]} castShadow>
          <boxGeometry args={[1, 6, 1]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[2.5, 6.5, 0]} castShadow>
          <boxGeometry args={[8, 1, 1]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <Text position={[2.5, 7.5, 0]} fontSize={1} color="white" anchorX="center" anchorY="middle">
          ENTRY
        </Text>
      </group>
      
      <group position={[95, 0, -45]}>
        <mesh position={[0, 3, 0]} castShadow>
          <boxGeometry args={[1, 6, 1]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[-5, 3, 0]} castShadow>
          <boxGeometry args={[1, 6, 1]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[-2.5, 6.5, 0]} castShadow>
          <boxGeometry args={[8, 1, 1]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <Text position={[-2.5, 7.5, 0]} fontSize={1} color="white" anchorX="center" anchorY="middle">
          EXIT
        </Text>
      </group>
    </group>
  );
};

// Helper component for creating rail tracks
const RailTrack = ({ position, length }: { position: [number, number, number], length: number }) => {
  return (
    <group position={position}>
      {/* Rail line */}
      <mesh receiveShadow>
        <boxGeometry args={[length, 0.01, 0.3]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} />
      </mesh>
      
      {/* Sleepers/ties */}
      {Array(Math.floor(length / 2)).fill(0).map((_, i) => (
        <mesh key={i} position={[-length/2 + 1 + i*2, -0.01, 0]} receiveShadow>
          <boxGeometry args={[0.8, 0.05, 1.5]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      ))}
    </group>
  );
};

// Helper component for creating stacks of containers
const ContainerStack = ({ position, count, height, color }: { 
  position: [number, number, number], 
  count: number, 
  height: number,
  color: string 
}) => {
  return (
    <group position={position}>
      {Array(count).fill(0).map((_, i) => (
        <group key={i} position={[i*2.5, 0, 0]}>
          {Array(height).fill(0).map((_, j) => (
            <mesh key={j} position={[0, 0.75 + j*1.5, 0]} castShadow>
              <boxGeometry args={[6, 1.5, 2.5]} />
              <meshStandardMaterial 
                color={color} 
                metalness={0.1 + j*0.05} 
                roughness={0.7 - j*0.05}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

// Gantry crane helper component
const GantryCrane = ({ position, width, height, color }: { 
  position: [number, number, number],
  width: number,
  height: number,
  color: string
}) => {
  return (
    <group position={position}>
      {/* Left leg */}
      <mesh position={[-width/2 + 1, height/2, 0]} castShadow>
        <boxGeometry args={[2, height, 2]} />
        <meshStandardMaterial color="#475569" metalness={0.3} />
      </mesh>
      
      {/* Right leg */}
      <mesh position={[width/2 - 1, height/2, 0]} castShadow>
        <boxGeometry args={[2, height, 2]} />
        <meshStandardMaterial color="#475569" metalness={0.3} />
      </mesh>
      
      {/* Top beam */}
      <mesh position={[0, height-1, 0]} castShadow>
        <boxGeometry args={[width, 2, 2]} />
        <meshStandardMaterial color={color} metalness={0.4} />
      </mesh>
      
      {/* Trolley */}
      <mesh position={[width/4, height-2, 0]} castShadow>
        <boxGeometry args={[4, 1, 3]} />
        <meshStandardMaterial color="#334155" metalness={0.5} />
      </mesh>
      
      {/* Hook */}
      <mesh position={[width/4, height/2, 0]} castShadow>
        <boxGeometry args={[0.5, height-4, 0.5]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      
      {/* Container on hook (occasionally) */}
      {Math.random() > 0.7 && (
        <mesh position={[width/4, height/4, 0]} castShadow>
          <boxGeometry args={[6, 1.5, 2.5]} />
          <meshStandardMaterial color="#0ea5e9" metalness={0.2} />
        </mesh>
      )}
    </group>
  );
};

// Add the new module information interfaces
interface ModuleTechnology {
  name: string;
  description: string;
}

interface ModuleBusinessValue {
  title: string;
  description: string;
}

interface SystemModule {
  id: string;
  name: string;
  description: string;
  technologies: ModuleTechnology[];
  businessValues: ModuleBusinessValue[];
  color: string;
  icon?: string;
}

// Define system modules data
const systemModules: SystemModule[] = [
  {
    id: 'terminal-management',
    name: 'Terminal Management',
    description: 'Comprehensive management of cargo movements, terminal space optimization, operation scheduling, and documentation handling.',
    technologies: [
      { name: 'AI/ML', description: 'Optimizes terminal layout and container placement' },
      { name: 'GIS/GPS', description: 'Real-time tracking of container movement and location' },
      { name: 'Blockchain', description: 'Secure storage of shipping documentation and transfer history' }
    ],
    businessValues: [
      { title: 'Cost Reduction', description: 'Reduces storage costs by 32% through optimized space utilization' },
      { title: 'Enhanced Control', description: 'Increases visibility of logistical operations by 87%' },
      { title: 'Error Reduction', description: 'Minimizes documentation errors by 94% through automation' }
    ],
    color: '#3b82f6',
    icon: 'terminal'
  },
  {
    id: 'iot-management',
    name: 'IoT Device Management',
    description: 'Integration with IoT devices for real-time monitoring of containers, equipment conditions, and environmental parameters.',
    technologies: [
      { name: 'LoRaWAN/MQTT', description: 'Low-power communication protocols for widespread sensor deployment' },
      { name: 'Edge Computing', description: 'Localized data processing to reduce latency and bandwidth' },
      { name: 'Predictive Analytics', description: 'AI-powered condition monitoring and anomaly detection' }
    ],
    businessValues: [
      { title: 'Loss Prevention', description: 'Reduces cargo losses by 76% through real-time condition monitoring' },
      { title: 'Maintenance Optimization', description: 'Decreases maintenance costs by 43% through predictive diagnostics' },
      { title: 'Supply Chain Visibility', description: 'Provides 99.8% accurate real-time visibility of goods condition' }
    ],
    color: '#06b6d4',
    icon: 'sensor'
  },
  {
    id: 'fleet-management',
    name: 'Fleet Management',
    description: 'Real-time tracking of vehicles and equipment, route optimization, and maintenance scheduling.',
    technologies: [
      { name: 'Telematics', description: 'Advanced vehicle monitoring and diagnostics systems' },
      { name: 'Route Optimization', description: 'AI algorithms for dynamic route planning and adjustment' },
      { name: 'Predictive Maintenance', description: 'Early detection of potential vehicle failures' }
    ],
    businessValues: [
      { title: 'Fuel Efficiency', description: 'Reduces fuel consumption by 28% through optimized routing' },
      { title: 'Vehicle Utilization', description: 'Increases asset utilization by 35% through better scheduling' },
      { title: 'Maintenance Savings', description: 'Decreases repair costs by 47% through preventative maintenance' }
    ],
    color: '#f59e0b',
    icon: 'truck'
  },
  {
    id: 'hr-management',
    name: 'Human Resources Management',
    description: 'Employee scheduling, role assignment, performance monitoring, and safety compliance management.',
    technologies: [
      { name: 'Workforce Analytics', description: 'AI-powered analysis of workforce performance and patterns' },
      { name: 'Digital Training', description: 'Automated tracking of certifications and required training' },
      { name: 'Safety Systems', description: 'Real-time monitoring of safety compliance and incident reporting' }
    ],
    businessValues: [
      { title: 'Labor Optimization', description: 'Reduces staffing costs by 24% through optimized scheduling' },
      { title: 'Productivity Boost', description: 'Increases worker productivity by 31% through better task assignment' },
      { title: 'Safety Improvement', description: 'Reduces workplace incidents by 68% through proactive monitoring' }
    ],
    color: '#10b981',
    icon: 'person'
  },
  {
    id: 'inventory-management',
    name: 'Inventory Management',
    description: 'Real-time inventory control, order management, and delivery verification systems.',
    technologies: [
      { name: 'RFID/IoT Tracking', description: 'Automated inventory tracking without manual intervention' },
      { name: 'Demand Forecasting', description: 'Machine learning algorithms to predict inventory needs' },
      { name: 'Digital Twin', description: 'Real-time digital representation of physical inventory' }
    ],
    businessValues: [
      { title: 'Storage Optimization', description: 'Reduces storage space requirements by 36% through dynamic management' },
      { title: 'Error Elimination', description: 'Decreases inventory discrepancies by 92% through automation' },
      { title: 'Stock-out Prevention', description: 'Reduces stock-outs by 87% through predictive ordering' }
    ],
    color: '#8b5cf6',
    icon: 'box'
  },
  {
    id: 'analytics',
    name: 'Analysis and Reporting',
    description: 'Comprehensive operational analytics, performance reporting, and AI-powered business forecasting.',
    technologies: [
      { name: 'Business Intelligence', description: 'Interactive dashboards and visualizations for key metrics' },
      { name: 'Predictive Analytics', description: 'AI algorithms to forecast operational trends and needs' },
      { name: 'Real-time KPIs', description: 'Live performance indicators for immediate decision making' }
    ],
    businessValues: [
      { title: 'Decision Velocity', description: 'Accelerates decision-making processes by 74% through real-time insights' },
      { title: 'Cost Forecasting', description: 'Improves budget accuracy by 42% through trend analysis' },
      { title: 'Performance Enhancement', description: 'Identifies efficiency improvements worth an average of $2.3M annually' }
    ],
    color: '#ec4899',
    icon: 'chart'
  },
  {
    id: 'integration',
    name: 'Systems Integration',
    description: 'Seamless integration with external systems including ERP, TMS, customs systems, and APIs for IoT devices.',
    technologies: [
      { name: 'API Architecture', description: 'REST and GraphQL APIs for flexible system interconnection' },
      { name: 'EDI Systems', description: 'Electronic Data Interchange for standardized business communications' },
      { name: 'ESB Architecture', description: 'Enterprise Service Bus for robust system orchestration' }
    ],
    businessValues: [
      { title: 'Process Streamlining', description: 'Reduces processing time by 63% through automated data exchange' },
      { title: 'Error Reduction', description: 'Eliminates 96% of manual data entry errors' },
      { title: 'Scalability', description: 'Enables 5x faster integration of new business partners and systems' }
    ],
    color: '#6366f1',
    icon: 'sync'
  },
  {
    id: 'security',
    name: 'Security Management',
    description: 'Comprehensive access management, security monitoring, incident response, and compliance enforcement.',
    technologies: [
      { name: 'AI-powered Threat Detection', description: 'Advanced algorithms to detect and respond to security threats' },
      { name: 'Blockchain Validation', description: 'Immutable record-keeping for critical transactions' },
      { name: 'Zero Trust Architecture', description: 'Continuous verification of all access attempts' }
    ],
    businessValues: [
      { title: 'Risk Mitigation', description: 'Reduces security incidents by 84% through proactive monitoring' },
      { title: 'Compliance Assurance', description: 'Ensures 100% regulatory compliance with automated controls' },
      { title: 'Trust Enhancement', description: 'Increases client confidence through demonstrated security measures' }
    ],
    color: '#ef4444',
    icon: 'shield'
  },
];

// Add weather condition interface
interface WeatherCondition {
  name: string;
  description: string;
  visibilityFactor: number;
  operationalImpact: string;
  cloudiness: number;
  particleIntensity: number;
  color: string;
}

// Define weather conditions
const weatherConditions: WeatherCondition[] = [
  {
    name: 'Clear',
    description: 'Optimal visibility, no operational disruptions',
    visibilityFactor: 1.0,
    operationalImpact: 'All operations at 100% efficiency',
    cloudiness: 0,
    particleIntensity: 0,
    color: '#87CEEB'
  },
  {
    name: 'Overcast',
    description: 'Reduced natural light, minimal impact on operations',
    visibilityFactor: 0.8,
    operationalImpact: 'Crane operations at 95% efficiency',
    cloudiness: 0.6,
    particleIntensity: 0,
    color: '#708090'
  },
  {
    name: 'Fog',
    description: 'Significantly reduced visibility, requires enhanced sensor operations',
    visibilityFactor: 0.4,
    operationalImpact: 'Vehicle speed reduced by 40%, LiDAR systems active',
    cloudiness: 0.3,
    particleIntensity: 0.5,
    color: '#B6B6B4'
  },
  {
    name: 'Rain',
    description: 'Wet conditions, reduced friction on roads',
    visibilityFactor: 0.6,
    operationalImpact: 'Vehicle speed reduced by 25%, crane operations at 80%',
    cloudiness: 0.7,
    particleIntensity: 0.7,
    color: '#4682B4'
  },
  {
    name: 'Heavy Wind',
    description: 'Strong winds affecting crane operations and container stability',
    visibilityFactor: 0.7,
    operationalImpact: 'Crane operations at 60%, heavy container movement restricted',
    cloudiness: 0.4,
    particleIntensity: 0.2,
    color: '#A0B4C8'
  }
];

// Key Performance Indicator interface
interface KPI {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target: number;
  color: string;
}

// Define KPIs for the dashboard
const initialKPIs: KPI[] = [
  {
    name: 'Throughput',
    value: 127,
    unit: 'containers/hour',
    trend: 'up',
    target: 120,
    color: '#10b981'
  },
  {
    name: 'Equipment Utilization',
    value: 84.5,
    unit: '%',
    trend: 'up',
    target: 80,
    color: '#3b82f6'
  },
  {
    name: 'Average Dwell Time',
    value: 23.2,
    unit: 'hours',
    trend: 'down',
    target: 24,
    color: '#8b5cf6'
  },
  {
    name: 'Energy Consumption',
    value: 3.7,
    unit: 'MWh',
    trend: 'down',
    target: 4.2,
    color: '#10b981'
  },
  {
    name: 'Vehicle Idle Time',
    value: 14.3,
    unit: '%',
    trend: 'down',
    target: 15,
    color: '#f59e0b'
  },
  {
    name: 'Safety Incidents',
    value: 0,
    unit: 'incidents/month',
    trend: 'stable',
    target: 0,
    color: '#ef4444'
  }
];

// Alert interface
interface Alert {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  relatedModule?: string;
  vehicle?: string;
}

// WeatherEffect component for fog, rain, etc.
const WeatherEffect = ({ condition }: { condition: WeatherCondition }) => {
  if (condition.name === 'Clear') return null;

  // Create appropriate effects based on weather
  return (
    <group>
      {condition.cloudiness > 0 && (
        <>
          <Cloud
            opacity={condition.cloudiness}
            speed={0.4}
            position={[0, 50, 0]}
            segments={20}
          />
          <Cloud
            opacity={condition.cloudiness * 0.7}
            speed={0.2}
            position={[40, 30, -40]}
            segments={20}
          />
          <Cloud
            opacity={condition.cloudiness * 0.5}
            speed={0.3}
            position={[-40, 40, -20]}
            segments={15}
          />
        </>
      )}
      {condition.name === 'Fog' && (
        <fog attach="fog" args={[condition.color, 10, 60]} />
      )}
      {condition.name === 'Rain' && (
        <RainEffect intensity={condition.particleIntensity} />
      )}
      {condition.name === 'Heavy Wind' && (
        <WindEffect intensity={condition.particleIntensity} />
      )}
    </group>
  );
};

// Rain particle effect
const RainEffect = ({ intensity }: { intensity: number }) => {
  const count = Math.floor(intensity * 1000);
  return (
    <Sparkles
      count={count}
      size={4}
      scale={[100, 50, 100]}
      speed={10}
      noise={0.1}
      position={[0, 30, 0]}
      color="#7EB2DD"
      opacity={0.4}
    />
  );
};

// Wind effect simulation
const WindEffect = ({ intensity }: { intensity: number }) => {
  const count = Math.floor(intensity * 300);
  return (
    <Sparkles
      count={count}
      size={1}
      scale={[100, 20, 100]}
      speed={20}
      noise={1}
      position={[0, 20, 0]}
      color="#FFFFFF"
      opacity={0.2}
    />
  );
};

// KPI Dashboard Component
const KPIDashboard = ({ kpis }: { kpis: KPI[] }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '100px',
      right: '20px',
      background: 'rgba(0,0,0,0.85)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      width: '350px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      border: '1px solid #3b82f6',
      zIndex: 100
    }}>
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        paddingBottom: '10px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: '0', color: '#3b82f6' }}>Performance Dashboard</h3>
        <div style={{
          fontSize: '0.75em',
          background: 'rgba(59, 130, 246, 0.2)',
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          REAL-TIME
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '10px'
      }}>
        {kpis.map(kpi => (
          <div key={kpi.name} style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: '10px', 
            borderRadius: '6px',
            borderLeft: `3px solid ${kpi.color}`,
          }}>
            <div style={{ fontSize: '0.7em', opacity: 0.7, marginBottom: '3px' }}>
              {kpi.name}
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                {kpi.value} <span style={{ fontSize: '0.7em', opacity: 0.7 }}>{kpi.unit}</span>
              </div>
              <div style={{
                color: kpi.trend === 'up' ? '#10b981' : kpi.trend === 'down' ? '#ef4444' : '#f59e0b',
                fontSize: '0.9em',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'} 
                {kpi.trend === 'up' ? ((kpi.value / kpi.target - 1) * 100).toFixed(1) + '%' :
                 kpi.trend === 'down' ? ((1 - kpi.value / kpi.target) * 100).toFixed(1) + '%' : '0%'}
              </div>
            </div>
            <div style={{ 
              height: '3px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '2px',
              marginTop: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${(kpi.value / kpi.target) * 100}%`,
                background: kpi.color,
                borderRadius: '2px'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Alert Notification Component
const AlertNotifications = ({ alerts }: { alerts: Alert[] }) => {
  if (alerts.length === 0) return null;
  
  return (
    <div style={{
      position: 'absolute',
      top: '80px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '350px'
    }}>
      {alerts.slice(0, 3).map(alert => (
        <div
          key={alert.id}
          style={{
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            borderLeft: `4px solid ${
              alert.severity === 'high' ? '#ef4444' : 
              alert.severity === 'medium' ? '#f59e0b' : '#3b82f6'
            }`,
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            alignItems: 'center'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>
              {alert.title}
            </div>
            <div style={{
              fontSize: '0.7em',
              padding: '2px 6px',
              borderRadius: '4px',
              background: alert.severity === 'high' ? 'rgba(239, 68, 68, 0.2)' : 
                        alert.severity === 'medium' ? 'rgba(245, 158, 11, 0.2)' : 
                        'rgba(59, 130, 246, 0.2)',
            }}>
              {alert.severity.toUpperCase()}
            </div>
          </div>
          <div style={{ fontSize: '0.8em', marginBottom: '5px' }}>
            {alert.message}
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '0.7em',
            opacity: 0.7
          }}>
            <div>{new Date(alert.timestamp).toLocaleTimeString()}</div>
            {alert.relatedModule && <div>{alert.relatedModule}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

// Simulation Controls Component
const SimulationControls = ({
  speed, 
  setSpeed,
  weather,
  setWeather
}: {
  speed: number;
  setSpeed: (speed: number) => void;
  weather: WeatherCondition;
  setWeather: (weather: WeatherCondition) => void;
}) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      // Move from right side to left side next to the info panel
      left: '440px', // Positioned to the right of the info panel
      background: 'rgba(0,0,0,0.85)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      width: '200px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      border: '1px solid #3b82f6',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '15px' }}>
        <div style={{ marginBottom: '5px', fontSize: '0.8em', opacity: 0.7 }}>
          Simulation Speed: {speed.toFixed(1)}x
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button 
            onClick={() => setSpeed(Math.max(0.1, speed - 0.5))}
            style={{
              background: '#1e293b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 10px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Slower
          </button>
          <button 
            onClick={() => setSpeed(Math.min(3, speed + 0.5))}
            style={{
              background: '#1e293b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 10px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Faster
          </button>
        </div>
      </div>
      
      <div>
        <div style={{ marginBottom: '5px', fontSize: '0.8em', opacity: 0.7 }}>
          Weather Conditions
        </div>
        <select 
          value={weather.name}
          onChange={(e) => {
            const selected = weatherConditions.find(w => w.name === e.target.value);
            if (selected) setWeather(selected);
          }}
          style={{
            width: '100%',
            padding: '5px',
            background: '#1e293b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            outline: 'none'
          }}
        >
          {weatherConditions.map(condition => (
            <option key={condition.name} value={condition.name}>
              {condition.name}
            </option>
          ))}
        </select>
        <div style={{ 
          fontSize: '0.7em', 
          marginTop: '5px', 
          opacity: 0.7,
          fontStyle: 'italic'
        }}>
          {weather.operationalImpact}
        </div>
      </div>
    </div>
  );
};

// EnhancedDryPortScene component to render all vehicles and infrastructure
const EnhancedDryPortScene = ({ 
  onSelectVehicle, 
  selectedVehicleId, 
  simulationSpeed,
  weather
}: { 
  onSelectVehicle: (vehicle: VehicleData | null) => void;
  selectedVehicleId: string | null;
  simulationSpeed: number;
  weather: WeatherCondition;
}) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={weather.visibilityFactor * 0.5} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={weather.visibilityFactor * 1.5} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Main ground and infrastructure */}
      <Ground />
      <AdditionalInfrastructure />
      
      {/* Render vehicles based on filter type */}
      {vehicleData.map(vehicle => {
        const isSelected = selectedVehicleId === vehicle.id;
        
        switch(vehicle.type) {
          case 'train':
            return (
              <SmartTrain 
                key={vehicle.id}
                data={vehicle}
                onSelect={onSelectVehicle}
                selected={isSelected}
              />
            );
          case 'truck':
            return (
              <SmartTruck 
                key={vehicle.id}
                data={vehicle}
                position={vehicle.position}
                direction={Math.random() > 0.5 ? 1 : -1}
                speed={0.05 * simulationSpeed}
                onSelect={onSelectVehicle}
                selected={isSelected}
              />
            );
          case 'forklift':
            return (
              <SmartForklift 
                key={vehicle.id}
                data={vehicle}
                onSelect={onSelectVehicle}
                selected={isSelected}
              />
            );
          case 'scanner':
            return (
              <ScannerSystem 
                key={vehicle.id}
                data={vehicle}
                onSelect={onSelectVehicle}
                selected={isSelected}
              />
            );
          case 'crane':
            return (
              <SmartCrane 
                key={vehicle.id}
                data={vehicle}
                onSelect={onSelectVehicle}
                selected={isSelected}
              />
            );
          default:
            return null;
        }
      })}
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        maxPolarAngle={Math.PI / 2 - 0.1} // Prevent camera from going below ground
        minDistance={10}
        maxDistance={150}
      />
    </>
  );
};

// Main enhanced dry port simulation component
const EnhancedDryPortSimulation = ({ filter = 'all', highlight = 'none' }: { filter?: string, highlight?: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  const [showModules, setShowModules] = useState(false);
  const [selectedModule, setSelectedModule] = useState<SystemModule | null>(null);
  const [simulationSpeed, setSimulationSpeed] = useState(1.0);
  const [weather, setWeather] = useState<WeatherCondition>(weatherConditions[0]);
  const [kpis, setKpis] = useState<KPI[]>(initialKPIs);
  const [showKpis, setShowKpis] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  // Handle loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Update KPIs periodically to simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      setKpis(currentKpis => currentKpis.map(kpi => {
        // Apply random small fluctuations to KPI values
        const fluctuation = (Math.random() - 0.5) * 0.05;
        const newValue = kpi.value * (1 + fluctuation);
        
        // Update trend based on new value vs target
        let trend: 'up' | 'down' | 'stable';
        if (kpi.name === 'Average Dwell Time' || kpi.name === 'Vehicle Idle Time' || kpi.name === 'Energy Consumption') {
          trend = newValue < kpi.target ? 'down' : newValue > kpi.target * 1.05 ? 'up' : 'stable';
        } else {
          trend = newValue > kpi.target ? 'up' : newValue < kpi.target * 0.95 ? 'down' : 'stable';
        }
        
        return { ...kpi, value: Number(newValue.toFixed(1)), trend };
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Generate random alerts
  useEffect(() => {
    // Initial alert
    setTimeout(() => {
      const newAlert: Alert = {
        id: 'alert-' + Date.now(),
        title: 'Predictive Maintenance Alert',
        message: 'Crane-1 hydraulic system showing early signs of wear. Maintenance scheduled for next week.',
        timestamp: new Date(),
        severity: 'medium',
        relatedModule: 'Fleet Management',
        vehicle: 'SmartCrane-C5'
      };
      setAlerts(prev => [newAlert, ...prev]);
    }, 15000);
    
    // Random alerts generation
    const interval = setInterval(() => {
      // 30% chance to generate an alert
      if (Math.random() > 0.7) {
        const alertTypes = [
          {
            title: 'Battery Level Warning',
            message: 'Forklift FL-02 battery level below 20%. Charging station notified.',
            severity: 'medium',
            module: 'Fleet Management'
          },
          {
            title: 'Optimal Route Recommended',
            message: 'Traffic congestion detected. Alternative route calculated for delivery trucks.',
            severity: 'low',
            module: 'Transport Management'
          },
          {
            title: 'Container Temperature Alert',
            message: 'Temperature rising in refrigerated container #R-1842. Cooling system power increased.',
            severity: 'high',
            module: 'IoT Management'
          },
          {
            title: 'Operation Milestone Reached',
            message: '1000th container processed today, exceeding daily target by 12%.',
            severity: 'low',
            module: 'Terminal Management'
          },
          {
            title: 'Maintenance Complete',
            message: 'Scheduled maintenance for Crane #2 completed. All systems operational.',
            severity: 'low',
            module: 'Fleet Management'
          }
        ];
        
        const selectedAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        const newAlert: Alert = {
          id: 'alert-' + Date.now(),
          title: selectedAlert.title,
          message: selectedAlert.message,
          timestamp: new Date(),
          severity: selectedAlert.severity as 'low' | 'medium' | 'high',
          relatedModule: selectedAlert.module
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle: VehicleData | null) => {
    setSelectedVehicle(vehicle);
    // Close modules panel when selecting a vehicle
    if (vehicle) setShowModules(false);
  };
  
  // Toggle modules panel
  const toggleModulesPanel = () => {
    setShowModules(!showModules);
    // Close vehicle details when opening modules
    if (!showModules) setSelectedVehicle(null);
  };
  
  // Toggle KPI dashboard
  const toggleKPIDashboard = () => {
    setShowKpis(!showKpis);
  };
  
  // Select a specific module
  const handleModuleSelect = (moduleId: string) => {
    const module = systemModules.find(m => m.id === moduleId);
    setSelectedModule(module || null);
  };
  
  return (
    <>
      {/* Existing global styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        /* Force blue background color on body and html */
        html, body {
          background-color: #1E90FF !important;
        }
      `}</style>
      
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        backgroundColor: '#1E90FF', 
        position: 'relative' 
      }}>
        <Canvas 
          camera={{ position: [0, 40, 80], fov: 50 }}
          shadows
          gl={{ 
            antialias: true,
            // clearColor: '#1E90FF', // Set WebGL clear color to blue
            alpha: false // Disable alpha to ensure solid background
          }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Remove Sky component and use stronger direct approach */}
          <color attach="background" args={['#1E90FF']} /> {/* Dodger Blue */}
          
          {/* Add blue fog for atmosphere */}
          {/* <fog attach="fog" args={['#1E90FF', 70, 200]} /> */}
          
          {/* Weather effects */}
          <WeatherEffect condition={weather} />
          
          {/* Stars only at night - moved above scene so they don't block it */}
          {weather.visibilityFactor > 0.8 && (
            <Stars radius={100} depth={50} count={5000} factor={2} saturation={0.5} fade speed={1} />
          )}
          
          {/* Main scene with simulation speed control */}
          <EnhancedDryPortScene 
            onSelectVehicle={handleVehicleSelect} 
            selectedVehicleId={selectedVehicle?.id || null} 
            simulationSpeed={simulationSpeed}
            weather={weather}
          />
          
          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
          </EffectComposer>
        </Canvas>
        
        {/* Button Bar - Combined controls in one row */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={toggleModulesPanel}
            style={{
              background: showModules ? 'rgba(16, 185, 129, 0.9)' : 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {showModules ? 'Hide System Modules' : 'Show System Modules'}
          </button>
          
          <button
            onClick={toggleKPIDashboard}
            style={{
              background: showKpis ? 'rgba(59, 130, 246, 0.9)' : 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {showKpis ? 'Hide KPI Dashboard' : 'Show KPI Dashboard'}
          </button>
        </div>
        
        {/* Modules Information Panel */}
        {showModules && (
          <div style={{
            position: 'absolute',
            top: '70px',
            left: '20px',
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            width: '350px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            border: '1px solid #3b82f6',
            zIndex: 100
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '15px',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              paddingBottom: '10px'
            }}>
              <h3 style={{ margin: '0', color: '#3b82f6' }}>
                {selectedModule ? selectedModule.name : 'System Modules'}
              </h3>
              {selectedModule && (
                <button
                  onClick={() => setSelectedModule(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#999',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Back to Modules
                </button>
              )}
            </div>

            {selectedModule ? (
              // Selected module detailed view
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '0.9em', lineHeight: '1.5' }}>
                    {selectedModule.description}
                  </div>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9em', color: '#3b82f6' }}>KEY TECHNOLOGIES</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedModule.technologies.map((tech, index) => (
                      <div key={index} style={{ 
                        background: 'rgba(255,255,255,0.1)', 
                        padding: '10px', 
                        borderRadius: '5px',
                        borderLeft: `4px solid ${selectedModule.color}`
                      }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>{tech.name}</div>
                        <div style={{ fontSize: '0.85em', opacity: 0.8 }}>{tech.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9em', color: '#10b981' }}>BUSINESS VALUE</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedModule.businessValues.map((value, index) => (
                      <div key={index} style={{ 
                        background: 'rgba(255,255,255,0.1)', 
                        padding: '10px', 
                        borderRadius: '5px',
                        borderLeft: `4px solid #10b981`
                      }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>{value.title}</div>
                        <div style={{ fontSize: '0.85em', opacity: 0.8 }}>{value.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Module selection grid
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {systemModules.map(module => (
                  <div 
                    key={module.id}
                    onClick={() => handleModuleSelect(module.id)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      padding: '15px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      borderLeft: `4px solid ${module.color}`,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px', color: module.color }}>
                      {module.name}
                    </div>
                    <div style={{ fontSize: '0.8em', opacity: 0.8, height: '40px', overflow: 'hidden' }}>
                      {module.description.length > 70 
                        ? `${module.description.substring(0, 70)}...` 
                        : module.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* KPI Dashboard */}
        {showKpis && <KPIDashboard kpis={kpis} />}
        
        {/* Alert Notifications */}
        <AlertNotifications alerts={alerts} />
        
        {/* Simulation Controls - MOVED to prevent overlap with KPI Dashboard */}
        <SimulationControls 
          speed={simulationSpeed} 
          setSpeed={setSimulationSpeed}
          weather={weather}
          setWeather={setWeather}
        />
        
        {/* Fixed Position Detail Card (when a vehicle is selected) */}
        {selectedVehicle && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            width: '350px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            border: `1px solid ${selectedVehicle.color}`,
            zIndex: 100
          }}>
            {/* Header */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: '0', color: selectedVehicle.color }}>{selectedVehicle.name}</h3>
                <button 
                  onClick={() => setSelectedVehicle(null)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: '#999', 
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '0 5px'
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '0.8em', opacity: 0.7, marginTop: '3px' }}>
                {selectedVehicle.description}
              </div>
            </div>
            
            {/* Module Badge - Show which module this vehicle belongs to */}
            {selectedVehicle.module && (
              <div style={{
                display: 'inline-block',
                background: 'rgba(59, 130, 246, 0.3)',
                padding: '3px 8px',
                borderRadius: '20px',
                fontSize: '0.7em',
                marginBottom: '15px'
              }}>
                {selectedVehicle.module || 'Transport Management'}
              </div>
            )}
            
            {/* Status Badge */}
            <div style={{
              display: 'inline-block',
              background: selectedVehicle.sensorData.status === 'Active Scanning' ? '#22c55e' : '#3b82f6',
              padding: '3px 8px',
              borderRadius: '20px',
              fontSize: '0.7em',
              marginBottom: '15px',
              marginLeft: '5px'
            }}>
              {selectedVehicle.sensorData.status}
            </div>
            
            {/* IoT Sensor Data */}
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9em', color: '#3b82f6' }}>SENSOR DATA</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85em' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.8em', opacity: 0.7 }}>Speed</div>
                  <div>{selectedVehicle.sensorData.speed} km/h</div>
                </div>
                
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.8em', opacity: 0.7 }}>Temperature</div>
                  <div>{selectedVehicle.sensorData.temperature}°C</div>
                </div>
                
                {selectedVehicle.sensorData.batteryLevel !== undefined && (
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.8em', opacity: 0.7 }}>Battery</div>
                    <div>{selectedVehicle.sensorData.batteryLevel}%</div>
                  </div>
                )}
                
                {selectedVehicle.sensorData.fuelLevel !== undefined && (
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.8em', opacity: 0.7 }}>Fuel</div>
                    <div>{selectedVehicle.sensorData.fuelLevel}%</div>
                  </div>
                )}
                
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.8em', opacity: 0.7 }}>Load</div>
                  <div>{selectedVehicle.sensorData.loadCapacity}%</div>
                </div>
                
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.8em', opacity: 0.7 }}>Maintenance</div>
                  <div>{selectedVehicle.sensorData.lastMaintenance}</div>
                </div>
              </div>
              
              {/* Advanced Sensors */}
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                margin: '10px 0', 
                fontSize: '0.7em'
              }}>
                <div style={{ 
                  padding: '2px 8px', 
                  borderRadius: '3px',
                  background: selectedVehicle.sensorData.cameras ? 'rgba(59, 130, 246, 0.3)' : 'rgba(100, 100, 100, 0.3)',
                  color: selectedVehicle.sensorData.cameras ? '#3b82f6' : '#999'
                }}>
                  CAMERAS
                </div>
                <div style={{ 
                  padding: '2px 8px', 
                  borderRadius: '3px',
                  background: selectedVehicle.sensorData.lidar ? 'rgba(59, 130, 246, 0.3)' : 'rgba(100, 100, 100, 0.3)',
                  color: selectedVehicle.sensorData.lidar ? '#3b82f6' : '#999'
                }}>
                  LIDAR
                </div>
                <div style={{ 
                  padding: '2px 8px', 
                  borderRadius: '3px',
                  background: selectedVehicle.sensorData.radar ? 'rgba(59, 130, 246, 0.3)' : 'rgba(100, 100, 100, 0.3)',
                  color: selectedVehicle.sensorData.radar ? '#3b82f6' : '#999'
                }}>
                  RADAR
                </div>
              </div>
              
              {/* Location info */}
              <div style={{ marginTop: '10px', fontSize: '0.85em' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.8em', opacity: 0.7 }}>Current Location</div>
                <div>{selectedVehicle.sensorData.location}</div>
                
                <div style={{ fontWeight: 'bold', fontSize: '0.8em', opacity: 0.7, marginTop: '8px' }}>Next Checkpoint</div>
                <div>{selectedVehicle.sensorData.nextCheckpoint}</div>
              </div>
              
              {/* Cargo description */}
              {selectedVehicle.cargoDescription && (
                <div style={{ 
                  marginTop: '15px', 
                  background: 'rgba(255,255,255,0.1)', 
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '0.85em'
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.8em', opacity: 0.7 }}>Cargo</div>
                  <div>{selectedVehicle.cargoDescription}</div>
                </div>
              )}
            </div>
            
            {/* Business Impact */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9em', color: '#10b981' }}>BUSINESS IMPACT</h4>
              
              <div style={{ fontSize: '0.85em' }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.8em', opacity: 0.7 }}>Efficiency</div>
                  <div>{selectedVehicle.businessImpact.efficiencyGain}</div>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.8em', opacity: 0.7 }}>Cost Savings</div>
                  <div>{selectedVehicle.businessImpact.costSavings}</div>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.8em', opacity: 0.7 }}>Safety</div>
                  <div>{selectedVehicle.businessImpact.safetyImprovement}</div>
                </div>
                
                <div style={{ 
                  marginTop: '10px', 
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  paddingTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.8em' }}>ROI:</div>
                  <div style={{ 
                    color: '#10b981',
                    fontWeight: 'bold'
                  }}>{selectedVehicle.businessImpact.roi}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Information overlay */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          fontSize: '14px',
          maxWidth: '400px',
          zIndex: 100
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>Smart Dry Port Simulation</h3>
          <p style={{ margin: '0 0 10px 0', lineHeight: '1.5' }}>
            Hover over vehicles and infrastructure to see real-time IoT data. 
            Click for detailed analytics and business impact information.
          </p>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            <strong>Navigation:</strong> Drag to rotate • Scroll to zoom • Right-click to pan
          </div>
          <div style={{ 
            marginTop: '5px',
            padding: '5px',
            background: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '4px',
            fontSize: '12px' 
          }}>
            <strong>Current Weather:</strong> {weather.name} - {weather.description}
          </div>
        </div>
        
        {/* Loading indicator */}
        {!loaded && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            zIndex: 1000
          }}>
            <h2>Loading IoT-Enabled Port Simulation</h2>
            <div style={{ 
              width: '200px', 
              height: '4px', 
              backgroundColor: '#1e293b',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '20px'
            }}>
              <div 
                style={{
                  height: '100%',
                  width: '50%',
                  backgroundColor: '#3b82f6',
                  borderRadius: '2px',
                  animation: 'move 1.5s infinite ease-in-out'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EnhancedDryPortSimulation;