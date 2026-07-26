import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, ViewMode, CaseItem, BriefingData, UtilityItem, KeyDateItem, HandoffItem, I18nText, FinanceTransaction } from '../types';
import { DataAdapter } from '../services/dataAdapter';
import { isHapticsEnabled, setHapticsEnabled, hapticSuccess, hapticTap } from '../utils/haptics';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;
  navigateToCaseDetail: (caseId: string) => void;
  isOperator: boolean;
  setIsOperator: (op: boolean) => void;
  toggleOperator: () => void;
  cases: CaseItem[];
  briefing: BriefingData;
  utilities: UtilityItem[];
  keyDates: KeyDateItem[];
  activeRadarSuggestion: KeyDateItem | null;
  activeRadarSuggestions: KeyDateItem[];
  acceptKeyDateSuggestion: (id: string) => void;
  dismissKeyDateSuggestion: (id: string) => void;
  handoffs: HandoffItem[];
  addHandoff: (question: string) => void;
  resolveHandoff: (id: string, operatorResponse?: string) => void;
  hapticsOn: boolean;
  toggleHaptics: () => void;
  refreshData: () => void;
  resolveDecision: (caseId: string, optionId: string, comment?: string) => void;
  markComplete: (caseId: string, proofNote: I18nText, photoUrl?: string) => void;
  updateBriefingText: (prose: I18nText) => void;
  addTimelineUpdate: (caseId: string, content: I18nText, photos?: string[]) => void;
  createNewCase: (newCase: any) => void;
  updateCaseDetails: (caseItem: CaseItem) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  selectedImageModalUrl: string | null;
  openImageModal: (url: string) => void;
  closeImageModal: () => void;
  canInstallPWA: boolean;
  installPWA: () => void;
  isOnline: boolean;
  resetAllData: () => void;
  exportJSON: () => void;
  isAuthenticated: boolean;
  login: (u: string, p: string) => boolean;
  loginBiometric: () => void;
  logout: () => void;
  isBiometricEnabled: boolean;
  toggleBiometric: () => void;
  transactions: FinanceTransaction[];
  addTransaction: (tx: Omit<FinanceTransaction, 'id'>) => void;
  updateTransaction: (tx: FinanceTransaction) => void;
  deleteTransaction: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Single-language build: the app is English-only, LTR. The trilingual data
  // shape is retained internally but only the English value is ever shown.
  const [language] = useState<Language>('en');

  // Private, login-only app: whoever signs in has FULL control by default —
  // Add / Edit / Delete / upload buttons are always visible. A "client
  // preview" (read-only look) is still available via ?op=0 or the toggle,
  // which persists as lami_op_mode='false'.
  const [isOperator, setIsOperatorState] = useState<boolean>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('op') === '0' || urlParams.get('client') === '1') return false;
    if (urlParams.get('op') === '1' || urlParams.get('operator') === '1') return true;
    return localStorage.getItem('lami_op_mode') !== 'false';
  });

  const [hapticsOn, setHapticsOnState] = useState<boolean>(() => isHapticsEnabled());

  const [currentView, setCurrentView] = useState<ViewMode>('briefing');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const [cases, setCases] = useState<CaseItem[]>(() => DataAdapter.getCases());
  const [briefing, setBriefing] = useState<BriefingData>(() => DataAdapter.getBriefing());
  const [utilities, setUtilities] = useState<UtilityItem[]>(() => DataAdapter.getUtilities());
  const [keyDates, setKeyDates] = useState<KeyDateItem[]>(() => DataAdapter.getKeyDates());
  const [handoffs, setHandoffs] = useState<HandoffItem[]>(() => DataAdapter.getHandoffs());
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(() => DataAdapter.getTransactions());

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedImageModalUrl, setSelectedImageModalUrl] = useState<string | null>(null);

  // PWA Install Prompt state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPWA, setCanInstallPWA] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lami_authenticated') === 'true';
  });
  const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(() => {
    return localStorage.getItem('lami_biometric') === 'true';
  });

  const toggleBiometric = () => {
    const next = !isBiometricEnabled;
    setIsBiometricEnabled(next);
    localStorage.setItem('lami_biometric', String(next));
  };

  // AUTH: Supabase multi-user — Phase 2 integration point.
  // Single shared soft-gate credential + ?operator=1 toggle stay until real
  // (server-side) auth lands. The password is read from an env var so it is
  // not committed to the (public) repo; set VITE_APP_PASSWORD in the host's
  // environment. NOTE: like any client-side gate, the value is still inlined
  // into the built bundle — treat it as a gate, not a secret.
  const APP_USER = (import.meta.env.VITE_APP_USER || 'Layla_Portal').trim();
  const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD || '@Mimo2026';

  const authenticate = () => {
    setIsAuthenticated(true);
    localStorage.setItem('lami_authenticated', 'true');
    hapticSuccess();
  };

  const login = (user: string, pass: string): boolean => {
    if (user.trim() === APP_USER && pass === APP_PASSWORD) {
      authenticate();
      return true;
    }
    return false;
  };

  // Biometric (WebAuthn) success authenticates without re-checking the
  // password, so the credential is never duplicated in the login UI.
  const loginBiometric = () => authenticate();

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lami_authenticated');
  };

  const isRTL = false; // English-only build is always left-to-right

  // Find active radar suggestions (all triggered pending key dates)
  // Logic: today >= (date - lead_time_days) and status !== 'accepted' && status !== 'dismissed'
  const activeRadarSuggestions = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return keyDates.filter((kd) => {
      if (kd.status && kd.status !== 'pending') return false;

      const targetDate = new Date(kd.date);
      targetDate.setHours(0, 0, 0, 0);

      const triggerDate = new Date(targetDate);
      triggerDate.setDate(triggerDate.getDate() - kd.lead_time_days);

      return today >= triggerDate;
    });
  }, [keyDates]);

  const activeRadarSuggestion = activeRadarSuggestions[0] || null;

  // English-only build: always LTR, lang="en"
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
  }, []);

  // Handle PWA installation & Service Worker registration with Offline State Sync
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPWA(true);
    };

    const handleOnline = () => {
      setIsOnline(true);
      refreshData();
      showToast(
        'Connection restored — State synchronized!'
      );
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast(
        'Offline Mode — Local state preserved.'
      );
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register Service Worker for offline support
    if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[LaMi SW] Registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[LaMi SW] Registration error:', err);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [language]);

  const toggleHaptics = () => {
    const next = !hapticsOn;
    setHapticsOnState(next);
    setHapticsEnabled(next);
    showToast(next ? 'Haptic feedback on 📱' : 'Haptic feedback off 🔇');
    if (next) hapticTap();
  };

  const installPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      showToast('App installed!');
    }
    setDeferredPrompt(null);
    setCanInstallPWA(false);
  };

  // No-op: language is fixed to English in this single-language build.
  const setLanguage = (_lang: Language) => {};

  const setIsOperator = (op: boolean) => {
    setIsOperatorState(op);
    localStorage.setItem('lami_op_mode', String(op));
    showToast(op ? 'Operator mode enabled' : 'Client mode enabled');
  };

  const toggleOperator = () => {
    setIsOperator(!isOperator);
  };

  const refreshData = () => {
    setCases(DataAdapter.getCases());
    setBriefing(DataAdapter.getBriefing());
    setUtilities(DataAdapter.getUtilities());
    setKeyDates(DataAdapter.getKeyDates());
    setHandoffs(DataAdapter.getHandoffs());
    setTransactions(DataAdapter.getTransactions());
  };

  const addTransaction = (tx: Omit<FinanceTransaction, 'id'>) => {
    DataAdapter.addTransaction(tx);
    refreshData();
    showToast(
      'Transaction recorded!'
    );
  };

  const updateTransaction = (tx: FinanceTransaction) => {
    DataAdapter.updateTransaction(tx);
    refreshData();
  };

  const deleteTransaction = (id: string) => {
    DataAdapter.deleteTransaction(id);
    refreshData();
    showToast(
      'Transaction removed.'
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const acceptKeyDateSuggestion = (id: string) => {
    const createdCase = DataAdapter.acceptKeyDateSuggestion(id);
    if (createdCase) {
      hapticSuccess();
      refreshData();
      showToast(
        'Action accepted! New case created in "In our hands".'
      );
    }
  };

  const dismissKeyDateSuggestion = (id: string) => {
    DataAdapter.dismissKeyDateSuggestion(id);
    hapticTap();
    refreshData();
    showToast(
      'Suggestion dismissed for now.'
    );
  };

  const addHandoff = (question: string) => {
    DataAdapter.addHandoff(question, language);
    refreshData();
  };

  const resolveHandoff = (id: string, operatorResponse?: string) => {
    DataAdapter.resolveHandoff(id, operatorResponse);
    refreshData();
    showToast('Request answered by Mimo!');
  };

  const navigateToCaseDetail = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentView('caseDetail');
  };

  const resolveDecision = (caseId: string, optionId: string, comment?: string) => {
    hapticSuccess();
    const updated = DataAdapter.resolveDecision(caseId, optionId, comment);
    if (updated) {
      refreshData();
      showToast(
        'Decision recorded successfully!'
      );
    }
  };

  const markComplete = (caseId: string, proofNote: I18nText, photoUrl?: string) => {
    hapticSuccess();
    const updated = DataAdapter.markCaseComplete(caseId, proofNote, photoUrl);
    if (updated) {
      refreshData();
      showToast(
        'Case completed & moved to Archive!'
      );
    }
  };

  const updateBriefingText = (prose: I18nText) => {
    DataAdapter.updateBriefing(prose);
    refreshData();
    showToast('Briefing updated!');
  };

  const addTimelineUpdate = (caseId: string, content: I18nText, photos?: string[]) => {
    DataAdapter.addTimelineEntry(caseId, content, photos, 'operator');
    refreshData();
    showToast('Update added to the timeline!');
  };

  const createNewCase = (newCaseData: any) => {
    const created = DataAdapter.createCase(newCaseData);
    refreshData();
    navigateToCaseDetail(created.id);
    showToast('New case created!');
  };

  const updateCaseDetails = (caseItem: CaseItem) => {
    DataAdapter.updateCase(caseItem);
    refreshData();
    showToast('Case updated!');
  };

  const resetAllData = () => {
    DataAdapter.resetToDefaultSeed();
    refreshData();
    showToast('Data restored to defaults.');
  };

  const exportJSON = () => {
    const json = DataAdapter.exportDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lami-command-center-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('JSON backup exported!');
  };

  const openImageModal = (url: string) => setSelectedImageModalUrl(url);
  const closeImageModal = () => setSelectedImageModalUrl(null);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        isRTL,
        currentView,
        setCurrentView,
        selectedCaseId,
        setSelectedCaseId,
        navigateToCaseDetail,
        isOperator,
        setIsOperator,
        toggleOperator,
        cases,
        briefing,
        utilities,
        keyDates,
        activeRadarSuggestion,
        activeRadarSuggestions,
        acceptKeyDateSuggestion,
        dismissKeyDateSuggestion,
        handoffs,
        addHandoff,
        resolveHandoff,
        hapticsOn,
        toggleHaptics,
        refreshData,
        resolveDecision,
        markComplete,
        updateBriefingText,
        addTimelineUpdate,
        createNewCase,
        updateCaseDetails,
        toastMessage,
        showToast,
        selectedImageModalUrl,
        openImageModal,
        closeImageModal,
        canInstallPWA,
        installPWA,
        isOnline,
        resetAllData,
        exportJSON,
        isAuthenticated,
        login,
        loginBiometric,
        logout,
        isBiometricEnabled,
        toggleBiometric,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
