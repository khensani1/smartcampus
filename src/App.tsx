/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shell } from './components/layout/Shell';
import { Dashboard } from './pages/Dashboard';
import { Recommendations } from './pages/Recommendations';
import { CampusMap } from './components/navigation/CampusMap';
import { Directory } from './pages/Directory';
import { Analytics } from './pages/Analytics';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'recommendations':
        return <Recommendations />;
      case 'map':
        return <div className="h-full"><CampusMap /></div>;
      case 'directory':
        return <Directory />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Shell activeId={activeTab} onNavigate={setActiveTab}>
      {renderContent()}
    </Shell>
  );
}
