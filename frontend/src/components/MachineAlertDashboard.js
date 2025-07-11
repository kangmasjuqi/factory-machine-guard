import React, { useState } from 'react';
import { Settings, Bell, User, ChevronDown, ChevronLeft, Play, Volume2 } from 'lucide-react';
import AnomalyList from './AnomalyList';
import AnomalyDetail from './AnomalyDetail';
import { updateAnomaly} from '../api';

const MachineAlertDashboard = () => {
  const [selectedAlert, setSelectedAlert] = useState(0);
  const [suspectedReason, setSuspectedReason] = useState('Unknown Anomally');
  const [actionRequired, setActionRequired] = useState('Select Action');
  const [comments, setComments] = useState('');
  const [refreshList, setRefreshList] = useState(0);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
    
    const handleAnomalyUpdate = async (updatedAnomaly) => {
        if (!updatedAnomaly) {
            console.error('No anomaly data provided for update.');
            return;
        }

        try {
            console.log('Updating anomaly:', updatedAnomaly);
            await updateAnomaly(updatedAnomaly);
            console.log('Anomaly updated successfully.');

            // Trigger a refresh of the list
            setRefreshList(prev => prev + 1);
        } catch (error) {
            console.error('Update failed:', error);
            // Optionally, you can show a user-friendly message here
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);

        const pad = (n) => n.toString().padStart(2, '0');

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="font-bold text-xl text-gray-800">GROUNDUP.AI</div>
            <nav className="flex items-center gap-6">
              <span className="text-sm text-gray-600">DASHBOARD</span>
              <div className="relative">
                <span className="text-sm text-gray-600">ALERTS</span>
                <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-blue-500"></div>
              </div>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Settings className="w-5 h-5 text-gray-600" />
            <User className="w-5 h-5 text-gray-600" />
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">2</div>
            </div>
            <div className="h-4 w-px bg-gray-400"></div>
            <span className="text-sm text-gray-600">Welcome Admin!</span>
          </div>
        </div>
      </div>

        <div className="flex bg-white">

            <AnomalyList 
                  selectedAnomaly={selectedAnomaly}
                  onAnomalySelect={setSelectedAnomaly}
                  refreshTrigger={refreshList}
                  formatDateTime={formatDateTime}
            />

            <AnomalyDetail 
                  anomaly={selectedAnomaly}
                  onUpdate={handleAnomalyUpdate}
                  formatDateTime={formatDateTime}                  
            />

        </div>
    </div>
  );
};

export default MachineAlertDashboard;