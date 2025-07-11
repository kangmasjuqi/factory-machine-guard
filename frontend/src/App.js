// src/App.js
import React, { useState } from 'react';
import Auth from './components/Auth';

import MachineAlertDashboard from './components/MachineAlertDashboard';

import { LogOut } from 'lucide-react'; // Icon

function App() {
    // Check localStorage for a token to determine initial login state
    // TODO: tmp we set TRUE, in real world should be check from token
  const [isLoggedIn, setIsLoggedIn] = useState(true);  //useState(!!localStorage.getItem('token'));

    // Trigger a refresh for AnomalyList when a anomalies is added/deleted
  const [refreshList, setRefreshList] = useState(0);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setIsLoggedIn(false); // Update login state
  };

    // {isLoggedIn && (
    //   <button
    //     onClick={handleLogout}
    //     className="flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    //   >
    //     <LogOut className="h-5 w-5 mr-2" /> Logout
    //   </button>
    // )}


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <main>
        {!isLoggedIn ? (
          // Show authentication form if not logged in
          <Auth setIsLoggedIn={setIsLoggedIn} />
        ) : (
          // Show main application content if logged in
          <div className="space-y-8">
            {/* Machine Alert Dashboard */}
            <div className="bg-white">
                <MachineAlertDashboard refreshTrigger={refreshList} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;