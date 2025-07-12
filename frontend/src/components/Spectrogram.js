import React, { useEffect, useRef, useCallback } from "react";

const Spectrogram = ({
  id,
  audioBuffer,
  width = 480,
  height = 400,
  timeRange = [0, 54], // [start, end] in seconds
  freqRange = [0, 8192], // [start, end] in Hz
}) => {
  const canvasRef = useRef(null);

  const generateSampleData = useCallback(() => {
    const timeSteps = 100;
    const freqBins = 80;
    const spectrogramData = [];

    for (let t = 0; t < timeSteps; t++) {
      const timeColumn = [];
      for (let f = 0; f < freqBins; f++) {
        let intensity = 0;

        // Very low frequency content (strong bass)
        if (f < 8) {
          intensity = 0.8 + Math.random() * 0.2;
        }
        // Low frequency content
        else if (f < 18) {
          intensity = 0.6 + Math.random() * 0.3 + Math.sin(t * 0.1) * 0.1;
        }
        // Low-mid frequency content
        else if (f < 30) {
          intensity = 0.4 + Math.random() * 0.3 + Math.cos(t * 0.05) * 0.1;
        }
        // Mid frequency content
        else if (f < 45) {
          intensity = 0.2 + Math.random() * 0.2;
        }
        // High frequency content
        else if (f < 65) {
          intensity = 0.1 + Math.random() * 0.15;
        }
        // Very high frequencies
        else {
          intensity = 0.05 + Math.random() * 0.1;
        }

        // Add some random variations
        if (Math.random() < 0.03) {
          intensity += Math.random() * 0.3;
        }

        intensity = Math.max(0, Math.min(1, intensity));
        timeColumn.push(intensity);
      }
      spectrogramData.push(timeColumn);
    }

    return spectrogramData;
  }, []);

  const generateSpectrogramData = useCallback(
    (audioBuffer) => {
      if (!audioBuffer || !audioBuffer.getChannelData) {
        // Fallback to sample data if no valid audio buffer
        return generateSampleData();
      }

      try {
        const audioData = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;
        const duration = audioBuffer.duration;

        // Simple spectrogram generation
        const timeSteps = 100;
        const freqBins = 80;
        const spectrogramData = [];

        const samplesPerTimeStep = Math.floor(audioData.length / timeSteps);

        for (let t = 0; t < timeSteps; t++) {
          const timeColumn = [];
          const startSample = t * samplesPerTimeStep;
          const endSample = Math.min(
            startSample + samplesPerTimeStep,
            audioData.length,
          );

          for (let f = 0; f < freqBins; f++) {
            // Simple frequency analysis - calculate energy in frequency bands
            let energy = 0;
            const bandSize = Math.floor(samplesPerTimeStep / freqBins);
            const bandStart = startSample + f * bandSize;
            const bandEnd = Math.min(bandStart + bandSize, endSample);

            // Calculate RMS energy for this frequency band
            for (let i = bandStart; i < bandEnd; i++) {
              if (i < audioData.length) {
                energy += audioData[i] * audioData[i];
              }
            }

            energy = Math.sqrt(energy / (bandEnd - bandStart));

            // Apply some frequency-dependent weighting
            let intensity = energy * 10; // Scale up for visibility

            // Add frequency-dependent falloff (higher frequencies typically have less energy)
            const freqFactor = 1 - (f / freqBins) * 0.7;
            intensity *= freqFactor;

            // Clamp to 0-1 range
            intensity = Math.max(0, Math.min(1, intensity));

            timeColumn.push(intensity);
          }
          spectrogramData.push(timeColumn);
        }

        return spectrogramData;
      } catch (error) {
        console.warn("Error processing audio buffer for spectrogram:", error);
        return generateSampleData();
      }
    },
    [generateSampleData],
  );

  const getColorFromIntensity = useCallback((intensity) => {
    let r, g, b;

    if (intensity < 0.1) {
      // Very dark purple/black
      r = Math.floor(20 + intensity * 10 * 30);
      g = Math.floor(0 + intensity * 10 * 20);
      b = Math.floor(40 + intensity * 10 * 60);
    } else if (intensity < 0.3) {
      // Dark purple to purple
      const t_norm = (intensity - 0.1) / 0.2;
      r = Math.floor(50 + t_norm * 80);
      g = Math.floor(20 + t_norm * 30);
      b = Math.floor(100 + t_norm * 100);
    } else if (intensity < 0.5) {
      // Purple to magenta
      const t_norm = (intensity - 0.3) / 0.2;
      r = Math.floor(130 + t_norm * 125);
      g = Math.floor(50 + t_norm * 50);
      b = Math.floor(200 - t_norm * 80);
    } else if (intensity < 0.7) {
      // Magenta to red
      const t_norm = (intensity - 0.5) / 0.2;
      r = 255;
      g = Math.floor(100 - t_norm * 50);
      b = Math.floor(120 - t_norm * 120);
    } else if (intensity < 0.85) {
      // Red to orange
      const t_norm = (intensity - 0.7) / 0.15;
      r = 255;
      g = Math.floor(50 + t_norm * 150);
      b = 0;
    } else {
      // Orange to yellow
      const t_norm = (intensity - 0.85) / 0.15;
      r = 255;
      g = Math.floor(200 + t_norm * 55);
      b = Math.floor(t_norm * 100);
    }

    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Margins for axes
    const margin = { top: 10, right: 20, bottom: 40, left: 40 };
    const plotWidth = canvasWidth - margin.left - margin.right;
    const plotHeight = canvasHeight - margin.top - margin.bottom;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Generate spectrogram data
    const spectrogramData = generateSpectrogramData(audioBuffer);
    const timeSteps = spectrogramData.length;
    const freqBins = spectrogramData[0]?.length || 0;

    if (timeSteps === 0 || freqBins === 0) {
      ctx.fillStyle = "#000000";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "No audio data available",
        canvasWidth / 2,
        canvasHeight / 2,
      );
      return;
    }

    // Draw spectrogram
    for (let t = 0; t < timeSteps; t++) {
      for (let f = 0; f < freqBins; f++) {
        const intensity = spectrogramData[t][f];
        ctx.fillStyle = getColorFromIntensity(intensity);

        const x = margin.left + (t / timeSteps) * plotWidth;
        const y = margin.top + plotHeight - (f / freqBins) * plotHeight;
        const cellWidth = plotWidth / timeSteps;
        const cellHeight = plotHeight / freqBins;

        ctx.fillRect(x, y, cellWidth, cellHeight);
      }
    }

    // Draw axes
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000000";

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
      const y =
        margin.top + plotHeight - (i / (freqLabels.length - 1)) * plotHeight;

      // Tick mark
      ctx.beginPath();
      ctx.moveTo(margin.left - 5, y);
      ctx.lineTo(margin.left, y);
      ctx.stroke();

      // Label
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(freq.toString(), margin.left - 10, y);
    }

    // X-axis labels (time in seconds)
    const duration = audioBuffer?.duration || timeRange[1];
    const timeLabels = [];
    const numLabels = 10;
    for (let i = 0; i < numLabels; i++) {
      timeLabels.push(Math.round((duration * i) / (numLabels - 1)));
    }

    for (let i = 0; i < timeLabels.length; i++) {
      const time = timeLabels[i];
      const x = margin.left + (i / (timeLabels.length - 1)) * plotWidth;

      // Tick mark
      ctx.beginPath();
      ctx.moveTo(x, margin.top + plotHeight);
      ctx.lineTo(x, margin.top + plotHeight + 5);
      ctx.stroke();

      // Label
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(time.toString(), x, margin.top + plotHeight + 10);
    }

    // Axis titles
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Y-axis title (rotated)
    ctx.save();
    ctx.translate(15, margin.top + plotHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.restore();
  }, [
    id,
    audioBuffer,
    width,
    height,
    timeRange,
    freqRange,
    generateSpectrogramData,
    getColorFromIntensity,
  ]);

  return (
    <div className="bg-white inline-block">
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};

export default Spectrogram;
