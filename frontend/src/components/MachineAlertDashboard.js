import React, { useState } from 'react';
import { Settings, Bell, User } from 'lucide-react';
import AnomalyList from './AnomalyList';
import AnomalyDetail from './AnomalyDetail';
import { updateAnomaly} from '../api';

const MachineAlertDashboard = () => {
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
      <div className="bg-white border-b border-gray-200 px-6" style={{ height: '52px' }}>

        <div className="flex items-center justify-between" style={{ height: '48px' }}>
          <div className="flex items-center gap-8">
            <img src="/logo.svg" alt="GROUNDUP.AI Logo" className="h-8" />
            <nav className="flex items-center gap-6">
                <div className="text-sm text-gray-600">DASHBOARD</div>
                <div className="relative bg-menu-alert px-2 py-2" style={{ borderBottom: '4px solid red' }}>
                    <div className="text-sm text-gray-600">ALERTS</div>
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