
import React from 'react';
import { usePayroll } from '../App';
import { AlertCircle, Scale } from 'lucide-react';

const TerminationCauseList: React.FC = () => {
  const { terminationCauses } = usePayroll();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Causales de Finiquito</h1>
          <p className="text-gray-500">Maestro legal según Código del Trabajo (Ref. Cap 4.9 y 4.10)</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-xs font-bold border border-blue-100">
            <Scale size={16} /> Estándar Previred
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
              <th className="px-6 py-4">Artículo</th>
              <th className="px-6 py-4">Número</th>
              <th className="px-6 py-4">Descripción Legal</th>
              <th className="px-6 py-4">Impacto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {terminationCauses.map((tc) => (
              <tr key={tc.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600">Art. {tc.articulo}</span>
                </td>
                <td className="px-6 py-4 font-bold text-emerald-700">N° {tc.numero}</td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{tc.nombre}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400">
                    <AlertCircle size={14} /> Requiere Documentación
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-4 items-start">
        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 shrink-0">
          <Scale size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-900 uppercase mb-1">Nota Técnica Transtecnia</h4>
          <p className="text-xs text-emerald-700 leading-relaxed">
            Las causales aquí definidas se vinculan directamente con el proceso de <strong>Liquidación de Finiquito (Cap. 10.2)</strong>. 
            Asegúrese de que el artículo seleccionado coincida con la notificación enviada a la Dirección del Trabajo y Previred.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TerminationCauseList;
