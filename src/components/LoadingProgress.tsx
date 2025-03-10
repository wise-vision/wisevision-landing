"use client";

import { useProgress, Html } from '@react-three/drei';
import { useEffect } from 'react';

const LoadingProgress = () => {
  const { active, progress, errors, item } = useProgress();
  
  useEffect(() => {
    // Log loading progress to help debugging
    console.log(`Loading progress: ${progress.toFixed(2)}%, active: ${active}, item: ${item}`);
    
    if (errors.length > 0) {
      console.error('Loading errors:', errors);
    }
  }, [progress, active, item, errors]);

  return (
    <Html center>
      <div style={{
        width: '250px',
        color: 'white',
        fontSize: '14px',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.8)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Loading Dry Port</h2>
          <p style={{ margin: '0', opacity: 0.7 }}>Creating a digital twin of the port...</p>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          height: '8px',
          marginBottom: '10px'
        }}>
          <div style={{
            background: '#3b82f6',
            width: `${progress}%`,
            height: '100%',
            transition: 'width 0.3s ease'
          }}/>
        </div>
        
        <div style={{ fontSize: '12px', opacity: 0.7 }}>
          {Math.round(progress)}% complete
          {item && <div style={{ fontSize: '10px', marginTop: '5px' }}>Loading: {item}</div>}
          {errors.length > 0 && (
            <div style={{ color: '#ff4444', marginTop: '10px' }}>
              Some assets failed to load. Try refreshing.
            </div>
          )}
        </div>
      </div>
    </Html>
  );
};

export default LoadingProgress;
