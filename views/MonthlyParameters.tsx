
import React from 'react';
import { Calendar, TrendingUp, Info } from 'lucide-react';
import { usePayroll } from '../App';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const MonthlyParameters: React.FC = () => {
  const { currentPeriod } = usePayroll();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Parámetros Mensuales</h1>
          <p className="text-gray-500">Valores referenciales para cálculos ({MONTHS[currentPeriod.month]} {currentPeriod.year})</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">Histórico</button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-emerald-700">Actualizar Valores</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Indicators */}
        {[
          { label: 'U.F. (Unidad de Fomento)', value: '$36.197,53', date: `31 ${MONTHS[currentPeriod.month].slice(0, 3)} ${currentPeriod.year}`, trend: '+0.2%' },
          { label: 'U.T.M. (Unidad Trib. Mensual)', value: '$63.326', date: `${MONTHS[currentPeriod.month].slice(0, 3)} ${currentPeriod.year}`, trend: '+0.5%' },
          { label: 'Sueldo Mínimo', value: '$440.000', date: 'Vigente', trend: 'Base' },
        ].map((param, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp size={48} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{param.label}</p>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{param.value}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold">{param.date}</span>
              <span className="text-[10px] text-gray-400">{param.trend} variación</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
            <Info size={20} />
          </div>
          <h3 className="font-bold text-gray-700">Configuración de Topes y Tasas</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Tope Imponible AFP/Salud (UF)</label>
              <input type="text" defaultValue="81,6" className="bg-gray-50 border-gray-200 rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 border outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Tope Imponible Seg. Cesantía (UF)</label>
              <input type="text" defaultValue="122,6" className="bg-gray-50 border-gray-200 rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 border outline-none" />
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Factor Asignación Zona (%)</label>
                <input type="text" defaultValue="0,00" className="bg-gray-50 border-gray-200 rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 border outline-none" />
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Aporte Patronal SIS (%)</label>
                <input type="text" defaultValue="1,54" className="bg-gray-50 border-gray-200 rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 border outline-none" />
             </div>
          </div>

          <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-800 uppercase mb-3">Tramos Impuesto Único ({MONTHS[currentPeriod.month]} {currentPeriod.year})</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">Exento hasta:</span>
                <span className="font-bold text-gray-700">13,5 UTM</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">Factor Tramo 2:</span>
                <span className="font-bold text-gray-700">0,04</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">Factor Tramo 3:</span>
                <span className="font-bold text-gray-700">0,08</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyParameters;
