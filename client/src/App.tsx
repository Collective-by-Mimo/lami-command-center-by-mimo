/**
 * LaMi Command Center — Quiet Luxury Concierge
 * Cream #F7F5F1 bg · teal #145A52/#0E3F3A · gold #B8912E accents · Cormorant + Inter
 */
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { BriefingScreen } from './components/BriefingScreen';
import { CasesScreen } from './components/CasesScreen';
import { CaseDetailScreen } from './components/CaseDetailScreen';
import { ArchiveScreen } from './components/ArchiveScreen';
import { UtilitiesPanel } from './components/UtilitiesPanel';
import { ContactsScreen } from './components/ContactsScreen';
import { ConnectionsScreen } from './components/ConnectionsScreen';
import { FinanceScreen } from './components/FinanceScreen';
import { OperatorPanel } from './components/OperatorPanel';
import { ProofModal } from './components/ProofModal';
import { ConciergeAI } from './components/ConciergeAI';
import { Toast } from './components/Toast';
import { LoginScreen } from './components/LoginScreen';
import { InstallBanner } from './components/InstallBanner';
import { AnimatePresence, motion } from 'motion/react';

const VIEW_ORDER = ['briefing', 'contacts', 'connections', 'cases', 'finance', 'utilities', 'archive'];

const MainContent: React.FC = () => {
  const { currentView, isAuthenticated, isOperator, language } = useApp();
  const prevViewRef = React.useRef(currentView);
  const [direction, setDirection] = React.useState(0);

  React.useEffect(() => {
    const prevIdx = VIEW_ORDER.indexOf(prevViewRef.current === 'caseDetail' ? 'cases' : prevViewRef.current);
    const curIdx = VIEW_ORDER.indexOf(currentView === 'caseDetail' ? 'cases' : currentView);
    setDirection(curIdx >= prevIdx ? 1 : -1);
    prevViewRef.current = currentView;
  }, [currentView]);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'briefing': return <BriefingScreen />;
      case 'cases': return <CasesScreen />;
      case 'caseDetail': return <CaseDetailScreen />;
      case 'archive': return <ArchiveScreen />;
      case 'utilities': return <UtilitiesPanel />;
      case 'contacts': return <ContactsScreen />;
      case 'connections': return <ConnectionsScreen />;
      case 'finance': return <FinanceScreen />;
      default: return <BriefingScreen />;
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#F7F5F1] text-[#1A1A1A] font-sans flex flex-col selection:bg-[#145A52]/20 ${
        isOperator ? 'operator-frame' : ''
      }`}
    >
      <Header />
      <main className="flex-1 max-w-2xl w-full mx-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${currentView}-${language}`}
            initial={{ opacity: 0, x: currentView === 'caseDetail' ? 0 : 24 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: currentView === 'caseDetail' ? 0 : -24 * direction }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
        <OperatorPanel />
      </main>
      <ConciergeAI />
      <Navbar />
      <ProofModal />
      <Toast />
      <InstallBanner />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
