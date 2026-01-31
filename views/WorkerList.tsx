
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Printer } from 'lucide-react';
import { usePayroll } from '../App';
import WorkerModal from './WorkerModal';
import { Worker } from '../types';

const WorkerList: React.FC = () => {
  const { showToast, workers, setWorkers, costCenters } = usePayroll();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkers = workers.filter(w => 
    w.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.rut.includes(searchTerm)
  );

  const handleCreate = () => {
    setSelectedWorker(null);
    setIsModalOpen(true);
  };

  const handleEdit = (worker: Worker) => {
    setSelectedWorker(worker);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este trabajador?')) {
      setWorkers(prev => prev.filter(w => w.id !== id));
      showToast("Trabajador eliminado correctamente.");
    }
  };

  const handleSaveWorker = (workerData: Worker) => {
    if (selectedWorker) {
      setWorkers(prev => prev.map(w => w.id === workerData.id ? workerData : w));
      showToast("Datos actualizados correctamente.");
    } else {
      setWorkers(prev => [...prev, workerData]);
      showToast("Nuevo trabajador creado exitosamente.");
    }
    setIsModalOpen(false);
  };

  const getCostCenterName = (id: string) => {
    return costCenters.find(cc => cc.id === id)?.nombre || 'Sin Asignar';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Maestro de Trabajadores</h1>
          <p className="text-sm text-gray-500">Gestión de fichas personales y laborales (Ref. Cap 4.4)</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            <Plus size={18} />
            Crear Trabajador
          </button>
          <button 
            onClick={() => window.print()}
            className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-gray-50 transition-colors"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50/50 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por RUT o Nombre..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
              <th className="px-6 py-4">RUT</th>
              <th className="px-6 py-4">Trabajador</th>
              <th className="px-6 py-4">Cargo / C.Costo</th>
              <th className="px-6 py-4">Previred (AFP/Salud)</th>
              <th className="px-6 py-4 text-right">Sueldo Base</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredWorkers.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{w.rut}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">{w.nombre} {w.apellidoPaterno}</span>
                    <span className="text-xs text-gray-500">{w.apellidoMaterno || '-'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-700">{w.cargo}</span>
                    <span className="text-xs text-emerald-600 font-semibold uppercase">{getCostCenterName(w.centroCostoId)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-700">{w.afpNombre}</span>
                    <span className="text-xs text-gray-400">{w.tipoSalud} {w.isapreNombre ? `- ${w.isapreNombre}` : ''}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-800 text-right">
                  ${w.sueldoBase.toLocaleString('es-CL')}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase">Activo</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleEdit(w)}
                      className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors rounded-md hover:bg-emerald-50"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(w.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredWorkers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">No se encontraron trabajadores.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
        Mostrando {filteredWorkers.length} de {workers.length} trabajadores registrados
      </div>

      <WorkerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWorker}
        worker={selectedWorker}
      />
    </div>
  );
};

export default WorkerList;
