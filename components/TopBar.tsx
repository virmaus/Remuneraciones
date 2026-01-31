
import React, { useState, useRef, useEffect } from 'react';
import { usePayroll } from '../App.tsx';
import { Bell, User, Calendar, ChevronDown, Check } from 'lucide-react';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const TopBar: React.FC = () => {
  const { company, currentPeriod, setCurrentPeriod, showToast } = usePayroll();
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePeriodChange = (month: number, year: number) => {
    setCurrentPeriod({ month, year });
    setSelectorOpen(false);
    showToast(`Periodo cambiado a ${MONTHS[month]} ${year}`, 'info');
  };

  const years = Array.from({ length: 5 }, (_, i) => 2023 + i);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-semibold text-gray-400 uppercase">Empresa Activa</span>
          <span className="text-sm font-bold text-gray-700">{company.razonSocial}</span>
        </div>
        <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />
        
        {/* Period Selector */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setSelectorOpen(!isSelectorOpen)}
            className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-colors shadow-sm"
          >
            <Calendar size={16} />
            <span className="text-xs font-bold uppercase">{MONTHS[currentPeriod.month]} {currentPeriod.year}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isSelectorOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSelectorOpen && (
            <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-200 z-50">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 px-1">Seleccionar Periodo</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Mes</p>
                  {MONTHS.map((m, idx) => (
                    <button 
                      key={m}
                      onClick={() => handlePeriodChange(idx, currentPeriod.year)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                        currentPeriod.month === idx ? 'bg-emerald-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {m}
                      {currentPeriod.month === idx && <Check size={12} />}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Año</p>
                  {years.map((y) => (
                    <button 
                      key={y}
                      onClick={() => handlePeriodChange(currentPeriod.month, y)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                        currentPeriod.year === y ? 'bg-emerald-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {y}
                      {currentPeriod.year === y && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-700">Administrador</p>
            <p className="text-xs text-gray-500">demo@transtecnia.cl</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 border border-emerald-200 shadow-sm">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
