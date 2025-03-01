import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Box } from 'theme-ui';

interface DataPacketVisualizationProps {
  sx?: any;
}

// Define IoT node types
enum NodeType {
  SENSOR = 'sensor',
  CONTROLLER = 'controller',
  GATEWAY = 'gateway',
  ENDPOINT = 'endpoint'
}

// Node type visual properties
const NODE_PROPERTIES = {
  [NodeType.SENSOR]: {
    color: 0x3498db, // blue
    size: 0.4,
    geometry: new THREE.OctahedronGeometry(1, 0) // Octahedron for sensors
  },
  [NodeType.CONTROLLER]: {
    color: 0x2ecc71, // green
    size: 0.6,
    geometry: new THREE.BoxGeometry(1, 1, 1) // Box for controllers
  },
  [NodeType.GATEWAY]: {
    color: 0xe74c3c, // red
    size: 0.7,
    geometry: new THREE.TorusGeometry(0.5, 0.2, 8, 16) // Torus for gateways
  },
  [NodeType.ENDPOINT]: {
    color: 0xf39c12, // orange
    size: 0.5,
    geometry: new THREE.DodecahedronGeometry(0.5, 0) // Dodecahedron for endpoints
  }
};

// Data packet types with different colors
const PACKET_TYPES = [
  { color: 0xffff00, speed: 0.04, size: 0.15 }, // Standard data
  { color: 0x00ffff, speed: 0.06, size: 0.18 }, // Control messages
  { color: 0xff00ff, speed: 0.03, size: 0.2 }   // Configuration data
];

