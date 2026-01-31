
import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Database, RefreshCcw, ExternalLink } from 'lucide-react';
import { CentralizationVoucher } from '../types';
// Fixed: Imported usePayroll instead of non-existent useToast
import { usePayroll } from '../App';

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
  // Fixed: Use usePayroll hook which provides showToast and currentPeriod
  const { showToast, currentPeriod } = usePayroll();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      showToast("Conexión con Contador Pro Analytics establecida.");
    }, 2000);
  };

  const handleSync = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSyncDone(true);
      showToast(`Voucher de centralización ${MONTHS[currentPeriod.month]} enviado exitosamente.`);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Centralización Contable</h1>
          <p className="text-gray-500">Integración directa con Contador Pro Analytics (Ref. Cap 9.3)</p>
        </div>
        <div className="flex items-center gap-2">
          {!isConnected ? (
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-md"
            >
              {isConnecting ? <RefreshCcw className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
              Vincular Contador Pro Analytics
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold border border-emerald-200 shadow-sm animate-in zoom-in-95">
              <CheckCircle2 size={18} />
              Vínculo Activo
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Database size={18} />
                Voucher de Centralización - {MONTHS[currentPeriod.month]} {currentPeriod.year}
              </h3>
              <span className="text-xs font-mono bg-white px-2 py-1 border rounded text-gray-500">VCH-{currentPeriod.year}-{(currentPeriod.month + 1).toString().padStart(2, '0')}-001</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Cta. Contable</th>
                    <th className="px-6 py-3">Descripción</th>
                    <th className="px-6 py-3 text-right">Debe</th>
                    <th className="px-6 py-3 text-right">Haber</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_VOUCHERS.map((v, i) => (
                    <tr key={i} className="hover:bg-gray-50/30">
                      <td className="px-6 py-4 font-mono text-gray-600">{v.cuentaContable}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-700">{v.descripcion}</span>
                          {v.centroResultado && <span className="text-[10px] text-emerald-600 uppercase font-bold">C.R: {v.centroResultado}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-800">{v.debe > 0 ? `$${v.debe.toLocaleString()}` : '-'}</td>
                      <td className="px-6 py-4 text-right text-gray-800">{v.haber > 0 ? `$${v.haber.toLocaleString()}` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-emerald-50/50 font-bold">
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-emerald-800">TOTALES</td>
                    <td className="px-6 py-4 text-right text-emerald-800">$5.350.000</td>
                    <td className="px-6 py-4 text-right text-emerald-800">$5.350.000</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-200">
              <Database className={isConnected ? "text-emerald-600" : "text-gray-300"} size={32} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Estado de Sincronización</h3>
            <p className="text-sm text-gray-500 mb-6">
              {isConnected 
                ? `Conexión establecida con Contador Pro Analytics. El plan de cuentas se encuentra actualizado para ${MONTHS[currentPeriod.month]}.`
                : "Se requiere vincular su cuenta de Contador Pro para habilitar la centralización automática."}
            </p>
            <div className="w-full space-y-3">
              <button 
                onClick={handleSync}
                disabled={!isConnected || isSending || syncDone}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-md"
              >
                {isSending ? <RefreshCcw className="animate-spin" size={18} /> : <Send size={18} />}
                {syncDone ? "Voucher Enviado" : "Enviar a Analytics"}
              </button>
              {syncDone && (
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 py-2 rounded animate-in fade-in slide-in-from-top-2">
                  ID: 98455-TX-{currentPeriod.year} <ExternalLink size={12} />
                </div>
              )}
            </div>
          </div>

          <div className="bg-emerald-900 text-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              Configuración API
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-emerald-300 uppercase font-bold mb-1">Entorno</p>
                <p className="text-sm font-mono">Production - AWS Santiago</p>
              </div>
              <div>
                <p className="text-[10px] text-emerald-300 uppercase font-bold mb-1">Empresa en Analytics</p>
                <p className="text-sm font-mono">TRN_001_CORP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Centralization;
