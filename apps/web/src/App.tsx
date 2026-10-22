import React, { useState } from 'react';
import { SparkleProvider, useSparkle } from './context/SparkleContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { RightSecondaryWidgets } from './components/layout/RightSecondaryWidgets';
import { BottomNav } from './components/layout/BottomNav';
import { FeedScreen } from './components/screens/FeedScreen';
import { GigsScreen } from './components/screens/GigsScreen';
import { CommunitiesScreen } from './components/screens/CommunitiesScreen';
import { EventsScreen } from './components/screens/EventsScreen';
import { MessagesScreen } from './components/screens/MessagesScreen';
import { AcademicsScreen } from './components/screens/AcademicsScreen';
import { AuthModal } from './components/modals/AuthModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { CreatePostModal } from './components/modals/CreatePostModal';
import { CreateGigModal } from './components/modals/CreateGigModal';
import { ApplyGigModal } from './components/modals/ApplyGigModal';
import { NotificationsDrawer } from './components/modals/NotificationsDrawer';
import { UniversitySearchModal } from './components/modals/UniversitySearchModal';
import { CampusMapModal } from './components/modals/CampusMapModal';
import { Gig } from './types/models';

const MainLayout: React.FC = () => {
  const { activeTab, setSelectedUniversityId } = useSparkle();

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateGigOpen, setIsCreateGigOpen] = useState(false);
  const [selectedGigToApply, setSelectedGigToApply] = useState<Gig | null>(null);
  const [isUniversitySearchOpen, setIsUniversitySearchOpen] = useState(false);
  const [isCampusMapOpen, setIsCampusMapOpen] = useState(false);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedScreen onOpenCreatePost={() => setIsCreatePostOpen(true)} />;
      case 'gigs':
        return (
          <GigsScreen
            onOpenCreateGig={() => setIsCreateGigOpen(true)}
            onApplyGig={(gig) => setSelectedGigToApply(gig)}
          />
        );
      case 'communities':
        return <CommunitiesScreen />;
      case 'events':
        return <EventsScreen />;
      case 'messages':
        return <MessagesScreen />;
      case 'academics':
        return <AcademicsScreen />;
      default:
        return <FeedScreen onOpenCreatePost={() => setIsCreatePostOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] dark:bg-sparkle-darkBg text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-16 md:pb-8 transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar
        onOpenUniversitySearch={() => setIsUniversitySearchOpen(true)}
        onOpenCampusMap={() => setIsCampusMapOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 flex gap-6 items-start">
        {/* Desktop Sidebar */}
        <Sidebar
          onOpenCreatePost={() => setIsCreatePostOpen(true)}
          onOpenCreateGig={() => setIsCreateGigOpen(true)}
        />

        {/* Center Content */}
        <section className="flex-1 min-w-0">
          {renderActiveScreen()}
        </section>

        {/* Android desktop/tablet companion rail: events, gigs, communities and profile shortcuts */}
        <RightSecondaryWidgets />
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals & Drawers */}
      <AuthModal />
      <ProfileModal />
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
      <CreateGigModal
        isOpen={isCreateGigOpen}
        onClose={() => setIsCreateGigOpen(false)}
      />
      <ApplyGigModal
        gig={selectedGigToApply}
        onClose={() => setSelectedGigToApply(null)}
      />
      <NotificationsDrawer />

      {/* University Search Modal */}
      <UniversitySearchModal
        isOpen={isUniversitySearchOpen}
        onClose={() => setIsUniversitySearchOpen(false)}
        onSelectUniversity={(id) => { setSelectedUniversityId(id); setIsUniversitySearchOpen(false); }}
        onOpenMap={() => { setIsUniversitySearchOpen(false); setIsCampusMapOpen(true); }}
      />

      {/* Interactive Campus Map Modal */}
      <CampusMapModal
        isOpen={isCampusMapOpen}
        onClose={() => setIsCampusMapOpen(false)}
        onSelectUniversity={(id) => { setSelectedUniversityId(id); setIsCampusMapOpen(false); }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SparkleProvider>
      <MainLayout />
    </SparkleProvider>
  );
};

export default App;
