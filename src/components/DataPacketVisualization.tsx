// import React, { useRef, useEffect } from 'react';
// import * as THREE from 'three';
// import { Box } from 'theme-ui';

// interface DataPacketVisualizationProps {
//   sx?: any;
// }

// const DataPacketVisualization: React.FC<DataPacketVisualizationProps> = ({ sx = {} }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const sceneRef = useRef<{
//     scene: THREE.Scene;
//     camera: THREE.PerspectiveCamera;
//     renderer: THREE.WebGLRenderer;
//     nodes: THREE.Mesh[];
//     links: THREE.Line[];
//     clock: THREE.Clock;
//     animationFrameId?: number;
//   }>();

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Initialize Three.js scene
//     const container = containerRef.current;
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       container.clientWidth / container.clientHeight,
//       0.1,
//       1000
//     );
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     const nodes: THREE.Mesh[] = [];
//     const links: THREE.Line[] = [];
//     const clock = new THREE.Clock();

//     // Store scene objects for later use
//     sceneRef.current = { scene, camera, renderer, nodes, links, clock };

//     // Setup renderer
//     renderer.setSize(container.clientWidth, container.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     container.appendChild(renderer.domElement);

//     // Setup scene
//     scene.background = new THREE.Color(0x111133);
//     camera.position.z = 40;

//     // Add lighting
//     const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(1, 1, 1);
//     scene.add(directionalLight);

//     // Create nodes
//     createNodes(30);
//     createLinks();
//     animate();

//     // Handle window resize
//     const handleResize = () => {
//       if (!containerRef.current || !sceneRef.current) return;

//       const { camera, renderer } = sceneRef.current;
//       const container = containerRef.current;

//       camera.aspect = container.clientWidth / container.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(container.clientWidth, container.clientHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     // Clean up on unmount
//     return () => {
//       if (sceneRef.current?.animationFrameId) {
//         cancelAnimationFrame(sceneRef.current.animationFrameId);
//       }
//       if (renderer.domElement && container.contains(renderer.domElement)) {
//         container.removeChild(renderer.domElement);
//       }
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   // Create node objects in the scene
//   const createNodes = (count: number) => {
//     if (!sceneRef.current) return;

//     const { scene, nodes } = sceneRef.current;
//     const geometry = new THREE.SphereGeometry(0.5, 16, 16);

//     const materials = [
//       new THREE.MeshPhongMaterial({ color: 0x3498db }),
//       new THREE.MeshPhongMaterial({ color: 0x2ecc71 }),
//       new THREE.MeshPhongMaterial({ color: 0xe74c3c })
//     ];

//     for (let i = 0; i < count; i++) {
//       const material = materials[Math.floor(Math.random() * materials.length)];
//       const node = new THREE.Mesh(geometry, material);

//       // Position nodes in a 3D space
//       node.position.x = (Math.random() - 0.5) * 50;
//       node.position.y = (Math.random() - 0.5) * 50;
//       node.position.z = (Math.random() - 0.5) * 50;

//       // Add velocity for animation
//       node.userData.velocity = new THREE.Vector3(
//         (Math.random() - 0.5) * 0.2,
//         (Math.random() - 0.5) * 0.2,
//         (Math.random() - 0.5) * 0.2
//       );

//       nodes.push(node);
//       scene.add(node);
//     }
//   };

//   // Create connections between nodes
//   const createLinks = () => {
//     if (!sceneRef.current) return;

//     const { scene, nodes, links } = sceneRef.current;

//     const lineMaterial = new THREE.LineBasicMaterial({
//       color: 0xffffff,
//       transparent: true,
//       opacity: 0.5
//     });

//     for (let i = 0; i < nodes.length; i++) {
//       // Connect each node to 2-5 other nodes
//       const connectionCount = Math.floor(Math.random() * 3) + 2;

//       for (let j = 0; j < connectionCount; j++) {
//         const targetIndex = Math.floor(Math.random() * nodes.length);
//         if (i !== targetIndex) {
//           const geometry = new THREE.BufferGeometry();

//           // Create the link between two nodes
//           const positions = new Float32Array([
//             nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
//             nodes[targetIndex].position.x, nodes[targetIndex].position.y, nodes[targetIndex].position.z
//           ]);

