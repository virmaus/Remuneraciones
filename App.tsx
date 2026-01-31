
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import TopBar from './components/TopBar.tsx';
import Dashboard from './views/Dashboard.tsx';
import CompanyForm from './views/CompanyForm.tsx';
import WorkerList from './views/WorkerList.tsx';
import Centralization from './views/Centralization.tsx';
import MonthlyParameters from './views/MonthlyParameters.tsx';
import CostCenterList from './views/CostCenterList.tsx';
import ContractTypeList from './views/ContractTypeList.tsx';
import TerminationCauseList from './views/TerminationCauseList.tsx';
import ConceptList from './views/ConceptList.tsx';
import MonthlyMovementView from './views/MonthlyMovement.tsx';
import PayrollCalculation from './views/PayrollCalculation.tsx';
import PayslipList from './views/PayslipList.tsx';
import ReportsView from './views/Reports.tsx';
import { CheckCircle, XCircle, Database, RefreshCw, AlertTriangle, Download, Monitor } from 'lucide-react';
import { MOCK_WORKERS, MOCK_COMPANY, MOCK_COST_CENTERS, MOCK_CONTRACT_TYPES, MOCK_TERMINATION_CAUSES, MOCK_CONCEPTS } from './constants.tsx';
import { Worker, Company, CostCenter, ContractType, TerminationCause, PayrollConcept } from './types.ts';
import { getAllData } from './db.ts';

const APP_VERSION = "2.6.5"; 
const GITHUB_REPO_URL = "https://github.com/virmaus/Remuneraciones";

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface PayrollPeriod {
  month: number;
  year: number;
}

interface PayrollContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  workers: Worker[];
  setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
  company: Company;
  setCompany: React.Dispatch<React.SetStateAction<Company>>;
  costCenters: CostCenter[];
  setCostCenters: React.Dispatch<React.SetStateAction<CostCenter[]>>;
  contractTypes: ContractType[];
  setContractTypes: React.Dispatch<React.SetStateAction<ContractType[]>>;
  terminationCauses: TerminationCause[];
  setTerminationCauses: React.Dispatch<React.SetStateAction<TerminationCause[]>>;
  concepts: PayrollConcept[];
  setConcepts: React.Dispatch<React.SetStateAction<PayrollConcept[]>>;
  currentPeriod: PayrollPeriod;
  setCurrentPeriod: (period: PayrollPeriod) => void;
  dbStatus: 'connecting' | 'connected' | 'error' | 'offline';
  updateAvailable: boolean;
  checkUpdates: () => Promise<void>;
  appVersion: string;
  installApp: () => void;
  isInstallable: boolean;
}

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

