
import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Worker, SaludTipo } from '../types';
import { usePayroll } from '../App';
import { validateRut, formatRut } from '../utils/rut';

interface WorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (worker: Worker) => void;
  worker?: Worker | null;
}

const WorkerModal: React.FC<WorkerModalProps> = ({ isOpen, onClose, onSave, worker }) => {
  const { costCenters, contractTypes } = usePayroll();
  
  const [formData, setFormData] = useState<Partial<Worker>>({
    rut: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    cargo: '',
    centroCostoId: '',
    sueldoBase: 0,
    tipoSalud: SaludTipo.FONASA,
    afpNombre: '',
    gratificacionTipo: 'Calculada' as any,
    contractTypeId: '',
    hasSeguroCesantia: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (worker) {
      setFormData(worker);
    } else {
      setFormData({
        rut: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        cargo: '',
        centroCostoId: costCenters[0]?.id || '',
        sueldoBase: 0,
        tipoSalud: SaludTipo.FONASA,
        afpNombre: '',
        gratificacionTipo: 'Calculada' as any,
        contractTypeId: contractTypes[0]?.id || '',
        hasSeguroCesantia: true
      });
    }
    setErrors({});
  }, [worker, isOpen, costCenters, contractTypes]);

  if (!isOpen) return null;

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleaned = rawValue.replace(/[^0-9kK]/g, '');
    const formatted = formatRut(cleaned);
    setFormData({ ...formData, rut: formatted });
    
    if (cleaned.length >= 2) {
      if (!validateRut(formatted)) {
        setErrors(prev => ({ ...prev, rut: 'RUT inválido' }));
      } else {
        setErrors(prev => { const n = { ...prev }; delete n.rut; return n; });
      }
    }
  };

  const validateForm = (): boolean => {
    const nE: Record<string, string> = {};
    if (!formData.rut || !validateRut(formData.rut)) nE.rut = 'RUT inválido';
    if (!formData.nombre?.trim()) nE.nombre = 'Obligatorio';
    if (!formData.apellidoPaterno?.trim()) nE.apellidoPaterno = 'Obligatorio';
    if (!formData.cargo?.trim()) nE.cargo = 'Obligatorio';
    if (formData.sueldoBase === undefined || formData.sueldoBase < 0) nE.sueldoBase = 'Inválido';
    if (!formData.afpNombre) nE.afpNombre = 'Obligatorio';
    if (!formData.centroCostoId) nE.centroCostoId = 'Obligatorio';
    if (!formData.contractTypeId) nE.contractTypeId = 'Obligatorio';
    setErrors(nE);
    return Object.keys(nE).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave({ ...formData, id: worker?.id || Date.now().toString() } as Worker);
  };

  const iCls = (f: string) => `w-full border rounded-lg py-2 px-3 text-sm focus:ring-2 outline-none transition-all ${errors[f] ? 'border-red-300 focus:ring-red-500/20 bg-red-50' : 'border-gray-200 focus:ring-emerald-500/20'}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">{worker ? 'Editar Ficha Trabajador' : 'Nuevo Trabajador'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <section>
            <h3 className="text-xs font-bold text-emerald-600 uppercase mb-4 tracking-widest border-b pb-1">1. Identificación Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">RUT <span className="text-red-500">*</span></label>
                <input value={formData.rut} onChange={handleRutChange} placeholder="12.345.678-9" className={iCls('rut')} />
                {errors.rut && <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.rut}</p>}
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Nombre Completo <span className="text-red-500">*</span></label>
                <input value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className={iCls('nombre')} />
                {errors.nombre && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.nombre}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">A. Paterno <span className="text-red-500">*</span></label>
                <input value={formData.apellidoPaterno} onChange={e => setFormData({...formData, apellidoPaterno: e.target.value})} className={iCls('apellidoPaterno')} />
                {errors.apellidoPaterno && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.apellidoPaterno}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">A. Materno</label>
                <input value={formData.apellidoMaterno} onChange={e => setFormData({...formData, apellidoMaterno: e.target.value})} className={iCls('apellidoMaterno')} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-emerald-600 uppercase mb-4 tracking-widest border-b pb-1">2. Datos Laborales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Cargo <span className="text-red-500">*</span></label>
                <input value={formData.cargo} onChange={e => setFormData({...formData, cargo: e.target.value})} className={iCls('cargo')} />
                {errors.cargo && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.cargo}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Centro de Costo <span className="text-red-500">*</span></label>
                <select value={formData.centroCostoId} onChange={e => setFormData({...formData, centroCostoId: e.target.value})} className={iCls('centroCostoId')}>
                  <option value="">Seleccione C.Costo...</option>
                  {costCenters.map(cc => <option key={cc.id} value={cc.id}>{cc.codigo} - {cc.nombre}</option>)}
                </select>
                {errors.centroCostoId && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.centroCostoId}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Tipo de Contrato <span className="text-red-500">*</span></label>
                <select value={formData.contractTypeId} onChange={e => setFormData({...formData, contractTypeId: e.target.value})} className={iCls('contractTypeId')}>
                  <option value="">Seleccione Tipo...</option>
                  {contractTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.nombre}</option>)}
                </select>
                {errors.contractTypeId && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.contractTypeId}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Sueldo Base <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input type="number" value={formData.sueldoBase} onChange={e => setFormData({...formData, sueldoBase: Number(e.target.value)})} className={`${iCls('sueldoBase')} pl-7`} />
                </div>
                {errors.sueldoBase && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.sueldoBase}</p>}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-emerald-600 uppercase mb-4 tracking-widest border-b pb-1">3. Previsión y Salud</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">AFP <span className="text-red-500">*</span></label>
                <select value={formData.afpNombre} onChange={e => setFormData({...formData, afpNombre: e.target.value})} className={iCls('afpNombre')}>
                  <option value="">Seleccione AFP...</option>
                  {['Provida', 'Cuprum', 'Habitat', 'Modelo', 'Planvital', 'Capital', 'Uno'].map(afp => <option key={afp} value={afp}>{afp}</option>)}
                </select>
                {errors.afpNombre && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.afpNombre}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Sistema de Salud</label>
                <select value={formData.tipoSalud} onChange={e => setFormData({...formData, tipoSalud: e.target.value as SaludTipo})} className={iCls('tipoSalud')}>
                  <option value={SaludTipo.FONASA}>Fonasa</option>
                  <option value={SaludTipo.ISAPRE}>Isapre</option>
                </select>
              </div>
            </div>
          </section>
        </form>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
          <button onClick={handleSubmit} className="flex items-center gap-2 px-8 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-lg shadow-emerald-600/20"><Save size={18} /> Guardar Ficha</button>
        </div>
      </div>
    </div>
  );
};

export default WorkerModal;
