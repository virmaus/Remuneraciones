
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './views/Dashboard';
import CompanyForm from './views/CompanyForm';
import WorkerList from './views/WorkerList';
import Centralization from './views/Centralization';
import MonthlyParameters from './views/MonthlyParameters';
import CostCenterList from './views/CostCenterList';
import ContractTypeList from './views/ContractTypeList';
import TerminationCauseList from './views/TerminationCauseList';
import ConceptList from './views/ConceptList';
import MonthlyMovementView from './views/MonthlyMovement';
import PayrollCalculation from './views/PayrollCalculation';
import PayslipList from './views/PayslipList';
import ReportsView from './views/Reports';
import AIHelper from './components/AIHelper';
import { CheckCircle, XCircle, Info, Database, RefreshCw } from 'lucide-react';
import { MOCK_WORKERS, MOCK_COMPANY, MOCK_COST_CENTERS, MOCK_CONTRACT_TYPES, MOCK_TERMINATION_CAUSES, MOCK_CONCEPTS } from './constants';
import { Worker, Company, CostCenter, ContractType, TerminationCause, PayrollConcept } from './types';
import { getAllData, saveData } from './db';

const APP_VERSION = "2.1.0-PRO";

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
  dbStatus: 'connecting' | 'connected' | 'error';
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
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  // App State
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [company, setCompany] = useState<Company>(MOCK_COMPANY);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
  const [terminationCauses, setTerminationCauses] = useState<TerminationCause[]>([]);
  const [concepts, setConcepts] = useState<PayrollConcept[]>([]);
  
  const [currentPeriod, setCurrentPeriodState] = useState<PayrollPeriod>(() => {
    const saved = localStorage.getItem('payroll_period');
    return saved ? JSON.parse(saved) : { month: 7, year: 2023 };
  });

  // Load from IndexedDB on Init
  useEffect(() => {
    const loadDB = async () => {
      try {
        const [w, c, cc, ct, tc, cp] = await Promise.all([
          getAllData('workers'),
          getAllData('company'),
          getAllData('costCenters'),
          getAllData('contractTypes'),
          getAllData('terminationCauses'),
          getAllData('concepts')
        ]);

        if (w.length > 0) setWorkers(w); else setWorkers(MOCK_WORKERS as any);
        if (c.length > 0) setCompany(c[0]);
        if (cc.length > 0) setCostCenters(cc); else setCostCenters(MOCK_COST_CENTERS);
        if (ct.length > 0) setContractTypes(ct); else setContractTypes(MOCK_CONTRACT_TYPES);
        if (tc.length > 0) setTerminationCauses(tc); else setTerminationCauses(MOCK_TERMINATION_CAUSES);
        if (cp.length > 0) setConcepts(cp); else setConcepts(MOCK_CONCEPTS);

        setDbStatus('connected');
      } catch (err) {
        console.error('DB Init error:', err);
        setDbStatus('error');
      }
    };
    loadDB();
  }, []);

  // Sync state changes to DB
  useEffect(() => { if (dbStatus === 'connected') workers.forEach(w => saveData('workers', w)); }, [workers]);
  useEffect(() => { if (dbStatus === 'connected') saveData('company', company); }, [company]);
  useEffect(() => { if (dbStatus === 'connected') costCenters.forEach(cc => saveData('costCenters', cc)); }, [costCenters]);
  useEffect(() => { if (dbStatus === 'connected') concepts.forEach(cp => saveData('concepts', cp)); }, [concepts]);

  const setCurrentPeriod = (period: PayrollPeriod) => {
    setCurrentPeriodState(period);
    localStorage.setItem('payroll_period', JSON.stringify(period));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <PayrollContext.Provider value={{ 
      showToast, workers, setWorkers, company, setCompany, 
      costCenters, setCostCenters, contractTypes, setContractTypes,
      terminationCauses, setTerminationCauses, concepts, setConcepts,
      currentPeriod, setCurrentPeriod, dbStatus
    }}>
      <Router>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto space-y-6">
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
          <AIHelper />
          
          {/* Status Bar Floating with Versioning */}
          <div className="fixed bottom-4 left-6 z-[60] flex items-center gap-3 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-xl text-[10px] font-bold tracking-wider">
            <div className="flex items-center gap-2 pr-3 border-r border-gray-100">
               <div className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
               <span className="text-gray-500 flex items-center gap-1 uppercase"><Database size={10}/> DB Local</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
               <RefreshCw size={10} className="animate-spin-slow" />
               <span className="bg-emerald-50 px-2 py-0.5 rounded-md">VER {APP_VERSION}</span>
            </div>
          </div>

          <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
            {toasts.map(toast => (
              <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right-full ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                {toast.type === 'success' && <CheckCircle size={18} />}
                {toast.type === 'error' && <XCircle size={18} />}
                {toast.type === 'info' && <Info size={18} />}
                <span className="text-sm font-medium">{toast.message}</span>
              </div>
            ))}
          </div>
        </div>
      </Router>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </PayrollContext.Provider>
  );
};

export default App;
