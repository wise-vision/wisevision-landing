import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Box, Text } from 'theme-ui';

interface NetworkVisualizationProps {
  sx?: any;
}

// Node types for the network
enum NodeType {
  SENSOR = 'sensor',
  CONTROLLER = 'controller',
  GATEWAY = 'gateway',
  DATA_CENTER = 'data_center',
  INDUSTRIAL_SYSTEM = 'industrial_system',
  SMART_BUILDING = 'smart_building'
}

// Color palette for the visualization
const COLORS = {
  BLUE_DEEP: 0x0a1a40,
  BLUE_MID: 0x0f3460,
  BLUE_LIGHT: 0x4bcdf0,
  TEAL: 0x3ae3ae,
  PURPLE: 0x533fe3,
  PINK: 0xea3b92,
  ORANGE: 0xff6600,
  GREEN: 0x2ecc71,
  WHITE: 0xffffff,
}

// Node properties by type
const NODE_PROPERTIES = {
  [NodeType.SENSOR]: {
    color: COLORS.TEAL,
    size: 0.8,
    shape: 'sphere',
    name: 'IoT Sensor',
    description: 'Collects environmental data like temperature, humidity, etc.'
  },
  [NodeType.CONTROLLER]: {
    color: COLORS.BLUE_LIGHT,
    size: 1.2,
    shape: 'box',
    name: 'Edge Controller',
    description: 'Processes data from multiple sensors and controls local systems'
  },
  [NodeType.GATEWAY]: {
    color: COLORS.PURPLE,
    size: 1.5,
    shape: 'octahedron',
    name: 'Network Gateway',
    description: 'Routes data between local nodes and the central data center'
  },
  [NodeType.DATA_CENTER]: {
    color: COLORS.ORANGE,
    size: 2.5,
    shape: 'cylinder',
    name: 'Data Center',
    description: 'Central processing hub for all network data and analytics'
  },
  [NodeType.INDUSTRIAL_SYSTEM]: {
    color: COLORS.GREEN,
    size: 1.8,
    shape: 'cone',
    name: 'Industrial System',
    description: 'Manufacturing equipment with IoT connectivity'
  },
  [NodeType.SMART_BUILDING]: {
    color: COLORS.PINK,
    size: 2.0,
    shape: 'building',
    name: 'Smart Building',
    description: 'Connected building with automated systems and monitoring'
  }
};

// Interface for network nodes
interface NetworkNode {
  object: THREE.Object3D;
  type: NodeType;
  connections: NetworkNode[];
  position: THREE.Vector3;
  id: string;
  dataFlows: DataFlow[];
  active: boolean;
  processingRate: number;
  lastUpdate: number;
  meshes: THREE.Mesh[];
}

// Interface for data flows between nodes
interface DataFlow {
  from: NetworkNode;
  to: NetworkNode;
  particles: THREE.Points;
  geometry: THREE.BufferGeometry;
  speed: number;
  color: number;
  size: number;
  progress: number[];
  active: boolean;
  type: string;
  packetSize: number;
}

// Interface for scene manager
interface SceneManager {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  nodes: NetworkNode[];
  dataFlows: DataFlow[];
  clock: THREE.Clock;
  grid: THREE.GridHelper;
  animationFrameId?: number;
  hoverObject: THREE.Object3D | null;
  selectedObject: THREE.Object3D | null;
  orbitRadius: number;
  orbitSpeed: number;
  cityObjects: THREE.Object3D[];
}

// Information about the currently selected node
interface SelectedNodeInfo {
  name: string;
  type: string;
  description: string;
  connections: number;
  dataRate: string;
  position: string;
}

