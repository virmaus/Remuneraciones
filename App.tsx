
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
import { CheckCircle, AlertTriangle, CloudOff, Globe } from 'lucide-react';
import { MOCK_WORKERS, MOCK_COMPANY, MOCK_COST_CENTERS, MOCK_CONTRACT_TYPES, MOCK_TERMINATION_CAUSES, MOCK_CONCEPTS } from './constants.tsx';
import { Worker, Company, CostCenter, ContractType, TerminationCause, PayrollConcept } from './types.ts';
import { getAllData } from './db.ts';

// IMPORTANTE: Cambia esto por tu repositorio real para la detección
const GITHUB_USER = "tu-usuario";
const GITHUB_REPO = "tu-repositorio";
const APP_VERSION = "3.1.0-LOCAL";

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
  dbStatus: 'connected' | 'offline';
  isOnline: boolean;
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
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline'>('connected');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [workers, setWorkers] = useState<Worker[]>(MOCK_WORKERS as any);
  const [company, setCompany] = useState<Company>(MOCK_COMPANY);
  const [costCenters, setCostCenters] = useState<CostCenter[]>(MOCK_COST_CENTERS);
  const [contractTypes, setContractTypes] = useState<ContractType[]>(MOCK_CONTRACT_TYPES);
  const [terminationCauses, setTerminationCauses] = useState<TerminationCause[]>(MOCK_TERMINATION_CAUSES);
  const [concepts, setConcepts] = useState<PayrollConcept[]>(MOCK_CONCEPTS);
  
  const [currentPeriod, setCurrentPeriodState] = useState<PayrollPeriod>(() => {
    const saved = localStorage.getItem('payroll_period');
    return saved ? JSON.parse(saved) : { month: new Date().getMonth(), year: new Date().getFullYear() };
  });

  // Listener de Red
  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); showToast("Conexión restablecida. Modo sincronización GitHub activo.", "info"); };
    const handleOffline = () => { setIsOnline(false); showToast("Modo Offline activado. Datos locales protegidos.", "info"); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  // Listener de PWA
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  // Cargar datos locales de IndexedDB
  useEffect(() => {
    const loadLocalData = async () => {
      try {
        const [w, c, cc, ct, tc, cp] = await Promise.all([
          getAllData('workers'), getAllData('company'), getAllData('costCenters'),
          getAllData('contractTypes'), getAllData('terminationCauses'), getAllData('concepts')
        ]);
        if (w.length) setWorkers(w);
        if (c.length) setCompany(c[0]);
        if (cc.length) setCostCenters(cc);
        if (ct.length) setContractTypes(ct);
        if (tc.length) setTerminationCauses(tc);
        if (cp.length) setConcepts(cp);
      } catch (e) {
        setDbStatus('offline');
      }
    };
    loadLocalData();
  }, []);

  // Función para detectar actualizaciones en GitHub
  const checkUpdates = async () => {
    if (!navigator.onLine) return;
    try {
      // Intenta obtener la última versión desde un archivo raw en tu repo de GitHub
      // Si usas tags, podrías consultar la API de GitHub:
      // const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/releases/latest`);
      
      // Simulación de chequeo
      console.log("Chequeando actualizaciones en GitHub...");
      // Aquí iría el fetch real. Si detecta diferencia, setUpdateAvailable(true)
    } catch (e) {
      console.error("Error chequeando actualizaciones:", e);
    }
  };

  useEffect(() => {
    checkUpdates();
    const interval = setInterval(checkUpdates, 1000 * 60 * 30); // Cada 30 mins
    return () => clearInterval(interval);
  }, []);

  const setCurrentPeriod = (period: PayrollPeriod) => {
    setCurrentPeriodState(period);
    localStorage.setItem('payroll_period', JSON.stringify(period));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const installApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') setIsInstallable(false);
      });
    }
  };

  return (
    <PayrollContext.Provider value={{ 
      showToast, workers, setWorkers, company, setCompany, 
      costCenters, setCostCenters, contractTypes, setContractTypes,
      terminationCauses, setTerminationCauses, concepts, setConcepts,
      currentPeriod, setCurrentPeriod, dbStatus, isOnline,
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
          
          {/* Status Bar */}
          <div className="fixed bottom-4 left-6 z-[60] flex items-center gap-4 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-xl text-[10px] font-bold tracking-wider">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
              <span className="text-gray-500 uppercase">{isOnline ? 'Conectado a GitHub' : 'Modo 100% Offline'}</span>
            </div>
            <div className="w-px h-3 bg-gray-200"></div>
            <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md uppercase font-black">v{APP_VERSION}</span>
          </div>

          <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
            {toasts.map(t => (
              <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right-full ${t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : t.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
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
