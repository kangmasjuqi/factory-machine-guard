import React from 'react';

const AnomalyListItem = ({
    selectedAnomaly, onAnomalySelect,
    formatDateTime, anomaly,
    index, newAlertsCount,
    isAnomalySelected}) => {

  return (
    <div
        key={anomaly.id}
        className={`p-4 mb-3 rounded border cursor-pointer transition-colors ${
        isAnomalySelected(anomaly)
            ? 'border-blue-500'
            : 'border-gray-200 hover:bg-gray-50'
        }`}
        onClick={() => onAnomalySelect(anomaly)}
    >
        <div className="flex items-start gap-3">
        {index < newAlertsCount ? (
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
        ) : (
            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
        )}
        <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">ID #{String(anomaly.id).padStart(8, '0')}</span>
                <div
                    className={`px-2 py-1 rounded-full text-xs text-white ${
                        anomaly.anomaly_type === 'Mild'
                        ? 'bg-green-500'
                        : anomaly.anomaly_type === 'Moderate'
                        ? 'bg-amber-500'
                        : anomaly.anomaly_type === 'Severe'
                        ? 'bg-red-500'
                        : 'bg-gray-400'
                    }`}
                    >
                    {anomaly.anomaly_type}
                </div>
            </div>
            <div className="text-sm font-semibold text-gray-800 mb-1">
            Unknown Anomaly
            </div>
            <div className="text-sm text-gray-600 mb-1">
            Detected at {formatDateTime && formatDateTime(anomaly.created_at || anomaly.detected_at)}
            </div>
            <div className="text-sm text-blue-600">
            {anomaly.machine}
            </div>
        </div>
        </div>
    </div>
  );
};

export default AnomalyListItem;