export const usePayroll = () => {
  const context = useContext(PayrollContext);
  if (!context) throw new Error("usePayroll must be used within PayrollProvider");
  return context;
};

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error' | 'offline'>('connecting');
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  const [workers, setWorkers] = useState<Worker[]>(MOCK_WORKERS as any);
  const [company, setCompany] = useState<Company>(MOCK_COMPANY);
  const [costCenters, setCostCenters] = useState<CostCenter[]>(MOCK_COST_CENTERS);
  const [contractTypes, setContractTypes] = useState<ContractType[]>(MOCK_CONTRACT_TYPES);
  const [terminationCauses, setTerminationCauses] = useState<TerminationCause[]>(MOCK_TERMINATION_CAUSES);
  const [concepts, setConcepts] = useState<PayrollConcept[]>(MOCK_CONCEPTS);
  
  const [currentPeriod, setCurrentPeriodState] = useState<PayrollPeriod>(() => {
    try {
      const saved = localStorage.getItem('payroll_period');
      return saved ? JSON.parse(saved) : { month: new Date().getMonth(), year: new Date().getFullYear() };
    } catch {
      return { month: 0, year: 2024 };
    }
  });

  // Manejo de instalación PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const checkUpdates = async () => {
    if (!navigator.onLine) return;
    try {
      const response = await fetch('https://raw.githubusercontent.com/virmaus/Remuneraciones/main/App.tsx', { cache: 'no-store' });
      if (response.ok) {
        const content = await response.text();
        const match = content.match(/const APP_VERSION = "(.*?)"/);
        if (match && match[1] !== APP_VERSION) {
          setUpdateAvailable(true);
        }
      }
    } catch (e) {
      console.warn("Error verificando versión remota.");
    }
  };

  useEffect(() => {
    const loadDB = async () => {
      try {
        setDbStatus('connecting');
        const [w, c, cc, ct, tc, cp] = await Promise.all([
          getAllData('workers').catch(() => []),
          getAllData('company').catch(() => []),
          getAllData('costCenters').catch(() => []),
          getAllData('contractTypes').catch(() => []),
          getAllData('terminationCauses').catch(() => []),
          getAllData('concepts').catch(() => [])
        ]);

        if (w?.length) setWorkers(w);
        if (c?.length) setCompany(c[0]);
        if (cc?.length) setCostCenters(cc);
        if (ct?.length) setContractTypes(ct);
        if (tc?.length) setTerminationCauses(tc);
        if (cp?.length) setConcepts(cp);

        setDbStatus('connected');
      } catch (err) {
        setDbStatus('offline');
      }
    };
    loadDB();
    checkUpdates();
  }, []);

  const setCurrentPeriod = (period: PayrollPeriod) => {
    setCurrentPeriodState(period);
    try { localStorage.setItem('payroll_period', JSON.stringify(period)); } catch {}
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  return (
    <PayrollContext.Provider value={{ 
      showToast, workers, setWorkers, company, setCompany, 
      costCenters, setCostCenters, contractTypes, setContractTypes,
      terminationCauses, setTerminationCauses, concepts, setConcepts,
      currentPeriod, setCurrentPeriod, dbStatus, 
      updateAvailable, checkUpdates, appVersion: APP_VERSION,
      installApp, isInstallable
    }}>
      <Router>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/archivo/empresa" element={<CompanyForm />} />
                  <Route path="/archivo/trabajadores" element={<WorkerList />} />
                  <Route path="/archivo/costos" element={<CostCenterList />} />
                  <Route path="/archivo/contratos" element={<ContractTypeList />} />
                  <Route path="/archivo/causales" element={<TerminationCauseList />} />
                  <Route path="/archivo/haberes" element={<ConceptList />} />
                  <Route path="/movimientos/parametros" element={<MonthlyParameters />} />
                  <Route path="/movimientos/mensual" element={<MonthlyMovementView />} />
                  <Route path="/movimientos/calculo" element={<PayrollCalculation />} />
                  <Route path="/liquidaciones" element={<PayslipList />} />
                  <Route path="/informes" element={<ReportsView />} />
                  <Route path="/centralizacion" element={<Centralization />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </main>
          </div>
          
          <div className="fixed bottom-4 left-6 z-[60] flex items-center gap-3 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-xl text-[10px] font-bold tracking-wider">
            <div className="flex items-center gap-2 pr-3 border-r border-gray-100">
               <div className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></div>
               <span className="text-gray-500 uppercase">OFFLINE OK</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
               <span className="bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-tight font-black">v{APP_VERSION}</span>
            </div>
            {updateAvailable && (
              <a href={GITHUB_REPO_URL} target="_blank" className="flex items-center gap-1.5 px-3 py-0.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 animate-pulse">
                <AlertTriangle size={10} /> REVISAR REPOSITORIO
              </a>
            )}
          </div>

          <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
            {toasts.map(t => (
              <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right-full ${t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                {t.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                <span className="text-sm font-medium">{t.message}</span>
              </div>
            ))}
          </div>
        </div>
      </Router>
    </PayrollContext.Provider>
  );
};

export default App;
