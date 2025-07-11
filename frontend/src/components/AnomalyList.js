import React, { useEffect, useState } from 'react';
import { getAnomalies} from '../api';
import { ChevronDown, ChevronLeft } from 'lucide-react';

const AnomalyList = ({ selectedAnomaly, onAnomalySelect, refreshTrigger, formatDateTime }) => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('All Equipment');

  const fetchAnomalies = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAnomalies();
      setAnomalies(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch anomalies.');
    } finally {
      setLoading(false);
    }
  };

  // Fix: Add dependency array to prevent infinite loop
  useEffect(() => {
    fetchAnomalies();
  }, [refreshTrigger]); // Only run when refreshTrigger changes

  // Get unique equipment types for filter dropdown
  const equipmentTypes = ['All Equipment', ...new Set(anomalies.map(a => a.machine))];
  
  // Filter anomalies based on equipment selection
  const filteredAnomalies = equipmentFilter === 'All Equipment' 
    ? anomalies 
    : anomalies.filter(a => a.machine === equipmentFilter);

  // Count new alerts (assuming recent ones are "new")
  const newAlertsCount = Math.min(2, filteredAnomalies.length);

  // Helper function to check if an anomaly is selected
  const isAnomalySelected = (anomaly) => {
    return selectedAnomaly && selectedAnomaly.id === anomaly.id;
  };
    
  if (loading) return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex justify-center items-center">
      <div className="text-gray-600">Loading anomalies...</div>
    </div>
  );

  if (error) return (
    <div className="w-80 bg-white border-r border-gray-200 h-full p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center" role="alert">
        {error}
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* Equipment Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <select 
            className="w-full p-2 border border-gray-300 rounded text-sm appearance-none bg-white"
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
          >
            {equipmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-600 pointer-events-none" />
        </div>
      </div>

      {/* Back Button */}
      <div className="p-4 border-b border-gray-200">
        <button className="flex items-center gap-2 text-sm text-gray-800 hover:text-gray-600">
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Alert Summary */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{filteredAnomalies.length} Alerts</span>
          {newAlertsCount > 0 && (
            <div className="bg-blue-alert text-white px-2 py-1 rounded-full text-xs">
              {newAlertsCount} New
            </div>
          )}
        </div>
      </div>

      {/* Alert List */}
      <div className="p-4">
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-md mb-4 text-sm" role="alert">
            {message}
          </div>
        )}
        
        {filteredAnomalies.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No anomalies found.</p>
        ) : (
          filteredAnomalies.map((anomaly, index) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default AnomalyList;