const DataPacketVisualization: React.FC<DataPacketVisualizationProps> = ({ sx = {} }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    nodes: THREE.Mesh[];
    links: THREE.Line[];
    packets: THREE.Mesh[];
    trails: THREE.Points[];
    clock: THREE.Clock;
    animationFrameId?: number;
  } | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const container = containerRef.current;
    const scene = new THREE.Scene();
    
    // Create a more immersive camera setting
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    const nodes: THREE.Mesh[] = [];
    const links: THREE.Line[] = [];
    const packets: THREE.Mesh[] = [];
    const trails: THREE.Points[] = [];
    const clock = new THREE.Clock();

    // Store scene objects for later use
    sceneRef.current = { scene, camera, renderer, composer: null!, nodes, links, packets, trails, clock };

    // Setup renderer with higher quality
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Setup scene - use a more interesting background gradient
    const color1 = new THREE.Color(0x020223);
    const color2 = new THREE.Color(0x0f0f33);
    
    const bgTexture = createGradientBackground(color1, color2, 512);
    scene.background = bgTexture;
    
    // Setup camera with a more interesting position
    camera.position.set(0, 10, 50);
    camera.lookAt(0, 0, 0);

    // Add lighting for more dramatic effect
    const ambientLight = new THREE.AmbientLight(0x333355, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Add a subtle point light for highlights
    const pointLight = new THREE.PointLight(0x3677ff, 0.8, 50);
    pointLight.position.set(-10, 15, 10);
    scene.add(pointLight);

    // Add a second point light from another angle
    const pointLight2 = new THREE.PointLight(0x36ffb5, 0.6, 40);
    pointLight2.position.set(15, 5, -10);
    scene.add(pointLight2);

    // Setup post-processing
    const composer = new EffectComposer(renderer);
    sceneRef.current.composer = composer;
    
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // Add bloom effect for glowing elements
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.6,   // strength
      0.4,   // radius
      0.85   // threshold
    );
    composer.addPass(bloomPass);

    // Create IoT network
    createStructuredNetwork();
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;

      const { camera, renderer, composer } = sceneRef.current;
      const container = containerRef.current;

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(container.clientWidth, container.clientHeight);
      composer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up on unmount
    return () => {
      if (sceneRef.current?.animationFrameId) {
        cancelAnimationFrame(sceneRef.current.animationFrameId);
      }
      
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Create gradient background texture
  const createGradientBackground = (color1: THREE.Color, color2: THREE.Color, size: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    
    const context = canvas.getContext('2d')!;
    const gradient = context.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, color1.getStyle());
    gradient.addColorStop(1, color2.getStyle());
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  // Create a structured IoT network topology
  const createStructuredNetwork = () => {
    if (!sceneRef.current) return;

    // Create a central hub (gateway)
    createCentralHub();
    
    // Create clusters of devices around the central hub
    createDeviceClusters(4, 8);

    // Create links between nodes
    createNetworkLinks();
  };

  // Create a central hub (gateway) for our network
  const createCentralHub = () => {
    if (!sceneRef.current) return;

    const { scene, nodes } = sceneRef.current;
    
    // Create the main gateway at center
    const gatewayNode = createNode(NodeType.GATEWAY, 0, 0, 0, 1.5);
    nodes.push(gatewayNode);
    scene.add(gatewayNode);
    
    // Add a glowing effect to the gateway
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.5
    });
    
    const glowSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      glowMaterial
    );
    
    gatewayNode.add(glowSphere);
    
    // Create a ring around the gateway
    const ringGeometry = new THREE.RingGeometry(2, 2.1, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x3677ff, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    
    // Add controllers around the gateway
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const x = Math.cos(angle) * 5;
      const z = Math.sin(angle) * 5;
      const y = 0;
      
      const controllerNode = createNode(NodeType.CONTROLLER, x, y, z);
      nodes.push(controllerNode);
      scene.add(controllerNode);
    }
  };

  // Create clusters of IoT devices around controllers
  const createDeviceClusters = (clusterCount: number, devicesPerCluster: number) => {
    if (!sceneRef.current) return;

    const { scene, nodes } = sceneRef.current;
    
    for (let cluster = 0; cluster < clusterCount; cluster++) {
      // Position the cluster in 3D space
      const clusterAngle = (cluster / clusterCount) * Math.PI * 2;
      const clusterDist = 15;
      const clusterX = Math.cos(clusterAngle) * clusterDist;
      const clusterZ = Math.sin(clusterAngle) * clusterDist;
      const clusterY = Math.sin(cluster * 0.5) * 5; // Varied heights
      
      // Create a controller for this cluster
      const controller = createNode(NodeType.CONTROLLER, clusterX, clusterY, clusterZ, 0.8);
      controller.userData.isClusterController = true;
      
      nodes.push(controller);
      scene.add(controller);
      
      // Create sensors around this controller
      for (let i = 0; i < devicesPerCluster; i++) {
        const deviceAngle = (i / devicesPerCluster) * Math.PI * 2;
        const deviceDist = 3 + Math.random() * 2;
        const x = clusterX + Math.cos(deviceAngle) * deviceDist;
        const z = clusterZ + Math.sin(deviceAngle) * deviceDist;
        const y = clusterY + (Math.random() - 0.5) * 3;
        
        // Determine type - mostly sensors, some endpoints
        const type = Math.random() > 0.25 ? NodeType.SENSOR : NodeType.ENDPOINT;
        const deviceNode = createNode(type, x, y, z);
        
        nodes.push(deviceNode);
        scene.add(deviceNode);
      }
    }
  };

  // Create a node of specified type at position
  const createNode = (type: NodeType, x: number, y: number, z: number, scale = 1.0) => {
    const nodeProps = NODE_PROPERTIES[type];
    
    // Create geometry based on node type
    const geometry = nodeProps.geometry.clone();
    
    // Create material with glow effect for certain types
    let material: THREE.Material;
    
    if (type === NodeType.GATEWAY || type === NodeType.CONTROLLER) {
      // Use emissive material for gateways and controllers
      material = new THREE.MeshStandardMaterial({ 
        color: nodeProps.color,
        emissive: nodeProps.color,
        emissiveIntensity: 0.3,
        metalness: 0.8,
        roughness: 0.2
      });
    } else {
      // Use standard material for other types
      material = new THREE.MeshStandardMaterial({ 
        color: nodeProps.color,
        metalness: 0.5, 
        roughness: 0.6
      });
    }
    
    const node = new THREE.Mesh(geometry, material);
    
    // Scale based on node type and custom scale
    node.scale.set(
      nodeProps.size * scale,
      nodeProps.size * scale,
      nodeProps.size * scale
    );
    
    // Position
    node.position.set(x, y, z);
    
    // Store node metadata
    node.userData.type = type;
    node.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    );
    
    // Add subtle ambient animation
    node.userData.initialPosition = new THREE.Vector3(x, y, z);
    node.userData.pulseSpeed = 0.5 + Math.random() * 2;
    node.userData.pulseScale = 0.05 + Math.random() * 0.1;
    
    return node;
  };

  // Create links between nodes based on a realistic network topology
  const createNetworkLinks = () => {
    if (!sceneRef.current) return;

    const { scene, nodes, links } = sceneRef.current;

    // Get the gateway (first node)
    const gateway = nodes[0];
    
    // Create links based on node types and proximity
    nodes.forEach((node, i) => {
      if (i === 0) return; // Skip the gateway itself
      
      // Different link materials based on connection type
      let lineMaterial;
      
      if (node.userData.type === NodeType.CONTROLLER) {
        // Controller to gateway connections - thicker, brighter
        lineMaterial = new THREE.LineBasicMaterial({
          color: 0x4488ff,
          transparent: true,
          opacity: 0.8,
          linewidth: 2
        });
        
        // Connect controllers to gateway
        createLink(node, gateway, lineMaterial);
        
      } else if (node.userData.type === NodeType.SENSOR || node.userData.type === NodeType.ENDPOINT) {
        // Find closest controller to connect to
        let closestController = null;
        let minDistance = Infinity;
        
        nodes.forEach(possibleController => {
          if (possibleController.userData.isClusterController) {
            const distance = node.position.distanceTo(possibleController.position);
            if (distance < minDistance) {
              minDistance = distance;
              closestController = possibleController;
            }
          }
        });
        
        if (closestController && minDistance < 10) {
          // Sensor to controller connections - thinner
          lineMaterial = new THREE.LineBasicMaterial({
            color: node.userData.type === NodeType.SENSOR ? 0x88aaff : 0xff88aa,
            transparent: true,
            opacity: 0.4
          });
          
          createLink(node, closestController, lineMaterial);
        }
      }
    });
    
    // Add mesh connections between some sensors for redundancy
    const sensors = nodes.filter(node => node.userData.type === NodeType.SENSOR);
    sensors.forEach((sensor, i) => {
      // Connect some sensors to nearby sensors
      if (Math.random() > 0.7) {
        const nearestSensor = findNearestNode(sensor, sensors, 8);
        
        if (nearestSensor) {
          const meshLineMaterial = new THREE.LineBasicMaterial({
            color: 0x3388aa,
            transparent: true,
            opacity: 0.25,
            linewidth: 1
          });
          
          createLink(sensor, nearestSensor, meshLineMaterial);
        }
      }
    });
  };

  // Helper to find nearest node of certain types within max distance
  const findNearestNode = (node: THREE.Mesh, candidates: THREE.Mesh[], maxDistance: number) => {
    let nearest = null;
    let minDist = maxDistance;
    
    candidates.forEach(candidate => {
      if (candidate === node) return;
      
      const dist = node.position.distanceTo(candidate.position);
      if (dist < minDist) {
        minDist = dist;
        nearest = candidate;
      }
    });
    
    return nearest;
  };

  // Create a link between two nodes
  const createLink = (node1: THREE.Mesh, node2: THREE.Mesh, material: THREE.LineBasicMaterial) => {
    if (!sceneRef.current) return;
    
    const { scene, links } = sceneRef.current;
    
    // Create geometry for the link
    const geometry = new THREE.BufferGeometry();
    
    // Set positions
    const positions = new Float32Array([
      node1.position.x, node1.position.y, node1.position.z,
      node2.position.x, node2.position.y, node2.position.z
    ]);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create the link
    const link = new THREE.Line(geometry, material);
    
    // Store references to connected nodes
    link.userData.startNode = node1;
    link.userData.endNode = node2;
    link.userData.trafficIntensity = Math.random() * 0.5 + 0.5; // Random traffic intensity
    
    links.push(link);
    scene.add(link);
    
    return link;
  };

  // Animate node positions with natural motion
  const animateNodes = () => {
    if (!sceneRef.current) return;

    const { nodes, clock } = sceneRef.current;
    const time = clock.getElapsedTime();

    nodes.forEach(node => {
      // Skip the gateway - keep it stable
      if (node === nodes[0]) return;
      
      // Get initial position
      const initialPos = node.userData.initialPosition;
      
      // Add gentle floating motion based on node type
      if (node.userData.type === NodeType.SENSOR) {
        // Sensors have more movement
        node.position.y = initialPos.y + Math.sin(time * node.userData.pulseSpeed) * node.userData.pulseScale;
      } else if (node.userData.type === NodeType.CONTROLLER) {
        // Controllers have slight rotation
        node.rotation.y += 0.005;
        node.position.y = initialPos.y + Math.sin(time * 0.5) * 0.03;
      } else if (node.userData.type === NodeType.GATEWAY) {
        // Gateway rotates slowly
        node.rotation.y += 0.002;
      }
    });
  };

  // Update link positions to follow nodes
  const updateLinks = () => {
    if (!sceneRef.current) return;

    const { links } = sceneRef.current;

    links.forEach(link => {
      const startNode = link.userData.startNode;
      const endNode = link.userData.endNode;

      const positions = (link.geometry as THREE.BufferGeometry).attributes.position.array;

      positions[0] = startNode.position.x;
      positions[1] = startNode.position.y;
      positions[2] = startNode.position.z;

      positions[3] = endNode.position.x;
      positions[4] = endNode.position.y;
      positions[5] = endNode.position.z;

      (link.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
    });
  };

  // Send a data packet along a random link with advanced visualization
  const sendDataPacket = () => {
    if (!sceneRef.current) return;

    const { scene, links, packets, trails } = sceneRef.current;

    if (links.length === 0) return;

    // Select links based on traffic intensity (higher intensity = more packets)
    const linkIndex = selectLinkBasedOnTraffic();
    if (linkIndex === -1) return;
    
    const link = links[linkIndex];
    const startNode = link.userData.startNode;
    const endNode = link.userData.endNode;

    // Choose packet type based on node types
    const packetTypeIndex = selectPacketType(startNode, endNode);
    const packetType = PACKET_TYPES[packetTypeIndex];
    
    // Create a data packet with selected properties
    const packetGeometry = new THREE.SphereGeometry(packetType.size, 8, 8);
    const packetMaterial = new THREE.MeshBasicMaterial({ 
      color: packetType.color,
      transparent: true,
      opacity: 0.9
    });
    
    const packet = new THREE.Mesh(packetGeometry, packetMaterial);

    // Set initial position at the start node
    packet.position.copy(startNode.position);

    // Store metadata for animation
    packet.userData.startPosition = startNode.position.clone();
    packet.userData.targetPosition = endNode.position.clone();
    packet.userData.progress = 0;
    packet.userData.speed = packetType.speed;
    packet.userData.type = packetTypeIndex;
    packet.userData.trail = [];
    
    // Add to tracking arrays
    packets.push(packet);
    scene.add(packet);
    
    // Create a particle trail system for this packet
    createPacketTrail(packet, packetType.color);

    // Animate the packet
    animatePacket(packet);
  };
  
  // Select a link based on traffic intensity
  const selectLinkBasedOnTraffic = () => {
    if (!sceneRef.current) return -1;
    
    const { links } = sceneRef.current;
    
    // Calculate total traffic
    let totalTraffic = 0;
    links.forEach(link => {
      totalTraffic += link.userData.trafficIntensity;
    });
    
    // Random value based on total traffic
    let randomValue = Math.random() * totalTraffic;
    
    // Select link
    let accumulatedTraffic = 0;
    for (let i = 0; i < links.length; i++) {
      accumulatedTraffic += links[i].userData.trafficIntensity;
      if (randomValue <= accumulatedTraffic) {
        return i;
      }
    }
    
    return Math.floor(Math.random() * links.length);
  };
  
  // Select packet type based on node types
  const selectPacketType = (startNode: THREE.Mesh, endNode: THREE.Mesh) => {
    // Control messages between controllers/gateways
    if (
      (startNode.userData.type === NodeType.CONTROLLER || startNode.userData.type === NodeType.GATEWAY) &&
      (endNode.userData.type === NodeType.CONTROLLER || endNode.userData.type === NodeType.GATEWAY)
    ) {
      return 1; // Control messages
    }
    
    // Configuration data to/from endpoints
    if (startNode.userData.type === NodeType.ENDPOINT || endNode.userData.type === NodeType.ENDPOINT) {
      return 2; // Configuration data
    }
    
    // Standard data for everything else
    return 0;
  };
  
  // Create a particle trail for a packet
  const createPacketTrail = (packet: THREE.Mesh, color: number) => {
    if (!sceneRef.current) return;
    
    const { scene, trails } = sceneRef.current;
    
    // Create trail geometry
    const trailGeometry = new THREE.BufferGeometry();
    const trailParticleCount = 20;
    
    // Positions will be updated during animation
    const trailPositions = new Float32Array(trailParticleCount * 3);
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    
    // Create trail material
    const trailMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    // Create the trail
    const trail = new THREE.Points(trailGeometry, trailMaterial);
    trail.userData.positions = trailPositions;
    trail.userData.packet = packet;
    trail.userData.maxLength = trailParticleCount;
    trail.userData.currentLength = 0;
    
    trails.push(trail);
    scene.add(trail);
    
    // Store reference to the trail in the packet
    packet.userData.trail = trail;
  };
  
  // Update the particle trail for a packet
  const updateTrail = (packet: THREE.Mesh) => {
    if (!packet.userData.trail) return;
    
    const trail = packet.userData.trail;
    const positions = trail.userData.positions;
    
    // Shift trail positions to make room for new position
    for (let i = trail.userData.maxLength - 1; i > 0; i--) {
      positions[i * 3] = positions[(i - 1) * 3];
      positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
      positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
    }
    
    // Add current packet position as the head of the trail
    positions[0] = packet.position.x;
    positions[1] = packet.position.y;
    positions[2] = packet.position.z;
    
    // Increase trail length until maximum
    if (trail.userData.currentLength < trail.userData.maxLength) {
      trail.userData.currentLength++;
    }
    
    // Update the geometry
    (trail.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
  };

  // Animate a single packet
  const animatePacket = (packet: THREE.Mesh) => {
    packet.userData.progress += packet.userData.speed;

    // Calculate new position with slight curve for better visual
    const progress = packet.userData.progress;
    const start = packet.userData.startPosition;
    const end = packet.userData.targetPosition;
    
    // Add a slight arc to the path
    const arcHeight = 0.5;
    const midPoint = new THREE.Vector3().lerpVectors(start, end, 0.5);
    midPoint.y += arcHeight;
    
    if (progress <= 0.5) {
      // First half - lerp from start to midpoint
      packet.position.lerpVectors(
        start,
        midPoint,
        progress * 2 // Scale to [0, 1] for first half
      );
    } else {
      // Second half - lerp from midpoint to end
      packet.position.lerpVectors(
        midPoint,
        end,
        (progress - 0.5) * 2 // Scale to [0, 1] for second half
      );
    }
    
    // Update the trail
    updateTrail(packet);
    
    // Add a gentle pulse to the packet
    const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
    packet.scale.set(scale, scale, scale);

    if (progress >= 1) {
      // When packet reaches destination
      createPacketArrivalEffect(packet);
      
      if (sceneRef.current) {
        // Remove packet and its trail from scene and tracking arrays
        const { scene, packets, trails } = sceneRef.current;
        
        // Remove packet
        scene.remove(packet);
        const packetIndex = packets.indexOf(packet);
        if (packetIndex !== -1) {
          packets.splice(packetIndex, 1);
        }
        
        // Remove trail
        const trail = packet.userData.trail;
        if (trail) {
          scene.remove(trail);
          const trailIndex = trails.indexOf(trail);
          if (trailIndex !== -1) {
            trails.splice(trailIndex, 1);
          }
        }
      }
      
      return;
    }

    requestAnimationFrame(() => animatePacket(packet));
  };
  
  // Create an effect when a packet reaches its destination
  const createPacketArrivalEffect = (packet: THREE.Mesh) => {
    if (!sceneRef.current) return;
    
    const { scene } = sceneRef.current;
    
    // Create an expanding ring effect
    const ringGeometry = new THREE.RingGeometry(0.1, 0.2, 16);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: (PACKET_TYPES[packet.userData.type]).color, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(packet.position);
    scene.add(ring);
    
    // Animate the ring expansion
    const animateRing = () => {
      ring.scale.multiplyScalar(1.05);
      ring.material.opacity -= 0.02;
      
      if (ring.material.opacity <= 0) {
        scene.remove(ring);
        return;
      }
      
      requestAnimationFrame(animateRing);
    };
    
    animateRing();
  };

  // Main animation loop
  const animate = () => {
    if (!sceneRef.current) return;

    const { scene, camera, renderer, composer } = sceneRef.current;

    sceneRef.current.animationFrameId = requestAnimationFrame(animate);

    // Rotate the entire scene slightly for a better view
    scene.rotation.y += 0.002;

    animateNodes();
    updateLinks();

    // Add occasional "data packet" traveling along the links
    if (Math.random() < 0.05 && sceneRef.current.links.length > 0) {
      sendDataPacket();
    }

    composer.render();
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...sx,
      }}
    />
  );
};

export default DataPacketVisualization;
