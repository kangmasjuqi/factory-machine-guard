// src/components/AnomalyDetail.js
import React from "react";
import AudioVisualizer from "./AudioVisualizer";
import AnomalyUpdateForm from "./AnomalyUpdateForm";

const AnomalyDetail = ({ anomaly, onUpdate, formatDateTime }) => {
  if (!anomaly) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-gray-500">
            <h2 className="text-xl font-semibold mb-2">No Anomaly Selected</h2>
            <p>Please select an anomaly from the list to view details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-white ">
      {/* Alert Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between ml-4">
          <div>
            <h1 className="text-2xl font-normal text-gray-600 mb-2 ml-4">
              Alert ID #{String(anomaly.id).padStart(8, "0")}
            </h1>
            <p className="text-sm text-gray-500 ml-4">
              Detected at{" "}
              {formatDateTime(anomaly.created_at || anomaly.detected_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Audio Detail */}
      <div className="bg-white shadow-sm  p-2">
        <hr className="border-t border-gray-300 p-4" />

        <AudioVisualizer
          anomaly={anomaly}
          audioPath={`http://localhost:4000/audios/${anomaly.sound_clip}`}
        />

        <AnomalyUpdateForm anomaly={anomaly} onUpdate={onUpdate} />
      </div>
    </div>
  );
};

export default AnomalyDetail;
