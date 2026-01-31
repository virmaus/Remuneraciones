
import React from 'react';
import { Plus, Edit, FileText } from 'lucide-react';
import { usePayroll } from '../App';

const ContractTypeList: React.FC = () => {
  const { contractTypes } = usePayroll();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Maestro de Contratos</h1>
          <p className="text-sm text-gray-500">Definición de modalidades contractuales (Ref. Cap 4.8)</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all">
          <Plus size={18} /> Nueva Modalidad
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contractTypes.map((ct) => (
          <div key={ct.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between mb-2">
              <FileText className="text-emerald-600" size={20} />
              <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-emerald-600 transition-all"><Edit size={14} /></button>
            </div>
            <h3 className="font-bold text-gray-800">{ct.nombre}</h3>
            <p className="text-[10px] text-gray-400 uppercase mt-1 font-bold">Vigente en Ficha</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractTypeList;
