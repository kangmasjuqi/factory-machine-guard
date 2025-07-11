import React from 'react';
import AudioPlayerSection from './AudioPlayerSection';

const AudioVisualizer = ({ anomaly, audioPath }) => {
  if (!audioPath) {
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
        <div className="text-gray-600">No audio file provided</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto p-2">
      <AudioPlayerSection
        id="anomaly"
        title="Anomaly Matching Output"
        audioPath={audioPath}
        isDark={false}
        anomaly={anomaly}
      />
      <AudioPlayerSection
        id="normal"
        title="Normal Matching Output"
        audioPath={audioPath}
        isDark={false}
        anomaly={anomaly}
      />
    </div>
  );
};

export default AudioVisualizer;
