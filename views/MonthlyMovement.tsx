
import React, { useState } from 'react';
import { usePayroll } from '../App';
import { Save, User, Clock, CalendarDays } from 'lucide-react';

const MonthlyMovement: React.FC = () => {
  const { workers, concepts, currentPeriod, showToast } = usePayroll();
  const [selectedWorkerId, setSelectedWorkerId] = useState(workers[0]?.id || '');

  const handleSave = () => {
    showToast("Movimientos mensuales guardados correctamente.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Movimiento Mensual</h1>
        <p className="text-gray-500">Captura de variables por trabajador (Ref. Cap 5.1)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase">Selección de Personal</h3>
          <div className="space-y-2">
            {workers.map(w => (
              <button
                key={w.id}
                onClick={() => setSelectedWorkerId(w.id)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all border ${selectedWorkerId === w.id ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'border-transparent hover:bg-gray-50 text-gray-600'}`}
              >
                {w.nombre} {w.apellidoPaterno}
                <div className="text-[10px] font-normal opacity-70">{w.rut}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <CalendarDays size={14} /> Días Trabajados
              </label>
              <input type="number" defaultValue={30} className="w-full border-gray-200 rounded-lg p-2 text-sm border focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <Clock size={14} /> Horas Extras 50%
              </label>
              <input type="number" defaultValue={0} className="w-full border-gray-200 rounded-lg p-2 text-sm border focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <Clock size={14} /> Horas Extras 100%
              </label>
              <input type="number" defaultValue={0} className="w-full border-gray-200 rounded-lg p-2 text-sm border focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 text-sm">
              Ingreso de Conceptos Variables
            </div>
            <div className="p-6">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase border-b">
                    <th className="pb-3">Cod. Concepto</th>
                    <th className="pb-3">Nombre Concepto</th>
                    <th className="pb-3 text-right">Monto Mensual ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {concepts.filter(c => c.codigo !== '001').map(c => (
                    <tr key={c.id}>
                      <td className="py-3 font-mono text-emerald-600 font-bold">{c.codigo}</td>
                      <td className="py-3 text-gray-700">{c.nombre}</td>
                      <td className="py-3">
                        <input type="number" placeholder="0" className="w-32 ml-auto block text-right border-gray-200 rounded-lg p-1.5 text-xs border focus:ring-emerald-500 outline-none" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={handleSave} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-md">
                <Save size={18} /> Guardar Movimiento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyMovement;
