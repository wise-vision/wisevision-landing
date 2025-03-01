import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Box } from 'theme-ui';

interface DataFlowVisualizationProps {
  sx?: any;
}

// Color palette
const COLORS = {
  BLUE_DEEP: 0x0a1a40,
  BLUE_MID: 0x0f3460,
  BLUE_LIGHT: 0x4bcdf0,
  TEAL: 0x3ae3ae,
  PURPLE: 0x533fe3,
  PINK: 0xea3b92,
  ORANGE: 0xff6600,
  WHITE: 0xffffff,
}

// Interface for 4D structures
interface Structure4D {
  object: THREE.Object3D;
  rotationAxis: THREE.Quaternion;
  rotationSpeed: number;
  children: Structure4D[];
  phase: number;
}

// Interface for data streams
interface DataStream {
  particles: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  speed: number;
  length: number;
  curve: THREE.CurvePath<THREE.Vector3>;
  particlePositions: Float32Array;
  particleSizes: Float32Array;
}

const DataFlowVisualization: React.FC<DataFlowVisualizationProps> = ({ sx = {} }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    structures: Structure4D[];
    dataStreams: DataStream[];
    clock: THREE.Clock;
    animationFrameId?: number;
  } | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const container = containerRef.current;
    const scene = new THREE.Scene();
    
    // Create camera with wide FOV for immersive feel
    const camera = new THREE.PerspectiveCamera(
      75, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 0, 70);
    
    // Configure renderer with high quality settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create gradient background
    const backgroundTexture = createGradientBackground();
    scene.background = backgroundTexture;
    
    // Add ambient and directional lighting
    const ambientLight = new THREE.AmbientLight(0x333355, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(COLORS.BLUE_LIGHT, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(COLORS.TEAL, 1.0, 100);
    pointLight1.position.set(-20, 15, 20);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(COLORS.PURPLE, 0.8, 80);
    pointLight2.position.set(20, -15, 10);
    scene.add(pointLight2);

    // Initialize post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.8,  // Strength
      0.3,  // Radius
      0.7   // Threshold
    );
    composer.addPass(bloomPass);
    
    // Initialize containers for scene objects
    const structures: Structure4D[] = [];
    const dataStreams: DataStream[] = [];
    const clock = new THREE.Clock();
    
    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      composer,
      structures,
      dataStreams,
      clock,
    };

    // Create 4D structures and data flows
    createTesseractStructures();
    createDataFlows();

   // Animation loop
    const animate = () => {
      const id = requestAnimationFrame(animate);
      sceneRef.current!.animationFrameId = id;
      
      const time = clock.getElapsedTime();
      
      // Animate 4D structures
      animateStructures(time);
      
      // Animate data flows
      animateDataFlows(time);
      
      // Very subtle overall rotation for the entire scene
      scene.rotation.y = Math.sin(time * 0.05) * 0.1;
      scene.rotation.x = Math.sin(time * 0.03) * 0.05;
      
      // Render with post-processing
      composer.render();
    };
    
    animate();

    // Window resize handler
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      
      const container = containerRef.current;
      const { camera, renderer, composer } = sceneRef.current;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(container.clientWidth, container.clientHeight);
      composer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current?.animationFrameId) {
        cancelAnimationFrame(sceneRef.current.animationFrameId);
      }
      
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Create gradient background texture
  const createGradientBackground = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    
    const context = canvas.getContext('2d')!;
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    
    // Deep rich gradient
    gradient.addColorStop(0, '#0a1a40');
    gradient.addColorStop(1, '#0f3460');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  // Create 4D tesseract-like structures
  const createTesseractStructures = () => {
    if (!sceneRef.current) return;
    
    const { scene, structures } = sceneRef.current;
    
    // Create main 4D hyperstructures
    createHyperstructure(0, 0, -10, 22, COLORS.BLUE_LIGHT, 0.9);
    createHyperstructure(-30, 15, -30, 15, COLORS.TEAL, 0.7);
    createHyperstructure(35, -10, -40, 18, COLORS.PURPLE, 0.8);
    
    // Create smaller structures for complexity
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 50 + Math.random() * 20;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = -60 - Math.random() * 30;
      
      const size = 5 + Math.random() * 8;
      const color = i % 2 === 0 ? COLORS.TEAL : COLORS.PURPLE;
      
      createHyperstructure(x, y, z, size, color, 0.5);
    }
  };
  
  // Create a single 4D hyperstructure
  const createHyperstructure = (x: number, y: number, z: number, size: number, color: number, opacity: number) => {
    if (!sceneRef.current) return;
    
    const { scene, structures } = sceneRef.current;
    
    // Create outer cube (represents 4D hyperstructure projection)
    const outerGeometry = new THREE.BoxGeometry(size, size, size);
    const outerEdges = new THREE.EdgesGeometry(outerGeometry);
    const outerMaterial = new THREE.LineBasicMaterial({ 
      color, 
      transparent: true,
      opacity: opacity * 0.8,
      linewidth: 1.5
    });
    
    const outerCube = new THREE.LineSegments(outerEdges, outerMaterial);
    outerCube.position.set(x, y, z);
    scene.add(outerCube);
    
    // Create inner cube (represents hypercube inner projection)
    const innerGeometry = new THREE.BoxGeometry(size * 0.6, size * 0.6, size * 0.6);
    const innerEdges = new THREE.EdgesGeometry(innerGeometry);
    const innerMaterial = new THREE.LineBasicMaterial({ 
      color, 
      transparent: true,
      opacity: opacity,
      linewidth: 1.5
    });
    
    const innerCube = new THREE.LineSegments(innerEdges, innerMaterial);
    innerCube.position.set(x, y, z);
    scene.add(innerCube);
    
    // Connect inner and outer cube vertices
    const connectionsMaterial = new THREE.LineBasicMaterial({ 
      color, 
      transparent: true,
      opacity: opacity * 0.5,
      linewidth: 1
    });
    
    for (let i = 0; i < 8; i++) {
      // Position calculation for vertices
      const sign = [
        [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
        [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
      ];
      
      const outerX = x + sign[i][0] * size / 2;
      const outerY = y + sign[i][1] * size / 2;
      const outerZ = z + sign[i][2] * size / 2;
      
      const innerX = x + sign[i][0] * size * 0.3;
      const innerY = y + sign[i][1] * size * 0.3;
      const innerZ = z + sign[i][2] * size * 0.3;
      
      const connectionGeometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        outerX, outerY, outerZ,
        innerX, innerY, innerZ
      ]);
      
      connectionGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      const connection = new THREE.Line(connectionGeometry, connectionsMaterial);
      scene.add(connection);
    }
    
    // Create a center point with glow effect
    const pointGeometry = new THREE.SphereGeometry(size * 0.08, 16, 16);
    const pointMaterial = new THREE.MeshBasicMaterial({ 
      color, 
      transparent: true,
      opacity: opacity * 1.2
    });
    
    const centerPoint = new THREE.Mesh(pointGeometry, pointMaterial);
    centerPoint.position.set(x, y, z);
    scene.add(centerPoint);
    
    // Create rotation structure for 4D animation
    const structure: Structure4D = {
      object: new THREE.Group(),
      rotationAxis: new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize(),
        Math.PI * 2
      ),
      rotationSpeed: 0.2 + Math.random() * 0.3,
      children: [],
      phase: Math.random() * Math.PI * 2
    };
    
    // Add all objects to the structure
    structure.object.add(outerCube);
    structure.object.add(innerCube);
    structure.object.add(centerPoint);
    
    // Store for animation
    structures.push(structure);
  };

  // Create data flow paths between structures
  const createDataFlows = () => {
    if (!sceneRef.current) return;
    
    const { scene, dataStreams } = sceneRef.current;
    
    // Create 12-15 data flows connecting different points
    const flowCount = 15;
    const colors = [COLORS.BLUE_LIGHT, COLORS.TEAL, COLORS.PURPLE, COLORS.PINK, COLORS.ORANGE];
    
    for (let i = 0; i < flowCount; i++) {
      // Create random paths in 3D space
      const path = new THREE.CurvePath<THREE.Vector3>();
      
      // Define start and end points
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        -(Math.random() * 50 + 20)
      );
      
      const end = new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        -(Math.random() * 50 + 20)
      );
      
      // Create control points for curved path
      const controlPoints = [];
      const segmentCount = 2 + Math.floor(Math.random() * 3);
      
      for (let j = 0; j <= segmentCount; j++) {
        const t = j / segmentCount;
        
        // Interpolate between start and end
        const x = start.x + (end.x - start.x) * t;
        const y = start.y + (end.y - start.y) * t;
        const z = start.z + (end.z - start.z) * t;
        
        // Add some randomness to create curves
        const offset = 20 * Math.sin(t * Math.PI);
        controlPoints.push(new THREE.Vector3(
          x + (Math.random() - 0.5) * offset,
          y + (Math.random() - 0.5) * offset,
          z
        ));
      }
      
      // Create spline from control points
      for (let j = 0; j < controlPoints.length - 1; j++) {
        const curve = new THREE.CatmullRomCurve3([
          controlPoints[j],
          controlPoints[j + 1]
        ]);
        path.add(curve);
      }
      
      // Create particle system for the data flow
      const particleCount = 100 + Math.floor(Math.random() * 150);
      const geometry = new THREE.BufferGeometry();
      
      // Create particle positions along the path
      const positions = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      for (let j = 0; j < particleCount; j++) {
        const t = j / particleCount;
        const point = path.getPoint(t);
        
        positions[j * 3] = point.x;
        positions[j * 3 + 1] = point.y;
        positions[j * 3 + 2] = point.z;
        
        // Vary particle sizes
        sizes[j] = 0.1 + Math.random() * 0.8;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      // Create glowing particle material
      const color = colors[Math.floor(Math.random() * colors.length)];
      const material = new THREE.PointsMaterial({
        color: color,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      
      // Store the data stream
      dataStreams.push({
        particles,
        geometry,
        material,
        speed: 0.2 + Math.random() * 0.5,
        length: particleCount,
        curve: path,
        particlePositions: positions,
        particleSizes: sizes
      });
    }
  };

  // Animate 4D structures
  const animateStructures = (time: number) => {
    if (!sceneRef.current) return;
    
    const { structures } = sceneRef.current;
    
    structures.forEach(structure => {
      // Apply 4D-like rotation using quaternions
      const rotation = new THREE.Quaternion();
      rotation.setFromAxisAngle(
        new THREE.Vector3(
          Math.sin(time * 0.2 + structure.phase),
          Math.cos(time * 0.3 + structure.phase),
          Math.sin(time * 0.17 + structure.phase) * Math.cos(time * 0.23 + structure.phase)
        ).normalize(),
        time * 0.1 * structure.rotationSpeed
      );
      
      // Apply the rotation to all objects in the structure
      structure.object.children.forEach(child => {
        child.quaternion.multiply(rotation);
      });
      
      // Add subtle scaling effect
      const scale = 1 + Math.sin(time * 0.5 + structure.phase) * 0.05;
      structure.object.scale.set(scale, scale, scale);
    });
  };

  // Animate data flows
  const animateDataFlows = (time: number) => {
    if (!sceneRef.current) return;
    
    const { dataStreams } = sceneRef.current;
    
    dataStreams.forEach(stream => {
      const { particlePositions, particleSizes, length, curve, speed } = stream;
      
      // Update particle positions along the curve
      for (let i = 0; i < length; i++) {
        // Calculate new position with cycling movement
        const t = ((i / length) + (time * speed) % 1) % 1;
        const point = curve.getPoint(t);
        
        particlePositions[i * 3] = point.x;
        particlePositions[i * 3 + 1] = point.y;
        particlePositions[i * 3 + 2] = point.z;
        
        // Pulse the particle sizes
        particleSizes[i] = (0.2 + Math.sin(t * Math.PI * 20 + time * 2) * 0.15) * (1 + Math.sin(time * 0.5) * 0.2);
      }
      
      // Update the geometry
      (stream.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (stream.geometry.attributes.size as THREE.BufferAttribute).needsUpdate = true;
      
      // Pulse the opacity and color over time
      const opacity = 0.6 + Math.sin(time * 0.7) * 0.2;
      stream.material.opacity = opacity;
    });
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
        zIndex: 0,
        ...sx,
      }}
    />
  );
};

export default DataFlowVisualization;
