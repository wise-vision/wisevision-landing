import { Object3D, Color, Vector3 } from 'three';
import { ReactThreeFiber } from '@react-three/fiber';

declare module '@react-three/drei' {
  // Add any missing type definitions here
  export interface MeshReflectorMaterialProps {
    blur?: [number, number];
    resolution?: number;
    mixBlur?: number;
    mixStrength?: number;
    roughness?: number;
    depthScale?: number;
    minDepthThreshold?: number;
    maxDepthThreshold?: number;
    color?: Color | string;
    metalness?: number;
  }

  export function MeshReflectorMaterial(
    props: JSX.IntrinsicElements['meshStandardMaterial'] & MeshReflectorMaterialProps
  ): JSX.Element;
}
