"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import TestCube from './TestCube';

// Fixed dynamic import with proper loading component
const DryPortSitePlan = dynamic(() => import('./DryPortSitePlan'), { 
  ssr: false,
  loading: () => (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.7)',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2>Loading Visualization...</h2>
        <p>This may take a moment. If it doesn't load, try the "Simple View".</p>
        <div style={{
          width: '200px',
          height: '4px',
          background: '#333',
          marginTop: '20px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '50%', 
            height: '100%',
            background: '#3b82f6',
            animation: 'loading 1.5s infinite'
          }}></div>
        </div>
        <style jsx>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    </div>
  )
});

// Import DryPortVisualization as a fallback
const DryPortVisualization = dynamic(() => import('./DryPortVisualization'), { 
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      color: 'white'
    }}>
      <div>Loading Simple View...</div>
    </div>
  )
});

const EnhancedDryPortVisualization: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [highlight, setHighlight] = useState('none');
  const [error, setError] = useState<string | null>(null);
  // Start with the Simple View by default since it's more reliable
  const [displayMode, setDisplayMode] = useState<'test-cube' | 'site-plan' | 'simple-view'>('simple-view');
  // Add loading timeout management
  const [siteplanLoaded, setSiteplanLoaded] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Fixed useEffect with proper return type for all code paths
  useEffect(() => {
    // Declare timer outside try block so we can return cleanup function
    let timer: NodeJS.Timeout;

    try {
      if (typeof window !== 'undefined') {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || 
                  canvas.getContext('experimental-webgl');
        if (!gl) {
          setError("Your browser doesn't support WebGL, which is required for 3D visualization.");
        }
      }

      // Set a timeout for the Site Plan loading
      timer = setTimeout(() => {
        if (displayMode === 'site-plan' && !siteplanLoaded) {
          setLoadingTimeout(true);
          // Auto-switch to Simple View after timeout
          setDisplayMode('simple-view');
        }
      }, 8000);
      
    } catch (e) {
      setError("There was a problem initializing WebGL. Please try a different browser.");
    }

    // Return cleanup function outside of try-catch to ensure it runs in all cases
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [displayMode, siteplanLoaded]);

  // Track when site plan is selected and loaded
  useEffect(() => {
    if (displayMode === 'site-plan') {
      setSiteplanLoaded(false);
    }
  }, [displayMode]);

  // Notify when site plan loads successfully
  const handleSitePlanLoaded = () => {
    setSiteplanLoaded(true);
    setLoadingTimeout(false);
  };

  const handleFilterChange = (newFilter: string) => setFilter(newFilter);
  const handleHighlightChange = (newHighlight: string) => setHighlight(newHighlight);

  // Controls Panel
  const ControlPanel = () => (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'rgba(0,0,0,0.75)',
      padding: '15px',
      borderRadius: '8px',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>Visualization Controls</h3>
      
      {/* View mode controls - highlight Simple View as recommended */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '5px' }}>View Mode</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          <button
            onClick={() => setDisplayMode('site-plan')}
            style={{
              background: displayMode === 'site-plan' ? '#3b82f6' : '#1e293b',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              minWidth: '90px'
            }}
          >
            Site Plan
          </button>
          <button
            onClick={() => setDisplayMode('simple-view')}
            style={{
              background: displayMode === 'simple-view' ? '#3b82f6' : '#1e293b',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              minWidth: '90px',
              boxShadow: displayMode !== 'simple-view' ? '0 0 5px #10b981' : 'none', // Green glow to highlight
            }}
          >
            Simple View
          </button>
          <button
            onClick={() => setDisplayMode('test-cube')}
            style={{
              background: displayMode === 'test-cube' ? '#3b82f6' : '#1e293b',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              minWidth: '90px'
            }}
          >
            Test Cube
          </button>
        </div>
      </div>
      
      {/* Filter buttons */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '5px' }}>Filter</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          <button
            onClick={() => handleFilterChange('all')}
            style={{
              background: filter === 'all' ? '#3b82f6' : '#1e293b',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              minWidth: '90px'
            }}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange('transportation')}
            style={{
              background: filter === 'transportation' ? '#3b82f6' : '#1e293b',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              minWidth: '90px'
            }}
          >
            Transport
          </button>
          <button
            onClick={() => handleFilterChange('storage')}
            style={{
              background: filter === 'storage' ? '#3b82f6' : '#1e293b',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              minWidth: '90px'
            }}
          >
            Storage
          </button>
        </div>
      </div>
      
      {/* Highlight buttons */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '5px' }}>Highlight</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          <button
            onClick={() => handleHighlightChange('none')}
            style={{
              background: highlight === 'none' ? '#3b82f6' : '#1e293b',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              minWidth: '90px'
            }}
          >
            None
          </button>
          <button
            onClick={() => handleHighlightChange('activity')}
            style={{
              background: highlight === 'activity' ? '#3b82f6' : '#1e293b',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              minWidth: '90px'
            }}
          >
            Activity
          </button>
          <button
            onClick={() => handleHighlightChange('priority')}
            style={{
              background: highlight === 'priority' ? '#3b82f6' : '#1e293b',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              minWidth: '90px'
            }}
          >
            Priority
          </button>
        </div>
      </div>
      
      {/* Refresh button */}
      <button
        onClick={() => window.location.reload()}
        style={{
          background: '#ef4444',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          width: '100%'
        }}
      >
        Refresh View
      </button>
    </div>
  );

  // Handle errors
  if (error) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        color: 'white',
        flexDirection: 'column',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2>Visualization Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Render the selected visualization mode */}
      <div style={{ width: '100%', height: '100%' }}>
        {displayMode === 'test-cube' && <TestCube />}
        {displayMode === 'site-plan' && (
          <DryPortSitePlan 
            filter={filter} 
            highlight={highlight} 
            onLoad={handleSitePlanLoaded} 
          />
        )}
        {displayMode === 'simple-view' && <DryPortVisualization filter={filter} highlight={highlight} />}
      </div>
      
      {/* Loading timeout warning */}
      {loadingTimeout && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          left: '20px',
          background: 'rgba(239,68,68,0.9)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '8px',
          fontSize: '14px',
          maxWidth: '300px',
          zIndex: 1000
        }}>
          Site Plan view took too long to load. Switched to Simple View.
        </div>
      )}
      
      {/* Control panel overlay */}
      <ControlPanel />
      
      {/* Navigation help tooltip */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '14px',
        maxWidth: '300px',
        zIndex: 1000
      }}>
        <strong>Navigation:</strong> Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  );
};

export default EnhancedDryPortVisualization;