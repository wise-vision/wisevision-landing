"use client";

import React, { useState } from 'react';

interface UIControlsProps {
  onFilterChange?: (filter: string) => void;
  onHighlightChange?: (highlightType: string) => void;
  onViewModeChange?: (viewMode: 'simple' | 'full' | 'plan') => void;
  viewMode: 'simple' | 'full' | 'plan';
}

const UIControls: React.FC<UIControlsProps> = ({ 
  onFilterChange,
  onHighlightChange, 
  onViewModeChange,
  viewMode
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeHighlight, setActiveHighlight] = useState('none');

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (onFilterChange) onFilterChange(filter);
  };

  const handleHighlightChange = (highlight: string) => {
    setActiveHighlight(highlight);
    if (onHighlightChange) onHighlightChange(highlight);
  };

  const handleViewModeChange = (mode: 'simple' | 'full' | 'plan') => {
    if (onViewModeChange) onViewModeChange(mode);
  };

  const buttonStyle = (active: boolean) => ({
    background: active ? '#3b82f6' : '#1e293b',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: active ? 'bold' : 'normal',
    transition: 'background 0.2s',
    fontSize: '14px',
    margin: '2px',
    minWidth: '90px',
    textAlign: 'center' as const
  });

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        style={{
          alignSelf: 'flex-end',
          background: '#2d3748',
          color: 'white',
          border: 'none',
          width: '36px',
          height: '36px',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}
      >
        {isExpanded ? '−' : '≡'}
      </button>

      {isExpanded && (
        <div style={{
          background: 'rgba(0,0,0,0.75)',
          padding: '15px',
          borderRadius: '8px',
          color: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(5px)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>Visualization Controls</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '5px' }}>View Mode</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleViewModeChange('plan')} 
                style={buttonStyle(viewMode === 'plan')}
              >
                Site Plan
              </button>
              <button 
                onClick={() => handleViewModeChange('full')} 
                style={buttonStyle(viewMode === 'full')}
              >
                Detailed
              </button>
              <button 
                onClick={() => handleViewModeChange('simple')} 
                style={buttonStyle(viewMode === 'simple')}
              >
                Simple
              </button>
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '5px' }}>Filter</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleFilterChange('all')}
                style={buttonStyle(activeFilter === 'all')}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('transportation')}
                style={buttonStyle(activeFilter === 'transportation')}
              >
                Transport
              </button>
              <button
                onClick={() => handleFilterChange('storage')}
                style={buttonStyle(activeFilter === 'storage')}
              >
                Storage
              </button>
              <button
                onClick={() => handleFilterChange('sensors')}
                style={buttonStyle(activeFilter === 'sensors')}
              >
                IoT
              </button>
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '5px' }}>Highlight</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleHighlightChange('none')}
                style={buttonStyle(activeHighlight === 'none')}
              >
                None
              </button>
              <button
                onClick={() => handleHighlightChange('activity')}
                style={buttonStyle(activeHighlight === 'activity')}
              >
                Activity
              </button>
              <button
                onClick={() => handleHighlightChange('priority')}
                style={buttonStyle(activeHighlight === 'priority')}
              >
                Priority
              </button>
            </div>
          </div>
          
          <div style={{ fontSize: '12px', opacity: 0.5, marginTop: '10px', textAlign: 'center' }}>
            Click objects for details
          </div>
        </div>
      )}
    </div>
  );
};

export default UIControls;
