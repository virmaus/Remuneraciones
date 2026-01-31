
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Database, Search } from 'lucide-react';
import { usePayroll } from '../App';
import { CostCenter } from '../types';

const CostCenterList: React.FC = () => {
  const { costCenters, setCostCenters, showToast } = usePayroll();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este Centro de Costo? Los trabajadores vinculados perderán esta referencia.')) {
      setCostCenters(prev => prev.filter(c => c.id !== id));
      showToast("Centro de Costo eliminado.");
    }
  };

  const filtered = costCenters.filter(c => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || c.codigo.includes(searchTerm));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Centros de Costo</h1>
          <p className="text-sm text-gray-500">Estructura organizacional y contable (Ref. Cap 4.5)</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
          <Plus size={18} /> Nuevo Centro
        </button>
      </div>

      <div className="px-6 py-4 bg-gray-50/50 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por código o nombre..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
              <th className="px-6 py-4">Código</th>
              <th className="px-6 py-4">Descripción / Nombre</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm font-bold text-emerald-700">{c.codigo}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{c.nombre}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors rounded-md hover:bg-emerald-50"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CostCenterList;
