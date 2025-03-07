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
  Billboard 
} from '@react-three/drei';
import { Group, Vector3, MathUtils } from 'three';

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
      // Move the train along x-axis
      const xPosition = Math.sin(clock.getElapsedTime() * 0.2) * 25;
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

// Enhanced Ground component with more details
const Ground = () => {
  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[250, 250]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      
      {/* Additional asphalt areas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20, -0.48, 15]} receiveShadow>
        <planeGeometry args={[60, 20]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-20, -0.48, -15]} receiveShadow>
        <planeGeometry args={[50, 30]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
      
      {/* Concrete loading zones */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.47, -25]} receiveShadow>
        <planeGeometry args={[100, 15]} />
        <meshStandardMaterial color="#374151" roughness={0.6} />
      </mesh>
      
      {/* Additional railways */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.46, -45]} receiveShadow>
        <planeGeometry args={[120, 12]} />
        <meshStandardMaterial color="#4b5563" roughness={0.5} />
      </mesh>
    </group>
  );
};

// Additional infrastructure components
const AdditionalInfrastructure = () => {
  return (
    <group>
      {/* Additional warehouses */}
      <group position={[-35, 0, -20]}>
        <mesh position={[0, 2.5, 0]} castShadow>
          <boxGeometry args={[15, 5, 10]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 5.5, 0]} castShadow>
          <coneGeometry args={[9, 2, 4]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <Text position={[0, 8, 0]} fontSize={1.2} color="white" anchorX="center" anchorY="middle">
          Bulk Storage Facility
        </Text>
      </group>
      
      <group position={[40, 0, -20]}>
        <mesh position={[0, 3, 0]} castShadow>
          <boxGeometry args={[18, 6, 12]} />
          <meshStandardMaterial color="#0f766e" />
        </mesh>
        <mesh position={[0, 6.5, 0]} castShadow>
          <coneGeometry args={[10, 2.5, 4]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <Text position={[0, 9, 0]} fontSize={1.2} color="white" anchorX="center" anchorY="middle">
          Distribution Center
        </Text>
      </group>
      
      <group position={[0, 0, -60]}>
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[14, 4, 8]} />
          <meshStandardMaterial color="#7e22ce" />
        </mesh>
        <mesh position={[0, 4.5, 0]} castShadow>
          <coneGeometry args={[7, 2, 4]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <Text position={[0, 7, 0]} fontSize={1.2} color="white" anchorX="center" anchorY="middle">
          Rail Terminal
        </Text>
      </group>
      
      {/* More container stacks */}
      <group position={[-30, 0, 20]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[5, 1.5, 2]} />
          <meshStandardMaterial color="#e11d48" />
        </mesh>
        <mesh position={[0, 2.25, 0]} castShadow>
          <boxGeometry args={[5, 1.5, 2]} />
          <meshStandardMaterial color="#e11d48" metalness={0.1} />
        </mesh>
      </group>
      
      <group position={[-25, 0, 20]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[5, 1.5, 2]} />
          <meshStandardMaterial color="#9333ea" />
        </mesh>
        <mesh position={[0, 2.25, 0]} castShadow>
          <boxGeometry args={[5, 1.5, 2]} />
          <meshStandardMaterial color="#9333ea" metalness={0.1} />
        </mesh>
        <mesh position={[0, 3.75, 0]} castShadow>
          <boxGeometry args={[5, 1.5, 2]} />
          <meshStandardMaterial color="#9333ea" metalness={0.2} />
        </mesh>
      </group>
      
      {/* More roads with lane markings */}
      <group position={[0, -0.3, 30]}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[100, 0.1, 8]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0, 0.06, 0]} receiveShadow>
          <boxGeometry args={[90, 0.01, 0.3]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>
      
      <group position={[-40, -0.3, 0]} rotation={[0, Math.PI/2, 0]}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[80, 0.1, 8]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0, 0.06, 0]} receiveShadow>
          <boxGeometry args={[70, 0.01, 0.3]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>
      
      {/* Control tower structure */}
      <group position={[35, 0, 35]}>
        <mesh position={[0, 7, 0]} castShadow>
          <cylinderGeometry args={[3, 4, 14, 16]} />
          <meshStandardMaterial color="#1e40af" metalness={0.3} />
        </mesh>
        <mesh position={[0, 15, 0]} castShadow>
          <cylinderGeometry args={[5, 3, 2, 16]} />
          <meshStandardMaterial color="#60a5fa" opacity={0.7} transparent={true} metalness={0.8} />
        </mesh>
        <Text position={[0, 18, 0]} fontSize={1.2} color="white" anchorX="center" anchorY="middle">
          IoT Control Center
        </Text>
      </group>
      
      {/* Security fencing */}
      <group>
        {/* North fence */}
        <mesh position={[0, 1, -80]} castShadow>
          <boxGeometry args={[160, 2, 0.2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        
        {/* South fence */}
        <mesh position={[0, 1, 80]} castShadow>
          <boxGeometry args={[160, 2, 0.2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        
        {/* East fence */}
        <mesh position={[80, 1, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
          <boxGeometry args={[160, 2, 0.2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        
        {/* West fence */}
        <mesh position={[-80, 1, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
          <boxGeometry args={[160, 2, 0.2]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      </group>
    </group>
  );
};

// Enhanced port boundary component
const PortBoundary = () => {
  return (
    <group>
      {/* Port outline */}
      <mesh position={[0, -0.48, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[79, 80, 64]} />
        <meshBasicMaterial color="#4299e1" />
      </mesh>
      
      {/* Main title */}
      <Text
        position={[0, 14, -70]}
        fontSize={6}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        SMART DRY PORT
      </Text>
      
      <Text
        position={[0, 8, -70]}
        fontSize={2.5}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        IoT-Enabled Port Operations Management
      </Text>
    </group>
  );
};

// Main scene component
const EnhancedDryPortScene = ({ onSelectVehicle, selectedVehicleId }: { 
  onSelectVehicle: (vehicle: VehicleData | null) => void;
  selectedVehicleId: string | null;
}) => {
  // Handle selection change
  const handleSelect = (vehicle: VehicleData | null) => {
    onSelectVehicle(vehicle);
  };

  // Close selection when clicking on empty space
  const handleBackgroundClick = () => {
    onSelectVehicle(null);
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
      />
      <hemisphereLight args={['#87ceeb', '#4a6a8a', 0.5]} />
      
      {/* Scene background */}
      <color attach="background" args={['#000000']} />
      
      {/* Ground */}
      <Ground />
      
      {/* Port outline */}
      <PortBoundary />
      
      {/* Additional infrastructure */}
      <AdditionalInfrastructure />
      
      {/* Background click handler */}
      <mesh 
        position={[0, -0.49, 0]} 
        rotation={[-Math.PI/2, 0, 0]} 
        onClick={handleBackgroundClick}
        visible={false}
      >
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#000000" opacity={0} transparent />
      </mesh>
      
      {/* Render each vehicle from the vehicle data array */}
      {vehicleData.map(vehicle => {
        switch(vehicle.type) {
          case 'train':
            return (
              <SmartTrain 
                key={vehicle.id}
                data={vehicle}
                onSelect={handleSelect}
                selected={selectedVehicleId === vehicle.id}
              />
            );
          case 'truck':
            // Different road positions for different trucks
            const truckProps: {
              [key: string]: {
                position: [number, number, number]; 
                direction: number; 
                speed: number;
              }
            } = {
              'truck-1': { position: [0, 0, 15], direction: 1, speed: 0.08 },
              'truck-2': { position: [15, 0, 15], direction: -1, speed: 0.06 },
              'truck-3': { position: [-15, 0, 30], direction: 1, speed: 0.09 },
              'truck-4': { position: [30, 0, 30], direction: -1, speed: 0.07 }
            };
            return (
              <SmartTruck 
                key={vehicle.id}
                data={vehicle}
                {...truckProps[vehicle.id as keyof typeof truckProps]}
                onSelect={handleSelect}
                selected={selectedVehicleId === vehicle.id}
              />
            );
          case 'forklift':
            return (
              <SmartForklift
                key={vehicle.id}
                data={vehicle}
                onSelect={handleSelect}
                selected={selectedVehicleId === vehicle.id}
              />
            );
          case 'scanner':
            return (
              <ScannerSystem
                key={vehicle.id}
                data={vehicle}
                onSelect={handleSelect}
                selected={selectedVehicleId === vehicle.id}
              />
            );
          case 'crane':
            return (
              <SmartCrane
                key={vehicle.id}
                data={vehicle}
                onSelect={handleSelect}
                selected={selectedVehicleId === vehicle.id}
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
        minDistance={10}
        maxDistance={200}
        maxPolarAngle={Math.PI/2.2} // Limit to prevent seeing under the ground
      />
    </>
  );
};

// Main enhanced dry port simulation component
const EnhancedDryPortSimulation = ({ filter = 'all', highlight = 'none' }: { filter?: string, highlight?: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  
  // Handle loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle: VehicleData | null) => {
    setSelectedVehicle(vehicle);
  };
  
  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#000000', position: 'relative' }}>
      <Canvas 
        camera={{ position: [0, 40, 80], fov: 50 }}
        shadows
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <EnhancedDryPortScene 
          onSelectVehicle={handleVehicleSelect} 
          selectedVehicleId={selectedVehicle?.id || null} 
        />
      </Canvas>
      
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
          
          {/* Status Badge */}
          <div style={{
            display: 'inline-block',
            background: selectedVehicle.sensorData.status === 'Active Scanning' ? '#22c55e' : '#3b82f6',
            padding: '3px 8px',
            borderRadius: '20px',
            fontSize: '0.7em',
            marginBottom: '15px'
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
          <style jsx>{`
            @keyframes move {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default EnhancedDryPortSimulation;