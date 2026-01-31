
import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Worker, SaludTipo } from '../types';
import { usePayroll } from '../App';

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

  const validateRut = (rut: string): boolean => {
    if (!rut || rut.trim() === '') return false;
    let value = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (value.length < 2) return false;
    const body = value.slice(0, -1);
    const dv = value.slice(-1);
    if (!/^\d+$/.test(body)) return false;
    if (!/^[0-9K]$/.test(dv)) return false;
    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body.charAt(i)) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const expectedDvResult = 11 - (sum % 11);
    let expectedDv = expectedDvResult === 11 ? '0' : expectedDvResult === 10 ? 'K' : expectedDvResult.toString();
    return dv === expectedDv;
  };

  const formatRut = (rut: string) => {
    let value = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (value.length <= 1) return value;
    const body = value.slice(0, -1);
    const dv = value.slice(-1);
    let formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedBody}-${dv}`;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleaned = rawValue.replace(/[^0-9kK]/g, '');
    const formatted = formatRut(cleaned);
    setFormData({ ...formData, rut: formatted });
    if (cleaned.length >= 2 && !validateRut(formatted)) {
      setErrors(prev => ({ ...prev, rut: 'RUT inválido o DV incorrecto' }));
    } else {
      setErrors(prev => { const n = { ...prev }; delete n.rut; return n; });
    }
  };

  const validateForm = (): boolean => {
    const nE: Record<string, string> = {};
    if (!formData.rut || !validateRut(formData.rut)) nE.rut = 'RUT inválido';
    if (!formData.nombre?.trim()) nE.nombre = 'Obligatorio';
    if (!formData.apellidoPaterno?.trim()) nE.apellidoPaterno = 'Obligatorio';
    if (!formData.cargo?.trim()) nE.cargo = 'Obligatorio';
    if (!formData.sueldoBase || formData.sueldoBase <= 0) nE.sueldoBase = 'Inválido';
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
                {errors.rut && <p className="text-[10px] text-red-500 font-medium">{errors.rut}</p>}
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Nombre Completo <span className="text-red-500">*</span></label>
                <input value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className={iCls('nombre')} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">A. Paterno <span className="text-red-500">*</span></label>
                <input value={formData.apellidoPaterno} onChange={e => setFormData({...formData, apellidoPaterno: e.target.value})} className={iCls('apellidoPaterno')} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">A. Materno</label>
                <input value={formData.apellidoMaterno} onChange={e => setFormData({...formData, apellidoMaterno: e.target.value})} className={iCls('apellidoMaterno')} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-emerald-600 uppercase mb-4 tracking-widest border-b pb-1">2. Datos Laborales (Manual 4.5, 4.8)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Cargo <span className="text-red-500">*</span></label>
                <input value={formData.cargo} onChange={e => setFormData({...formData, cargo: e.target.value})} className={iCls('cargo')} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Centro de Costo <span className="text-red-500">*</span></label>
                <select value={formData.centroCostoId} onChange={e => setFormData({...formData, centroCostoId: e.target.value})} className={iCls('centroCostoId')}>
                  <option value="">Seleccione C.Costo...</option>
                  {costCenters.map(cc => <option key={cc.id} value={cc.id}>{cc.codigo} - {cc.nombre}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Tipo de Contrato <span className="text-red-500">*</span></label>
                <select value={formData.contractTypeId} onChange={e => setFormData({...formData, contractTypeId: e.target.value})} className={iCls('contractTypeId')}>
                  <option value="">Seleccione Tipo...</option>
                  {contractTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.nombre}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Sueldo Base <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input type="number" value={formData.sueldoBase} onChange={e => setFormData({...formData, sueldoBase: Number(e.target.value)})} className={`${iCls('sueldoBase')} pl-7`} />
                </div>
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
