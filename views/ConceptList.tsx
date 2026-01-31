
import React from 'react';
import { usePayroll } from '../App';
import { Plus, Check, X, Calculator } from 'lucide-react';

const ConceptList: React.FC = () => {
  const { concepts } = usePayroll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Conceptos de Remuneración</h1>
          <p className="text-gray-500">Configuración de Haberes y Descuentos (Ref. Cap 4.11)</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-emerald-700 transition-all">
          <Plus size={18} /> Nuevo Concepto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
              <th className="px-6 py-4">Código</th>
              <th className="px-6 py-4">Descripción</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4 text-center">Imp.</th>
              <th className="px-6 py-4 text-center">Trib.</th>
              <th className="px-6 py-4 text-center">Grat.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {concepts.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-emerald-700">{c.codigo}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-700">{c.nombre}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.tipo === 'Haber' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                    {c.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {c.isImponible ? <Check size={16} className="text-emerald-500 mx-auto" /> : <X size={16} className="text-gray-300 mx-auto" />}
                </td>
                <td className="px-6 py-4 text-center">
                  {c.isTributable ? <Check size={16} className="text-emerald-500 mx-auto" /> : <X size={16} className="text-gray-300 mx-auto" />}
                </td>
                <td className="px-6 py-4 text-center">
                  {c.isGratificacion ? <Calculator size={16} className="text-amber-500 mx-auto" /> : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConceptList;
