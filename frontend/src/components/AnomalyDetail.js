// src/components/AnomalyDetail.js
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';

const AnomalyDetail = ({ 
  anomaly, 
  onUpdate,
  formatDateTime
}) => {
  const [suspectedReason, setSuspectedReason] = useState('Unknown Anomaly');
  const [actionRequired, setActionRequired] = useState('Select Action');
  const [comments, setComments] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [warning, setWarning] = useState('');
    const [success, setSuccess] = useState('');

  // Initialize form values when anomaly data changes
  useEffect(() => {
    if (anomaly) {
      setSuspectedReason(anomaly.suspected_reason || 'Unknown Anomaly');
      setActionRequired(anomaly.action_required || 'Select Action');
      setComments(anomaly.comments || '');
    }
  }, [anomaly]);

const handleUpdate = async () => {
  if (!anomaly || !onUpdate) return;

  // Check if any field is empty
  if (!suspectedReason || !actionRequired || !comments.trim()) {
    setWarning('Please fill in all fields before updating.');
    return;
  }

  // Check if any field is empty
  if (suspectedReason === 'Unknown Anomaly' || actionRequired === 'Select Action') {
    setWarning('Please fill in all fields correctly before updating.');
    return;
  }

  setSuccess('');
  setWarning('');
  setIsUpdating(true);

  try {
    const updatedData = {
      ...anomaly,
      suspected_reason: suspectedReason,
      action_required: actionRequired,
      comments: comments,
      updated_at: new Date().toISOString()
    };

    await onUpdate(updatedData);

    setSuspectedReason('Unknown Anomaly');
    setActionRequired('Select Action');
    setComments('');
    setSuccess('Anomaly updated successfully.');
  } catch (error) {
    console.error('Failed to update anomaly:', error);
  } finally {
    setIsUpdating(false);
  }
};



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
                Alert ID #{String(anomaly.id).padStart(8, '0')}
            </h1>
            <p className="text-sm text-gray-500 ml-4">
                Detected at {formatDateTime(anomaly.created_at || anomaly.detected_at)}
            </p>
            </div>
        </div>
        </div>

      {/* Audio Detail */}
      <div className="bg-white shadow-sm  p-2">

        <hr className="border-t border-gray-300 p-4" />

        <AudioVisualizer anomaly={anomaly} audioPath={`http://localhost:4000/audios/${anomaly.sound_clip}`} />              
              
        {/* Alert Details Form */}
        <div className="p-6 grid grid-cols-2 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Equipment
                        </label>
                        <div className="text-sm rounded">
                        {anomaly.machine || 'Unknown Equipment'}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Suspected Reason
                        </label>
                        <div className="relative">
                        <select
                            value={suspectedReason}
                            onChange={(e) => setSuspectedReason(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm appearance-none bg-white"
                        >
                            <option value="">Unknown Anomaly</option>
                            <option value="Spindle Error">[CNC] Spindle Error</option>
                            <option value="Axis Problem">[CNC] Axis Problem</option>
                            <option value="Machine Crash">[Milling] Machine Crash</option>
                            <option value="Router Fault">[Milling] Router Fault</option>
                            <option value="Normal">Normal</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-600 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Action Required
                        </label>
                        <div className="relative">
                        <select
                            value={actionRequired}
                            onChange={(e) => setActionRequired(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm appearance-none bg-white"
                        >
                            <option value="">Select Action</option>
                            <option value="immediate">Immediate</option>
                            <option value="later">Later</option>
                            <option value="no action">No Action</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-600 pointer-events-none" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Comments
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded text-sm h-24 resize-none"
                        />
                    </div>

                    <div className="mt-2">
                        {warning && (
                        <div className="mb-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                            {warning}
                        </div>
                        )}
                        {success && (
                        <div className="mb-2 text-sm text-green-700 bg-green-50 p-3 rounded border border-green-200">
                            ✅ {success}
                        </div>
                        )}
                          <button
                            onClick={handleUpdate}
                            disabled={isUpdating}
                            className="bg-update-button text-white px-6 py-2 rounded text-sm font-semibold hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? 'UPDATING...' : 'UPDATE'}
                        </button>
                    </div>                      
                      
                </div>

        </div>
              
      </div>
    </div>
  );
};

export default AnomalyDetail;