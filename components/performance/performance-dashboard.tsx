"use client";

/**
 * Performance Dashboard Component
 * 
 * A development-only dashboard that visualizes real-time performance metrics.
 * This component provides:
 * - Real-time visualization of Core Web Vitals
 * - Custom metric tracking with timeline view
 * - Filtering and sorting capabilities
 * - Threshold indicators for poor/good/excellent performance
 * 
 * This should only be rendered in development mode.
 */

import React, { useState, useEffect } from 'react';
import { METRIC_NAMES } from '@/lib/performance/performance-metrics';
import { createPerformanceLogger } from '@/lib/performance/performance-logger';

type MetricSeverity = 'good' | 'needs-improvement' | 'poor';

interface MetricData {
  name: string;
  value: number;
  timestamp: number;
  severity: MetricSeverity;
  attribution?: Record<string, unknown>;
}

interface PerformanceDashboardProps {
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
  initiallyOpen?: boolean;
  thresholds?: Record<string, { poor: number; good: number }>;
}

// Default thresholds based on Core Web Vitals recommendations
const DEFAULT_THRESHOLDS = {
  [METRIC_NAMES.LCP]: { poor: 4000, good: 2500 }, // milliseconds
  [METRIC_NAMES.FID]: { poor: 300, good: 100 },   // milliseconds
  [METRIC_NAMES.CLS]: { poor: 0.25, good: 0.1 },  // unitless
  [METRIC_NAMES.INP]: { poor: 500, good: 200 },   // milliseconds
  [METRIC_NAMES.TTFB]: { poor: 800, good: 400 },  // milliseconds
  [METRIC_NAMES.FCP]: { poor: 3000, good: 1800 }, // milliseconds
  
  // Custom metrics
  [METRIC_NAMES.DYNAMIC_IMPORT]: { poor: 500, good: 200 },
  [METRIC_NAMES.HYDRATION_TIME]: { poor: 700, good: 300 },
  [METRIC_NAMES.JS_PARSE_TIME]: { poor: 300, good: 100 },
  [METRIC_NAMES.CSS_BLOCK_TIME]: { poor: 100, good: 50 },
  [METRIC_NAMES.IMAGE_LOAD_TIME]: { poor: 1000, good: 400 }
};

// Determine metric severity based on thresholds
const getMetricSeverity = (name: string, value: number, thresholds: Record<string, { poor: number; good: number }>): MetricSeverity => {
  const threshold = thresholds[name] || { poor: 1000, good: 500 };
  
  if (value <= threshold.good) return 'good';
  if (value >= threshold.poor) return 'poor';
  return 'needs-improvement';
};

const logger = createPerformanceLogger();

export function PerformanceDashboard({ 
  position = 'bottom-right',
  initiallyOpen = false,
  thresholds = DEFAULT_THRESHOLDS 
}: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'time' | 'value' | 'name'>('time');
  
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-left': 'top-4 left-4'
  };
  
  // Listen for performance events and update the dashboard
  useEffect(() => {
    if (!isOpen) return;
    
    const handlePerformanceEvent = (event: CustomEvent) => {
      const { name, value, id } = event.detail;
      const severity = getMetricSeverity(name, value, thresholds);
      
      setMetrics(prev => {
        // Keep max 100 metrics to avoid memory issues
        const newMetrics = [
          { 
            name,
            value,
            timestamp: Date.now(),
            severity,
            attribution: event.detail.attribution
          },
          ...prev
        ];
        
        return newMetrics.slice(0, 100);
      });
      
      // Log the metric with our logger service
      logger.logMetric({
        id: id || `${name}-${Date.now()}`,
        name,
        value,
        attribution: event.detail.attribution
      });
    };
    
    window.addEventListener('performance-measurement', handlePerformanceEvent as EventListener);
    
    return () => {
      window.removeEventListener('performance-measurement', handlePerformanceEvent as EventListener);
    };
  }, [isOpen, thresholds]);
  
  // Sort and filter the metrics
  const filteredMetrics = metrics
    .filter(m => filter === 'all' || m.name === filter || m.severity === filter)
    .sort((a, b) => {
      if (sortBy === 'time') return b.timestamp - a.timestamp;
      if (sortBy === 'value') return b.value - a.value;
      return a.name.localeCompare(b.name);
    });
    
  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
      >
        {isOpen ? '✕' : '📊'}
      </button>
      
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 mt-2 w-96 max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Performance Dashboard</h2>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <select 
              className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-sm dark:text-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Metrics</option>
              <option value="good">Good</option>
              <option value="needs-improvement">Needs Improvement</option>
              <option value="poor">Poor</option>
              {Object.values(METRIC_NAMES).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            
            <select 
              className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-sm dark:text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'time' | 'value' | 'name')}
            >
              <option value="time">Time (newest)</option>
              <option value="value">Value (highest)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            {filteredMetrics.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                No metrics captured yet. Interact with the page to generate performance data.
              </div>
            ) : (
              filteredMetrics.map((metric, index) => (
                <div 
                  key={`${metric.name}-${index}`}
                  className={`
                    border-l-4 p-3 rounded-r-lg
                    ${metric.severity === 'good' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
                    ${metric.severity === 'needs-improvement' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : ''}
                    ${metric.severity === 'poor' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                  `}
                >
                  <div className="flex justify-between">
                    <span className="font-medium dark:text-white">{metric.name}</span>
                    <span className={`
                      font-mono
                      ${metric.severity === 'good' ? 'text-green-700 dark:text-green-400' : ''}
                      ${metric.severity === 'needs-improvement' ? 'text-yellow-700 dark:text-yellow-400' : ''}
                      ${metric.severity === 'poor' ? 'text-red-700 dark:text-red-400' : ''}
                    `}>
                      {metric.value.toFixed(2)}{metric.name === 'CLS' ? '' : 'ms'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </div>
                  {metric.attribution && Object.keys(metric.attribution).length > 0 && (
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                      {Object.entries(metric.attribution).map(([key, value]) => (
                        <div key={key}>{key}: {String(value)}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
