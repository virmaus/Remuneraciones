import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Database, RefreshCcw, ExternalLink, Download, FileJson } from 'lucide-react';
import { usePayroll } from '../App.tsx';
import { CentralizationVoucher } from '../types.ts';

const MOCK_VOUCHERS: CentralizationVoucher[] = [
  { cuentaContable: '2-1-03-01-0001', descripcion: 'Sueldos por Pagar', debe: 0, haber: 4500000 },
  { cuentaContable: '2-1-03-01-0002', descripcion: 'Leyes Sociales por Pagar', debe: 0, haber: 850000 },
  { cuentaContable: '2-1-03-01-0003', descripcion: 'Impuesto Único por Pagar', debe: 0, haber: 125000 },
  { cuentaContable: '5-1-01-01-0001', descripcion: 'Gasto Remuneraciones Base', debe: 5475000, haber: 0, centroResultado: 'Admin' },
];

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const Centralization: React.FC = () => {
  const { showToast, currentPeriod, company } = usePayroll();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      showToast("Vínculo establecido con Contador Pro Analytics.");
    }, 1200);
  };

  const exportToContabilidad = () => {
    const voucherData = {
      sistemaOrigen: 'Remuneraciones Digital',
      version: '3.1.0',
      periodo: `${currentPeriod.year}-${(currentPeriod.month + 1).toString().padStart(2, '0')}`,
      empresa: {
        rut: company.rut,
        razonSocial: company.razonSocial
      },
      comprobante: {
        tipo: 'Traspaso',
        glosa: `Centralización Remuneraciones ${MONTHS[currentPeriod.month]} ${currentPeriod.year}`,
        items: MOCK_VOUCHERS
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(voucherData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `Centralizacion_${company.codigo}_${currentPeriod.year}_${currentPeriod.month + 1}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    setSyncDone(true);
    showToast("Comprobante exportado para Contador Pro.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Centralización Contable</h1>
          <p className="text-gray-500">Conexión directa con Contador Pro Analytics (Ref. Cap 9.2)</p>
        </div>
        <div className="flex items-center gap-2">
          {!isConnected ? (
            <button 
              onClick={handleConnect}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md"
            >
              {isConnecting ? <RefreshCcw className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
              Conectar a Contabilidad
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold border border-emerald-200">
              <CheckCircle2 size={18} /> Sincronización Lista
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
                <Database size={16} /> Detalle del Asiento Mensual
              </h3>
              <span className="text-[10px] font-mono bg-white px-2 py-1 border rounded text-gray-400">REF: REM-{currentPeriod.year}-{(currentPeriod.month + 1).toString().padStart(2, '0')}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase">
                  <tr>
                    <th className="px-6 py-3">Cta. Contable</th>
                    <th className="px-6 py-3">Glosa Cuenta</th>
                    <th className="px-6 py-3 text-right">Debe</th>
                    <th className="px-6 py-3 text-right">Haber</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_VOUCHERS.map((v, i) => (
                    <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{v.cuentaContable}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-700">{v.descripcion}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono">{v.debe > 0 ? `$${v.debe.toLocaleString('es-CL')}` : '-'}</td>
                      <td className="px-6 py-4 text-right font-mono">{v.haber > 0 ? `$${v.haber.toLocaleString('es-CL')}` : '-'}</td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-50/50 font-bold">
                    <td colSpan={2} className="px-6 py-4 text-right text-emerald-800">TOTALES COMPROBANTE</td>
                    <td className="px-6 py-4 text-right text-emerald-800 font-mono">$5.475.000</td>
                    <td className="px-6 py-4 text-right text-emerald-800 font-mono">$5.475.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
               <FileJson size={18} className="text-emerald-600" /> Exportar a Contador Pro
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Este proceso genera un archivo de intercambio compatible con el manual de integración de Transtecnia para el módulo contable.
            </p>
            <button 
              onClick={exportToContabilidad}
              disabled={!isConnected}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Download size={18} /> Exportar Asiento Contable
            </button>
            {syncDone && (
              <p className="text-[10px] text-center mt-4 text-emerald-600 font-bold uppercase animate-pulse">
                ✓ Comprobante generado correctamente
              </p>
            )}
          </div>
          
          <div className="bg-gray-900 text-white p-5 rounded-xl border-l-4 border-l-emerald-500">
             <h4 className="text-xs font-bold text-emerald-400 uppercase mb-3 flex items-center gap-2">
               <ExternalLink size={14} /> Instrucciones Manual
             </h4>
             <ul className="text-[10px] space-y-3 text-gray-300 leading-relaxed">
               <li>1. Asegúrese que las <strong>cuentas contables</strong> estén creadas en Contador Pro.</li>
               <li>2. Verifique la cuadratura de <strong>Debe y Haber</strong> antes de exportar.</li>
               <li>3. En el módulo contable, utilice la opción "Importación Directa desde Remuneraciones".</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Centralization;