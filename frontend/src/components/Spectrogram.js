import React, { useEffect, useRef } from 'react';

const Spectrogram = ({ 
  width = 480, 
  height = 400, 
  timeRange = [0, 54], // [start, end] in seconds
  freqRange = [0, 8192] // [start, end] in Hz
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Margins for axes
    const margin = { top: 10, right: 20, bottom: 40, left: 40 };
    const plotWidth = canvasWidth - margin.left - margin.right;
    const plotHeight = canvasHeight - margin.top - margin.bottom;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Generate sample spectrogram data
    const timeSteps = 100;
    const freqBins = 80;
    const spectrogramData = [];

    for (let t = 0; t < timeSteps; t++) {
      const timeColumn = [];
      for (let f = 0; f < freqBins; f++) {
        // Create realistic spectrogram pattern
        let intensity = 0;
        
        // Low frequency content (bass)
        if (f < 15) {
          intensity = Math.random() * 0.8 + 0.2;
        }
        // Mid frequency content
        else if (f < 40) {
          intensity = Math.random() * 0.6 + Math.sin(t * 0.1) * 0.3;
        }
        // High frequency content (harmonics)
        else if (f < 60) {
          intensity = Math.random() * 0.4 + Math.cos(t * 0.05) * 0.2;
        }
        // Very high frequencies (noise)
        else {
          intensity = Math.random() * 0.2;
        }
        
        // Add some random spikes
        if (Math.random() < 0.05) {
          intensity += Math.random() * 0.5;
        }
        
        intensity = Math.max(0, Math.min(1, intensity));
        timeColumn.push(intensity);
      }
      spectrogramData.push(timeColumn);
    }

    // Draw spectrogram
    for (let t = 0; t < timeSteps; t++) {
      for (let f = 0; f < freqBins; f++) {
        const intensity = spectrogramData[t][f];
        
        // Create color based on intensity
        let r, g, b;
        if (intensity < 0.25) {
          // Dark purple to purple
          r = Math.floor(50 + intensity * 4 * 100);
          g = Math.floor(0 + intensity * 4 * 50);
          b = Math.floor(100 + intensity * 4 * 155);
        } else if (intensity < 0.5) {
          // Purple to magenta
          r = Math.floor(150 + (intensity - 0.25) * 4 * 105);
          g = Math.floor(50 + (intensity - 0.25) * 4 * 50);
          b = Math.floor(255 - (intensity - 0.25) * 4 * 100);
        } else if (intensity < 0.75) {
          // Magenta to red
          r = 255;
          g = Math.floor(100 + (intensity - 0.5) * 4 * 155);
          b = Math.floor(155 - (intensity - 0.5) * 4 * 155);
        } else {
          // Red to yellow
          r = 255;
          g = Math.floor(255);
          b = Math.floor((1 - intensity) * 4 * 255);
        }
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        
        const x = margin.left + (t / timeSteps) * plotWidth;
        const y = margin.top + plotHeight - (f / freqBins) * plotHeight;
        const cellWidth = plotWidth / timeSteps;
        const cellHeight = plotHeight / freqBins;
        
        ctx.fillRect(x, y, cellWidth, cellHeight);
      }
    }

    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000000';

    // Y-axis (frequency)
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + plotHeight);
    ctx.stroke();

    // X-axis (time)
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + plotHeight);
    ctx.lineTo(margin.left + plotWidth, margin.top + plotHeight);
    ctx.stroke();

    // Y-axis labels (frequency in Hz)
    const freqLabels = [0, 512, 1024, 2048, 4096, 8192];
    for (let i = 0; i < freqLabels.length; i++) {
      const freq = freqLabels[i];
      const y = margin.top + plotHeight - (i / (freqLabels.length - 1)) * plotHeight;
      
      // Tick mark
      ctx.beginPath();
      ctx.moveTo(margin.left - 5, y);
      ctx.lineTo(margin.left, y);
      ctx.stroke();
      
      // Label
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(freq.toString(), margin.left - 10, y);
    }

    // X-axis labels (time in seconds)
    const timeLabels = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54];
    for (let i = 0; i < timeLabels.length; i++) {
      const time = timeLabels[i];
      const x = margin.left + (i / (timeLabels.length - 1)) * plotWidth;
      
      // Tick mark
      ctx.beginPath();
      ctx.moveTo(x, margin.top + plotHeight);
      ctx.lineTo(x, margin.top + plotHeight + 5);
      ctx.stroke();
      
      // Label
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(time.toString(), x, margin.top + plotHeight + 10);
    }

    // Axis titles
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Y-axis title (rotated)
    ctx.save();
    ctx.translate(15, margin.top + plotHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.restore();

  }, [width, height, timeRange, freqRange]);

  return (
    <div className="bg-white inline-block">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
  );
};
export default Spectrogram;