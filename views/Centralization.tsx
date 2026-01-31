
import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Database, RefreshCcw, ExternalLink, Download, FileJson } from 'lucide-react';
import { usePayroll } from '../App.tsx';
import { CentralizationVoucher } from '../types.ts';

const MOCK_VOUCHERS: CentralizationVoucher[] = [
  { cuentaContable: '2-1-03-01-0001', descripcion: 'Sueldos por Pagar', debe: 0, haber: 4500000 },
  { cuentaContable: '2-1-03-01-0002', descripcion: 'Leyes Sociales por Pagar', debe: 0, haber: 850000 },
  { cuentaContable: '5-1-01-01-0001', descripcion: 'Gasto Remuneraciones', debe: 5350000, haber: 0, centroResultado: 'Admin' },
];

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const Centralization: React.FC = () => {
  const { showToast, currentPeriod, company } = usePayroll();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      showToast("Conexión con Contabilidad25 (Bridge Mode) activada.");
    }, 1500);
  };

  const exportForAccounting = () => {
    // Estructura compatible con el importador de Contabilidad25
    const voucherData = {
      tipo: 'Traspaso',
      glosa: `Centralización Remuneraciones ${MONTHS[currentPeriod.month]} ${currentPeriod.year}`,
      fecha: new Date().toISOString().split('T')[0],
      empresaRut: company.rut,
      detalles: MOCK_VOUCHERS.map(v => ({
        cuenta: v.cuentaContable,
        glosa: v.descripcion,
        debe: v.debe,
        haber: v.haber,
        centroCosto: v.centroResultado || ''
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(voucherData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `Voucher_Remun_${MONTHS[currentPeriod.month]}_${currentPeriod.year}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    setSyncDone(true);
    showToast("Archivo de Centralización generado. Impórtalo en Contabilidad25.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Centralización Contable</h1>
          <p className="text-gray-500">Puente de Integración con Contabilidad25</p>
        </div>
        <div className="flex items-center gap-2">
          {!isConnected ? (
            <button 
              onClick={handleConnect}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md"
            >
              {isConnecting ? <RefreshCcw className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
              Vincular con Contabilidad25
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold border border-emerald-200">
              <CheckCircle2 size={18} /> Puente de Datos Activo
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
                <Database size={16} /> Comprobante de Centralización
              </h3>
              <span className="text-[10px] font-mono bg-white px-2 py-1 border rounded text-gray-400">VCH-{currentPeriod.year}-{currentPeriod.month + 1}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase">
                  <tr>
                    <th className="px-6 py-3">Cuenta Contable</th>
                    <th className="px-6 py-3">Descripción</th>
                    <th className="px-6 py-3 text-right">Debe</th>
                    <th className="px-6 py-3 text-right">Haber</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_VOUCHERS.map((v, i) => (
                    <tr key={i} className="hover:bg-gray-50/30">
                      <td className="px-6 py-4 font-mono text-gray-500">{v.cuentaContable}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-700">{v.descripcion}</span>
                      </td>
                      <td className="px-6 py-4 text-right">{v.debe > 0 ? `$${v.debe.toLocaleString()}` : '-'}</td>
                      <td className="px-6 py-4 text-right">{v.haber > 0 ? `$${v.haber.toLocaleString()}` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
               <FileJson size={18} className="text-emerald-600" /> Exportar a Contabilidad
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Genera un archivo JSON con el asiento contable para ser importado directamente en el módulo de Contabilidad.
            </p>
            <button 
              onClick={exportForAccounting}
              disabled={!isConnected}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg"
            >
              <Download size={18} /> Generar Archivo de Traspaso
            </button>
            {syncDone && (
              <p className="text-[10px] text-center mt-4 text-emerald-600 font-bold uppercase animate-pulse">
                ✓ Archivo generado con éxito
              </p>
            )}
          </div>
          
          <div className="bg-gray-900 text-white p-5 rounded-xl">
             <h4 className="text-xs font-bold text-emerald-400 uppercase mb-3 flex items-center gap-2">
               <ExternalLink size={14} /> Tips de Integración
             </h4>
             <ul className="text-[11px] space-y-2 text-gray-400">
               <li>• El archivo JSON incluye códigos de cuenta estándar.</li>
               <li>• En Contabilidad25, usa la opción "Importar Voucher Externo".</li>
               <li>• Verifica que el RUT de la empresa coincida en ambas apps.</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Centralization;