//           geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

//           const link = new THREE.Line(geometry, lineMaterial);
//           link.userData.startNodeIndex = i;
//           link.userData.endNodeIndex = targetIndex;

//           links.push(link);
//           scene.add(link);
//         }
//       }
//     }
//   };

//   // Update link positions to follow nodes
//   const updateLinks = () => {
//     if (!sceneRef.current) return;

//     const { links, nodes } = sceneRef.current;

//     links.forEach(link => {
//       const startNode = nodes[link.userData.startNodeIndex];
//       const endNode = nodes[link.userData.endNodeIndex];

//       const positions = (link.geometry as THREE.BufferGeometry).attributes.position.array;

//       positions[0] = startNode.position.x;
//       positions[1] = startNode.position.y;
//       positions[2] = startNode.position.z;

//       positions[3] = endNode.position.x;
//       positions[4] = endNode.position.y;
//       positions[5] = endNode.position.z;

//       (link.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
//     });
//   };

//   // Animate node positions
//   const animateNodes = () => {
//     if (!sceneRef.current) return;

//     const { nodes, clock } = sceneRef.current;
//     const time = clock.getElapsedTime();

//     nodes.forEach(node => {
//       // Move nodes according to their velocity
//       node.position.add(node.userData.velocity as THREE.Vector3);

//       // Contain nodes within boundaries
//       if (Math.abs(node.position.x) > 25) {
//         (node.userData.velocity as THREE.Vector3).x *= -1;
//       }
//       if (Math.abs(node.position.y) > 25) {
//         (node.userData.velocity as THREE.Vector3).y *= -1;
//       }
//       if (Math.abs(node.position.z) > 25) {
//         (node.userData.velocity as THREE.Vector3).z *= -1;
//       }

//       // Add a slight oscillation for a more organic feel
//       node.position.y += Math.sin(time + node.position.x * 0.05) * 0.03;
//     });
//   };

//   // Send a data packet along a random link
//   const sendDataPacket = () => {
//     if (!sceneRef.current) return;

//     const { scene, links, nodes } = sceneRef.current;

//     if (links.length === 0) return;

//     const linkIndex = Math.floor(Math.random() * links.length);
//     const link = links[linkIndex];

//     const startNode = nodes[link.userData.startNodeIndex];
//     const endNode = nodes[link.userData.endNodeIndex];

//     // Create a small sphere representing a data packet
//     const packetGeometry = new THREE.SphereGeometry(0.2, 8, 8);
//     const packetMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
//     const packet = new THREE.Mesh(packetGeometry, packetMaterial);

//     // Set initial position at the start node
//     packet.position.copy(startNode.position);

//     // Store target position and animation progress
//     packet.userData.startPosition = startNode.position.clone();
//     packet.userData.targetPosition = endNode.position.clone();
//     packet.userData.progress = 0;
//     packet.userData.speed = 0.02 + Math.random() * 0.03;

//     // Add to scene
//     scene.add(packet);

//     // Animate the packet
//     const animatePacket = () => {
//       packet.userData.progress += packet.userData.speed;

//       // Calculate new position
//       packet.position.lerpVectors(
//         packet.userData.startPosition,
//         packet.userData.targetPosition,
//         packet.userData.progress
//       );

//       if (packet.userData.progress >= 1) {
//         scene.remove(packet);
//         return;
//       }

//       requestAnimationFrame(animatePacket);
//     };

//     animatePacket();
//   };

//   // Main animation loop
//   const animate = () => {
//     if (!sceneRef.current) return;

//     const { scene, camera, renderer } = sceneRef.current;

//     sceneRef.current.animationFrameId = requestAnimationFrame(animate);

//     // Rotate the entire scene slightly for a better view
//     scene.rotation.y += 0.002;

//     animateNodes();
//     updateLinks();

//     // Add occasional "data packet" traveling along the links
//     if (Math.random() < 0.05 && sceneRef.current.links.length > 0) {
//       sendDataPacket();
//     }

//     renderer.render(scene, camera);
//   };

//   return (
//     <Box
//       ref={containerRef}
//       sx={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         width: '100%',
//         height: '100%',
//         objectFit: 'cover',
//         ...sx,
//       }}
//     />
//   );
// };

// export default DataPacketVisualization;
