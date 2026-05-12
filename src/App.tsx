/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { handleFirestoreError, OperationType } from './lib/firebase-errors';
import { Shell } from './components/layout/Shell';
import { Dashboard } from './pages/Dashboard';
import { Recommendations } from './pages/Recommendations';
import { CampusMap } from './components/navigation/CampusMap';
import { Directory } from './pages/Directory';
import { Analytics } from './pages/Analytics';
import { AuthPage } from './pages/Auth';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mapQuery, setMapQuery] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Fetch profile
        const docRef = doc(db, 'users', u.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${u.uid}`);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-royal" size={48} />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onStartChat={() => setIsChatOpen(true)} 
            onOpenMap={() => {
              setMapQuery(undefined);
              setActiveTab('map');
            }} 
            userProfile={userProfile}
          />
        );
      case 'recommendations':
        return <Recommendations />;
      case 'map':
        return <div className="h-full"><CampusMap prefilledSearch={mapQuery} /></div>;
      case 'directory':
        return (
          <Directory 
            onNavigateToDept={(building) => {
              setMapQuery(building);
              setActiveTab('map');
            }} 
          />
        );
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard 
          onStartChat={() => setIsChatOpen(true)} 
          onOpenMap={() => setActiveTab('map')} 
          userProfile={userProfile}
        />;
    }
  };

  return (
    <Shell 
      activeId={activeTab} 
      onNavigate={setActiveTab}
      isChatOpen={isChatOpen}
      setIsChatOpen={setIsChatOpen}
      userProfile={userProfile}
    >
      {renderContent()}
    </Shell>
  );
}