const InteractiveNetworkVisualization: React.FC<NetworkVisualizationProps> = ({ sx = {} }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneManager | undefined>(undefined);
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(null);
  const [hoveredNode, setHoveredNode] = useState<{name: string, type: string} | null>(null);
  
  // Initialize the scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the scene
    const container = containerRef.current;
    const scene = new THREE.Scene();
    
    // Create a camera with a wider field of view
    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 40, 70);
    camera.lookAt(0, 0, 0);
    
    // Set up the renderer with transparency and antialiasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0.1);
    container.appendChild(renderer.domElement);

    // Create a raycaster for mouse interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Add a grid to represent a city/industrial layout
    const gridSize = 100;
    const gridDivisions = 20;
    const grid = new THREE.GridHelper(gridSize, gridDivisions, 0x2c3e50, 0x34495e);
    grid.position.y = -2;
    scene.add(grid);
    
    // Add atmospheric fog
    scene.fog = new THREE.FogExp2(0x0c2d4d, 0.002);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);
    
    // Add directional light for shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add point lights for colored highlights
    const pointLight1 = new THREE.PointLight(COLORS.TEAL, 1, 50);
    pointLight1.position.set(-20, 20, 20);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(COLORS.PURPLE, 0.7, 50);
    pointLight2.position.set(20, 15, -20);
    scene.add(pointLight2);

    // Set up post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // Add subtle bloom for a sci-fi effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.6,
      0.1,
      0.85
    );
    composer.addPass(bloomPass);
    
    // Create scene manager
    const clock = new THREE.Clock();
    sceneRef.current = {
      scene,
      camera,
      renderer,
      composer,
      raycaster,
      mouse,
      nodes: [],
      dataFlows: [],
      clock,
      grid,
      hoverObject: null,
      selectedObject: null,
      orbitRadius: 70,
      orbitSpeed: 0.05,
      cityObjects: []
    };
    
    // Create the smart city network
    createSmartCityNetwork();
    
    // Generate background city elements
    createCityBackground();
    
    // Start animation loop
    const animate = () => {
      const id = requestAnimationFrame(animate);
      if (sceneRef.current) {
        sceneRef.current.animationFrameId = id;
        const time = clock.getElapsedTime();
        
        // Animate network data flows
        animateDataFlows(time);
        
        // Animate node activities
        animateNodes(time);
        
        // Orbital camera movement (can be disabled when interacting)
        animateCamera(time);
        
        // Render the scene
        composer.render();
      }
    };
    animate();

    // Event listeners for mouse interaction
    const onMouseMove = (event: MouseEvent) => {
      if (!sceneRef.current) return;
      
      // Calculate mouse position in normalized device coordinates
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      const y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
      
      sceneRef.current.mouse.set(x, y);
      handleRaycasting();
    };

    const onMouseClick = (event: MouseEvent) => {
      if (!sceneRef.current?.hoverObject) return;
      
      // Find the associated node for the clicked object
      const node = findNodeByObject(sceneRef.current.hoverObject);
      if (node) {
        sceneRef.current.selectedObject = sceneRef.current.hoverObject;
        
        // Generate data for the info panel
        const info: SelectedNodeInfo = {
          name: NODE_PROPERTIES[node.type].name,
          type: node.type,
          description: NODE_PROPERTIES[node.type].description,
          connections: node.connections.length,
          dataRate: `${(node.processingRate * 10).toFixed(1)} MB/s`,
          position: `X: ${node.position.x.toFixed(1)}, Y: ${node.position.y.toFixed(1)}, Z: ${node.position.z.toFixed(1)}`
        };
        
        setSelectedNode(info);
        
        // Highlight the selected node
        highlightNode(node, true);
        
        // Simulate data flow from this node
        triggerDataFlows(node);
      }
    };

    // Find node by object reference
    const findNodeByObject = (object: THREE.Object3D): NetworkNode | undefined => {
      return sceneRef.current?.nodes.find(node => 
        node.meshes.some(mesh => {
          // Check if mesh is the object or a parent of the object
          let current: THREE.Object3D | null = object;
          while (current) {
            if (current === mesh) return true;
            current = current.parent;
          }
          return false;
        })
      );
    };

    // Highlight a node when selected
    const highlightNode = (node: NetworkNode, isSelected: boolean) => {
      node.meshes.forEach(mesh => {
        // Only apply emissiveIntensity to MeshStandardMaterial
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.emissiveIntensity = isSelected ? 2 : 0.5;
        }
        
        // Scale can be applied to any mesh
        if (isSelected) {
          mesh.scale.multiplyScalar(1.2);
        } else {
          mesh.scale.multiplyScalar(1/1.2);
        }
      });
      
      // Also highlight connected nodes
      if (isSelected) {
        node.connections.forEach(connNode => {
          connNode.meshes.forEach(mesh => {
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
              mesh.material.emissiveIntensity = 1.2;
            }
          });
        });
      }
    };

    // Trigger data flows from a node
    const triggerDataFlows = (node: NetworkNode) => {
      node.dataFlows.forEach(flow => {
        flow.active = true;
        
        // Activate for 10 seconds then deactivate
        setTimeout(() => {
          flow.active = false;
        }, 10000);
      });
    };

    // Handle raycasting for interaction
    const handleRaycasting = () => {
      if (!sceneRef.current) return;
      
      const { raycaster, camera, mouse, nodes } = sceneRef.current;
      
      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);
      
      // Get all meshes from all nodes
      const allMeshes: THREE.Mesh[] = [];
      nodes.forEach(node => {
        allMeshes.push(...node.meshes);
      });
      
      // Check for intersections
      const intersects = raycaster.intersectObjects(allMeshes, true);
      
      // Handle hover effects
      if (intersects.length > 0) {
        const firstIntersect = intersects[0].object;
        
        if (sceneRef.current.hoverObject !== firstIntersect) {
          // Remove previous hover effect
          if (sceneRef.current.hoverObject) {
            const prevNode = findNodeByObject(sceneRef.current.hoverObject);
            if (prevNode && sceneRef.current.selectedObject !== sceneRef.current.hoverObject) {
              prevNode.meshes.forEach(mesh => {
                if (mesh.material instanceof THREE.MeshStandardMaterial) {
                  mesh.material.emissiveIntensity = 0.5;
                }
              });
            }
          }
          
          // Add new hover effect
          sceneRef.current.hoverObject = firstIntersect;
          const newNode = findNodeByObject(firstIntersect);
          
          if (newNode) {
            newNode.meshes.forEach(mesh => {
              if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.emissiveIntensity = 1.5;
              }
            });
            
            // Update hover info
            setHoveredNode({
              name: NODE_PROPERTIES[newNode.type].name,
              type: newNode.type
            });
          }
        }
        
        // Change cursor style
        container.style.cursor = 'pointer';
      } else {
        // Remove hover effect when not hovering
        if (sceneRef.current.hoverObject) {
          const prevNode = findNodeByObject(sceneRef.current.hoverObject);
          if (prevNode && sceneRef.current.selectedObject !== sceneRef.current.hoverObject) {
            prevNode.meshes.forEach(mesh => {
              if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.emissiveIntensity = 0.5;
              }
            });
          }
          
          sceneRef.current.hoverObject = null;
          setHoveredNode(null);
        }
        
        // Reset cursor
        container.style.cursor = 'default';
      }
    };

    // Add event listeners
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onMouseClick);
    window.addEventListener('resize', handleResize);
    
    // Handle resize
    function handleResize() {
      if (!containerRef.current || !sceneRef.current) return;
      
      const { camera, renderer, composer } = sceneRef.current;
      const container = containerRef.current;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(container.clientWidth, container.clientHeight);
      composer.setSize(container.clientWidth, container.clientHeight);
    }

    // Clean up on unmount
    return () => {
      if (sceneRef.current?.animationFrameId) {
        cancelAnimationFrame(sceneRef.current.animationFrameId);
      }
      
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', handleResize);
      
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Create smart city network structure
  const createSmartCityNetwork = () => {
    if (!sceneRef.current) return;
    
    const { scene, nodes } = sceneRef.current;
    
    // Create a central data center
    const dataCenter = createNetworkNode(
      NodeType.DATA_CENTER,
      new THREE.Vector3(0, 5, 0)
    );
    
    // Create 3-4 gateway nodes around the data center
    const gatewayCount = 4;
    const gatewayNodes: NetworkNode[] = [];
    
    for (let i = 0; i < gatewayCount; i++) {
      const angle = (i / gatewayCount) * Math.PI * 2;
      const x = Math.cos(angle) * 25;
      const z = Math.sin(angle) * 25;
      
      const gateway = createNetworkNode(
        NodeType.GATEWAY,
        new THREE.Vector3(x, 3, z)
      );
      
      // Connect to data center
      connectNodes(gateway, dataCenter);
      gatewayNodes.push(gateway);
    }
    
    // Create controller nodes connected to gateways
    const controllersPerGateway = 3;
    const controllerNodes: NetworkNode[] = [];
    
    gatewayNodes.forEach((gateway, gatewayIndex) => {
      for (let i = 0; i < controllersPerGateway; i++) {
        const baseAngle = (gatewayIndex / gatewayCount) * Math.PI * 2;
        const angleOffset = ((i - 1) / controllersPerGateway) * Math.PI * 0.4;
        const angle = baseAngle + angleOffset;
        
        const distance = 20 + Math.random() * 10;
        const x = Math.cos(angle) * (distance + 15);
        const z = Math.sin(angle) * (distance + 15);
        
        const controller = createNetworkNode(
          NodeType.CONTROLLER,
          new THREE.Vector3(x, 2, z)
        );
        
        // Connect to gateway
        connectNodes(controller, gateway);
        controllerNodes.push(controller);
      }
    });
    
    // Create sensors and industrial systems connected to controllers
    controllerNodes.forEach(controller => {
      const devicesPerController = 4 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < devicesPerController; i++) {
        const angle = (i / devicesPerController) * Math.PI * 2 + Math.random() * 0.3;
        const distance = 5 + Math.random() * 5;
        
        const basePosition = controller.position;
        const x = basePosition.x + Math.cos(angle) * distance;
        const z = basePosition.z + Math.sin(angle) * distance;
        
        // Mix of sensors, industrial systems, and smart buildings
        let nodeType: NodeType;
        if (i % 4 === 0) {
          nodeType = NodeType.SMART_BUILDING;
        } else if (i % 3 === 0) {
          nodeType = NodeType.INDUSTRIAL_SYSTEM;
        } else {
          nodeType = NodeType.SENSOR;
        }
        
        const sensor = createNetworkNode(
          nodeType,
          new THREE.Vector3(x, nodeType === NodeType.SENSOR ? 0.5 : 1.5, z)
        );
        
        // Connect to controller
        connectNodes(sensor, controller);
      }
    });
    
    // Add cross-connections for network redundancy
    addRedundantConnections();
  };
  
  // Add redundant connections
  const addRedundantConnections = () => {
    if (!sceneRef.current) return;
    
    const { nodes } = sceneRef.current;
    
    const gateways = nodes.filter(node => node.type === NodeType.GATEWAY);
    const controllers = nodes.filter(node => node.type === NodeType.CONTROLLER);
    
    // Connect neighboring gateways
    for (let i = 0; i < gateways.length; i++) {
      const nextIndex = (i + 1) % gateways.length;
      connectNodes(gateways[i], gateways[nextIndex]);
    }
    
    // Connect some controllers to create mesh networks
    controllers.forEach((controller, i) => {
      if (Math.random() < 0.4 && i < controllers.length - 1) {
        // Connect to next controller with 40% probability
        connectNodes(controller, controllers[(i + 1) % controllers.length]);
      }
    });
  };
  
  // Create a network node of specified type
  const createNetworkNode = (type: NodeType, position: THREE.Vector3): NetworkNode => {
    if (!sceneRef.current) throw new Error("Scene not initialized");
    
    const { scene, nodes } = sceneRef.current;
    const props = NODE_PROPERTIES[type];
    
    // Create group to hold all the meshes
    const group = new THREE.Group();
    group.position.copy(position);
    scene.add(group);
    
    // Meshes array for the node
    const meshes: THREE.Mesh[] = [];
    
    // Create base mesh based on shape
    let mesh: THREE.Mesh;
    
    switch (props.shape) {
      case 'sphere':
        mesh = new THREE.Mesh(
          new THREE.SphereGeometry(props.size, 16, 16),
          createNodeMaterial(type)
        );
        meshes.push(mesh);
        group.add(mesh);
        break;
        
      case 'box':
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(props.size * 1.5, props.size, props.size * 1.5),
          createNodeMaterial(type)
        );
        meshes.push(mesh);
        group.add(mesh);
        break;
        
      case 'octahedron':
        mesh = new THREE.Mesh(
          new THREE.OctahedronGeometry(props.size),
          createNodeMaterial(type)
        );
        meshes.push(mesh);
        group.add(mesh);
        break;
        
      case 'cylinder':
        // Create a more complex data center
        const baseSize = props.size * 1.5;
        
        // Main center tower
        const tower = new THREE.Mesh(
          new THREE.CylinderGeometry(baseSize * 0.3, baseSize * 0.4, baseSize * 2, 8),
          createNodeMaterial(type)
        );
        tower.position.y = baseSize * 0.8;
        meshes.push(tower);
        group.add(tower);
        
        // Surrounding smaller towers
        const smallTowerCount = 4;
        for (let i = 0; i < smallTowerCount; i++) {
          const angle = (i / smallTowerCount) * Math.PI * 2;
          const dist = baseSize * 0.8;
          const x = Math.cos(angle) * dist;
          const z = Math.sin(angle) * dist;
          
          const smallTower = new THREE.Mesh(
            new THREE.CylinderGeometry(baseSize * 0.15, baseSize * 0.2, baseSize, 6),
            createNodeMaterial(type, 0.9)
          );
          
          smallTower.position.set(x, baseSize * 0.4, z);
          meshes.push(smallTower);
          group.add(smallTower);
        }
        
        // Base platform
        const platform = new THREE.Mesh(
          new THREE.CylinderGeometry(baseSize * 1.2, baseSize * 1.2, baseSize * 0.2, 12),
          createNodeMaterial(type, 0.7)
        );
        platform.position.y = -baseSize * 0.1;
        meshes.push(platform);
        group.add(platform);
        break;
        
      case 'cone':
        // Industrial system
        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(props.size * 0.8, props.size, props.size, 8),
          createNodeMaterial(type, 0.8)
        );
        base.position.y = props.size * 0.4;
        meshes.push(base);
        group.add(base);
        
        // Chimney
        const chimney = new THREE.Mesh(
          new THREE.CylinderGeometry(props.size * 0.2, props.size * 0.2, props.size * 2, 8),
          createNodeMaterial(type, 0.9)
        );
        chimney.position.set(props.size * 0.4, props.size * 1.3, 0);
        meshes.push(chimney);
        group.add(chimney);
        break;
        
      case 'building':
        // Smart building
        const buildingHeight = props.size * 2;
        const buildingWidth = props.size * 1.2;
        const building = new THREE.Mesh(
          new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingWidth),
          createNodeMaterial(type, 0.8)
        );
        building.position.y = buildingHeight * 0.5;
        meshes.push(building);
        group.add(building);
        
        // Windows effect using a separate mesh with window pattern texture
        const windowsMaterial = new THREE.MeshBasicMaterial({
          color: COLORS.WHITE,
          transparent: true,
          opacity: 0.5
        });
        
        // Front windows
        const frontWindows = new THREE.Mesh(
          new THREE.PlaneGeometry(buildingWidth * 0.9, buildingHeight * 0.9),
          windowsMaterial
        );
        frontWindows.position.z = buildingWidth * 0.51;
        frontWindows.position.y = buildingHeight * 0.5;
        meshes.push(frontWindows);
        group.add(frontWindows);
        
        // Side windows
        const sideWindows = new THREE.Mesh(
          new THREE.PlaneGeometry(buildingWidth * 0.9, buildingHeight * 0.9),
          windowsMaterial
        );
        sideWindows.rotation.y = Math.PI * 0.5;
        sideWindows.position.x = buildingWidth * 0.51;
        sideWindows.position.y = buildingHeight * 0.5;
        meshes.push(sideWindows);
        group.add(sideWindows);
        break;
        
      default:
        // Default to sphere
        mesh = new THREE.Mesh(
          new THREE.SphereGeometry(props.size, 16, 16),
          createNodeMaterial(type)
        );
        meshes.push(mesh);
        group.add(mesh);
    }
    
    // Add glowing ring for all nodes
    const ringGeometry = new THREE.TorusGeometry(props.size * 1.2, props.size * 0.1, 16, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: props.color,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI * 0.5;
    ring.position.y = -props.size * 0.5 + 0.1;
    meshes.push(ring);
    group.add(ring);
    
    // Create node object
    const node: NetworkNode = {
      object: group,
      type,
      connections: [],
      position: position.clone(),
      id: `node-${type}-${nodes.length}`,
      dataFlows: [],
      active: false,
      processingRate: 0.5 + Math.random() * 1.5,
      lastUpdate: 0,
      meshes
    };
    
    // Add to nodes array
    nodes.push(node);
    
    return node;
  };
  
  // Create material for node based on type
  const createNodeMaterial = (type: NodeType, opacity: number = 1.0): THREE.Material => {
    const props = NODE_PROPERTIES[type];
    
    return new THREE.MeshStandardMaterial({
      color: props.color,
      emissive: props.color,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.3,
      transparent: opacity < 1.0,
      opacity: opacity
    });
  };
  
  // Connect two nodes with a network link
  const connectNodes = (node1: NetworkNode, node2: NetworkNode) => {
    if (!sceneRef.current) return;
    
    const { scene } = sceneRef.current;
    
    // Create connection line material
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4bcdf0,
      transparent: true,
      opacity: 0.4
    });
    
    // Create points for the line
    const points = [
      node1.position.clone(),
      node2.position.clone()
    ];
    
    // Create geometry for connection line
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMaterial);
    scene.add(line);
    
    // Create data flow between nodes
    createDataFlow(node1, node2);
    
    // Store connection in both nodes
    if (!node1.connections.includes(node2)) {
      node1.connections.push(node2);
    }
    if (!node2.connections.includes(node1)) {
      node2.connections.push(node1);
    }
  };
  
  // Create a data flow between two nodes
  const createDataFlow = (from: NetworkNode, to: NetworkNode) => {
    if (!sceneRef.current) return;
    
    const { scene, dataFlows } = sceneRef.current;
    
    // Define flow type based on node types
    let flowType: string;
    let flowColor: number;
    
    if (from.type === NodeType.SENSOR || to.type === NodeType.SENSOR) {
      flowType = 'sensorData';
      flowColor = COLORS.TEAL;
    } else if (from.type === NodeType.DATA_CENTER || to.type === NodeType.DATA_CENTER) {
      flowType = 'analytics';
      flowColor = COLORS.ORANGE;
    } else if (from.type === NodeType.INDUSTRIAL_SYSTEM || to.type === NodeType.INDUSTRIAL_SYSTEM) {
      flowType = 'commands';
      flowColor = COLORS.GREEN;
    } else {
      flowType = 'network';
      flowColor = COLORS.BLUE_LIGHT;
    }
    
    // Create curve for particle path
    const start = from.position.clone();
    const end = to.position.clone();
    
    // Find midpoint and add slight arc
    const midPoint = new THREE.Vector3().lerpVectors(start, end, 0.5);
    midPoint.y += 2; // Arc height
    
    // Create curve for the path
    const curve = new THREE.CatmullRomCurve3([
      start,
      midPoint,
      end
    ]);
    
    // Create particles for data packets
    const particleCount = 20;
    const geometry = new THREE.BufferGeometry();
    
    // Create particle positions
    const positions = new Float32Array(particleCount * 3);
    
    // Initialize with default positions along the curve
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const pos = curve.getPoint(t);
      
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create progress array for each particle
    const progress = Array(particleCount).fill(0).map((_, i) => i / particleCount);
    
    // Create material for data packets
    const material = new THREE.PointsMaterial({
      color: flowColor,
      size: 0.4,
      transparent: true,
      opacity: 0.0, // Start invisible until activated
      blending: THREE.AdditiveBlending
    });
    
    // Create particle system
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Create data flow object
    const dataFlow: DataFlow = {
      from,
      to,
      particles,
      geometry,
      speed: 0.02 + Math.random() * 0.03,
      color: flowColor,
      size: 0.4,
      progress,
      active: false,
      type: flowType,
      packetSize: 0.2 + Math.random() * 0.4
    };
    
    // Add to data flows array
    dataFlows.push(dataFlow);
    
    // Add to source node's outgoing flows
    from.dataFlows.push(dataFlow);
    
    return dataFlow;
  };
  
  // Create background city elements for visual context
  const createCityBackground = () => {
    if (!sceneRef.current) return;
    
    const { scene, cityObjects } = sceneRef.current;
    
    // Create buildings and infrastructure in the background
    const buildingCount = 30;
    const cityRadius = 80;
    
    // Building material (slightly darker/transparent for background)
    const buildingMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a4a5c,
      metalness: 0.3,
      roughness: 0.8,
      transparent: true,
      opacity: 0.6
    });
    
    // Create scattered buildings
    for (let i = 0; i < buildingCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * cityRadius;
      
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      
      // Randomize building size
      const width = 3 + Math.random() * 5;
      const height = 5 + Math.random() * 20;
      const depth = 3 + Math.random() * 5;
      
      // Create building
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        buildingMaterial
      );
      
      // Position building
      building.position.set(x, height / 2 - 2, z);
      
      // Add to scene
      scene.add(building);
      cityObjects.push(building);
    }
    
    // Create roads as thin lines on the ground
    const roadMaterial = new THREE.LineBasicMaterial({
      color: 0x555555,
      linewidth: 1
    });
    
    // Create circular roads
    const roadRadii = [30, 50, 70];
    
    roadRadii.forEach(radius => {
      const roadPoints = [];
      
      // Create circular path
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        roadPoints.push(new THREE.Vector3(x, -1.9, z));
      }
      
      // Create road geometry
      const roadGeometry = new THREE.BufferGeometry().setFromPoints(roadPoints);
      const road = new THREE.Line(roadGeometry, roadMaterial);
      scene.add(road);
      cityObjects.push(road);
    });
    
    // Create radial roads
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      
      const roadPoints = [];
      roadPoints.push(new THREE.Vector3(0, -1.9, 0));
      roadPoints.push(new THREE.Vector3(
        Math.cos(angle) * 90,
        -1.9,
        Math.sin(angle) * 90
      ));
      
      const roadGeometry = new THREE.BufferGeometry().setFromPoints(roadPoints);
      const road = new THREE.Line(roadGeometry, roadMaterial);
      scene.add(road);
      cityObjects.push(road);
    }
  };
  
  // Animate data flows between nodes
  const animateDataFlows = (time: number) => {
    if (!sceneRef.current) return;
    
    const { dataFlows } = sceneRef.current;
    
    dataFlows.forEach(flow => {
      // Explicitly cast material to PointsMaterial to access opacity
      const material = flow.particles.material as THREE.PointsMaterial;
      
      if (!flow.active) {
        // Fade out inactive flows
        if (material.opacity > 0) {
          material.opacity -= 0.02;
        }
        return;
      }
      
      // Fade in active flows
      if (material.opacity < 1) {
        material.opacity += 0.05;
      }
      
      // Animate particles along curve
      const positions = (flow.geometry.getAttribute('position') as THREE.BufferAttribute).array;
      
      for (let i = 0; i < flow.progress.length; i++) {
        // Update progress
        flow.progress[i] += flow.speed;
        if (flow.progress[i] > 1) flow.progress[i] = 0;
        
        // Get new position along curve
        const pos = new THREE.Vector3();
        const from = flow.from.position;
        const to = flow.to.position;
        
        // Create midpoint with arc
        const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
        mid.y += 2; // Arc height
        
        // Simple quadratic Bezier curve calculation
        const t = flow.progress[i];
        const mt1 = 1 - t;
        
        // B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
        pos.x = mt1 * mt1 * from.x + 2 * mt1 * t * mid.x + t * t * to.x;
        pos.y = mt1 * mt1 * from.y + 2 * mt1 * t * mid.y + t * t * to.y;
        pos.z = mt1 * mt1 * from.z + 2 * mt1 * t * mid.z + t * t * to.z;
        
        // Update position
        positions[i * 3] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;
      }
      
      // Update geometry
      flow.geometry.getAttribute('position').needsUpdate = true;
    });
  };
  
  // Animate nodes with subtle movements and activity indicators
  const animateNodes = (time: number) => {
    if (!sceneRef.current) return;
    
    const { nodes } = sceneRef.current;
    
    nodes.forEach(node => {
      // Apply subtle hover effect to nodes
      const hoverAmount = Math.sin(time + node.id.charCodeAt(0)) * 0.2;
      
      if (node.type !== NodeType.SENSOR) {
        // Non-sensor nodes hover slightly
        node.object.position.y = node.position.y + hoverAmount;
      }
      
      // Make gateway nodes rotate slowly
      if (node.type === NodeType.GATEWAY) {
        node.object.rotation.y += 0.01;
      }
      
      // Simulate processing activity by pulsing
      const timeSinceLastUpdate = time - node.lastUpdate;
      if (timeSinceLastUpdate > 1 / node.processingRate) {
        // Update activity
        node.lastUpdate = time;
        
        // Pulse effect on active nodes
        if (node.active) {
          const pulseMesh = node.meshes[0];
          if (pulseMesh.material instanceof THREE.MeshStandardMaterial) {
            pulseMesh.material.emissiveIntensity = 1.5;
            
            // Reset back to normal after short time
            setTimeout(() => {
              if (pulseMesh.material instanceof THREE.MeshStandardMaterial) {
                pulseMesh.material.emissiveIntensity = 0.5;
              }
            }, 200);
          }
        }
      }
    });
  };
  
  // Animate camera movements
  const animateCamera = (time: number) => {
    if (!sceneRef.current || selectedNode) return; // Don't move camera when node selected
    
    const { camera, orbitRadius, orbitSpeed } = sceneRef.current;
    
    // Orbital movement
    const angle = time * orbitSpeed;
    
    // Calculate position on orbital path
    const x = Math.sin(angle) * orbitRadius;
    const z = Math.cos(angle) * orbitRadius;
    
    // Update camera position with smooth transition
    camera.position.x += (x - camera.position.x) * 0.02;
    camera.position.z += (z - camera.position.z) * 0.02;
    
    // Always look at center
    camera.lookAt(0, 10, 0);
  };
  
  // Render the visualization with interactive elements
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {/* Main visualization container */}
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
          zIndex: 0
        }}
      />
      
      {/* Hover information display */}
      {hoveredNode && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            backgroundColor: 'rgba(10, 26, 64, 0.8)',
            padding: '10px',
            borderRadius: '5px',
            color: 'white',
            zIndex: 10
          }}
        >
          <Text sx={{ fontWeight: 'bold', fontSize: '16px' }}>{hoveredNode.name}</Text>
          <Text sx={{ fontSize: '14px' }}>Type: {hoveredNode.type}</Text>
        </Box>
      )}
      
      {/* Selected node detailed information */}
      {selectedNode && (
        <Box
          sx={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '280px',
            backgroundColor: 'rgba(10, 26, 64, 0.8)',
            padding: '15px',
            borderRadius: '5px',
            color: 'white',
            zIndex: 10
          }}
        >
          <Text sx={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '5px' }}>
            {selectedNode.name}
          </Text>
          <Text sx={{ fontSize: '14px', marginBottom: '10px' }}>
            {selectedNode.description}
          </Text>
          <Box sx={{ fontSize: '14px' }}>
            <Text>Connections: {selectedNode.connections}</Text>
            <Text>Data Rate: {selectedNode.dataRate}</Text>
            <Text>Position: {selectedNode.position}</Text>
          </Box>
          <Box
            sx={{
              marginTop: '10px',
              cursor: 'pointer',
              textAlign: 'right',
              fontSize: '14px'
            }}
            onClick={() => {
              setSelectedNode(null);
              if (sceneRef.current) {
                sceneRef.current.selectedObject = null;
              }
            }}
          >
            Close
          </Box>
        </Box>
      )}
      
      {/* Instructions overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'rgba(10, 26, 64, 0.5)',
          padding: '10px',
          borderRadius: '5px',
          color: 'white',
          zIndex: 10,
          fontSize: '14px'
        }}
      >
        Click on network nodes to see details
      </Box>
    </Box>
  );
};

export default InteractiveNetworkVisualization;