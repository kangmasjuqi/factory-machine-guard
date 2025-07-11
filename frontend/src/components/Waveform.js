// components/Waveform.js
import { useEffect } from 'react';

const Waveform = ({ id, canvasRef, handleSeek, audioBuffer, currentTime, duration }) => {
  useEffect(() => {
    if (!canvasRef.current || !audioBuffer) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#2777b4';
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;

      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }

      const y1 = (1 + min) * amp;
      const y2 = (1 + max) * amp;
      ctx.fillRect(i, y1, 1, y2 - y1);
    }

    // Draw progress
    if (duration > 0) {
      const progress = (currentTime / duration) * width;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(progress, 0, 2, height);
    }
  }, [audioBuffer, currentTime, duration, canvasRef]);

  return (
    <div className="bg-white-100 rounded-lg p-2">
      <div className="flex items-center">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-32 pr-2 text-xs text-gray-500 font-mono">
          <span>AMP</span>
          <span>0.75</span>
          <span>0.50</span>
          <span>0.25</span>
          <span>0.0</span>
          <span>-0.25</span>
          <span>-0.50</span>
          <span>-0.75</span>
        </div>

        {/* Waveform Canvas */}
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width={800}
            height={360}
            className="w-full h-32 bg-white rounded border cursor-pointer"
            onClick={handleSeek}
          />
        </div>
      </div>

      {!audioBuffer && (
        <div className="text-sm text-gray-500 mt-2">
          Waveform visualization could not be loaded, but audio playback should still work.
        </div>
      )}
    </div>
  );
};

export default Waveform;
