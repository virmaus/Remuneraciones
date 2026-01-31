
import React, { useState } from 'react';
import { usePayroll } from '../App';
import { Company } from '../types';
import { validateRut, formatRut } from '../utils/rut';
import { AlertCircle } from 'lucide-react';

const CompanyForm: React.FC = () => {
  const { showToast, company, setCompany } = usePayroll();
  const [formData, setFormData] = useState<Company>(company);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRutChange = (field: 'rut' | 'rutContador', value: string) => {
    const cleaned = value.replace(/[^0-9kK]/g, '');
    const formatted = formatRut(cleaned);
    setFormData({ ...formData, [field]: formatted });
    
    if (cleaned.length >= 2) {
      if (!validateRut(formatted)) {
        setErrors(prev => ({ ...prev, [field]: 'RUT inválido' }));
      } else {
        setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
      }
    } else {
      setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const validate = (): boolean => {
    const nE: Record<string, string> = {};
    if (!formData.rut || !validateRut(formData.rut)) nE.rut = 'RUT inválido';
    if (!formData.razonSocial?.trim()) nE.razonSocial = 'Requerido';
    if (formData.rutContador && !validateRut(formData.rutContador)) nE.rutContador = 'RUT inválido';
    setErrors(nE);
    return Object.keys(nE).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      showToast("Por favor corrija los errores antes de guardar.", "error");
      return;
    }
    setCompany(formData);
    showToast("Configuración de empresa guardada correctamente.");
  };

  const handleCreateNew = () => {
    const emptyCompany: Company = {
      codigo: (Math.floor(Math.random() * 900) + 100).toString(),
      rut: '',
      razonSocial: 'Nueva Empresa S.A.',
      contador: '',
      rutContador: ''
    };
    setFormData(emptyCompany);
    setErrors({});
    showToast("Nueva empresa inicializada. Por favor complete los datos.", "info");
  };

  const inputCls = (field: string) => `w-full border rounded-lg py-2.5 px-4 text-sm focus:ring-emerald-500 outline-none transition-all ${errors[field] ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-in fade-in duration-500">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Identificación de la Empresa</h1>
          <p className="text-sm text-gray-500">Configuración de datos básicos y tributarios (Ref. Cap 4.1)</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCreateNew}
            className="px-4 py-2 text-sm font-bold text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Nueva Empresa
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">Código Interno</label>
            <input 
              type="text" 
              value={formData.codigo} 
              onChange={e => setFormData({...formData, codigo: e.target.value})}
              className={inputCls('codigo')} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">RUT Empresa</label>
            <input 
              type="text" 
              value={formData.rut} 
              onChange={e => handleRutChange('rut', e.target.value)}
              placeholder="76.123.456-7"
              className={inputCls('rut')} 
            />
            {errors.rut && <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.rut}</p>}
          </div>
          <div className="lg:col-span-1 space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">Razón Social</label>
            <input 
              type="text" 
              value={formData.razonSocial} 
              onChange={e => setFormData({...formData, razonSocial: e.target.value})}
              className={inputCls('razonSocial')} 
            />
            {errors.razonSocial && <p className="text-[10px] text-red-500 font-medium mt-1">{errors.razonSocial}</p>}
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">Nombre del Contador</label>
            <input 
              type="text" 
              value={formData.contador} 
              onChange={e => setFormData({...formData, contador: e.target.value})}
              className={inputCls('contador')} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">RUT del Contador</label>
            <input 
              type="text" 
              value={formData.rutContador} 
              onChange={e => handleRutChange('rutContador', e.target.value)}
              placeholder="12.345.678-9"
              className={inputCls('rutContador')} 
            />
            {errors.rutContador && <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.rutContador}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">Giro Comercial</label>
            <input type="text" placeholder="Ej: Servicios de Software" className="w-full border-gray-200 border rounded-lg py-2.5 px-4 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          </div>
        </div>

        <div className="mt-12 p-6 bg-emerald-50 rounded-xl border border-emerald-100 border-dashed">
          <h3 className="text-sm font-bold text-emerald-800 mb-4 uppercase">Instituciones Relacionadas (Previred)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-600 uppercase">Caja de Compensación</label>
                <select className="w-full bg-white border-emerald-100 rounded-lg py-2 px-3 text-sm focus:ring-emerald-500 outline-none border">
                  <option>Los Andes</option>
                  <option>La Araucana</option>
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-600 uppercase">Mutual de Seguridad</label>
                <select className="w-full bg-white border-emerald-100 rounded-lg py-2 px-3 text-sm focus:ring-emerald-500 outline-none border">
                  <option>ACHS</option>
                  <option>Mutual CCHC</option>
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-600 uppercase">Administradora Fondos Cesantía</label>
                <select className="w-full bg-white border-emerald-100 rounded-lg py-2 px-3 text-sm focus:ring-emerald-500 outline-none border">
                  <option>AFC Chile</option>
                </select>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
