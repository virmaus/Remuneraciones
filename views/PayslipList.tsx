
import React, { useState, useEffect } from 'react';
import { usePayroll } from '../App';
import { Printer, Eye, Download, Search, FileText, X, AlertCircle } from 'lucide-react';
import { getDataById } from '../db';
import { CalculatedPayroll } from '../types';

const PayslipList: React.FC = () => {
  const { workers, currentPeriod, showToast } = usePayroll();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingPayslip, setViewingPayslip] = useState<string | null>(null);
  const [activeCalculation, setActiveCalculation] = useState<CalculatedPayroll | null>(null);

  const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const filtered = workers.filter(w => w.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || w.rut.includes(searchTerm));

  useEffect(() => {
    if (viewingPayslip) {
      const loadCalc = async () => {
        const id = `${viewingPayslip}_${currentPeriod.month}_${currentPeriod.year}`;
        const data = await getDataById('calculations', id);
        setActiveCalculation(data || null);
      };
      loadCalc();
    } else {
      setActiveCalculation(null);
    }
  }, [viewingPayslip, currentPeriod]);

  const handlePrint = (name: string) => {
    showToast(`Preparando impresión para ${name}...`);
  };

  const selectedWorker = workers.find(w => w.id === viewingPayslip);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Emisión de Liquidaciones</h1>
          <p className="text-gray-500">Documentos del periodo {MONTHS[currentPeriod.month]} {currentPeriod.year} (Ref. Cap 8.1)</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all">
            <Download size={18} /> Masivo PDF
          </button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-emerald-700 flex items-center gap-2 transition-all">
            <Printer size={18} /> Imprimir Lote
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar trabajador..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="px-6 py-4">RUT</th>
                <th className="px-6 py-4">Trabajador</th>
                <th className="px-6 py-4 text-right">Líquido a Pagar</th>
                <th className="px-6 py-4 text-center">Estado Cálculo</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(w => (
                <tr key={w.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{w.rut}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{w.nombre} {w.apellidoPaterno}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-emerald-700">$782.415 (Sim)</td>
                  <td className="px-6 py-4 text-center">
                     <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-100 text-emerald-700">Calculado</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setViewingPayslip(w.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-all" title="Ver Detalle">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handlePrint(w.nombre)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all">
                        <Printer size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Preview Modal */}
      {viewingPayslip && selectedWorker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
              <h2 className="font-bold text-gray-700 flex items-center gap-2">
                <FileText className="text-emerald-600" />
                Previsualización Liquidación - {MONTHS[currentPeriod.month]} {currentPeriod.year}
              </h2>
              <button onClick={() => setViewingPayslip(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 bg-gray-100">
              {!activeCalculation ? (
                <div className="bg-white p-20 text-center rounded-xl shadow-sm border border-dashed border-gray-300">
                   <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
                   <h3 className="font-bold text-gray-700">Sin Datos de Cálculo</h3>
                   <p className="text-sm text-gray-400 mt-2">No se encontró un proceso de cálculo para este trabajador en el periodo seleccionado.</p>
                </div>
              ) : (
                <div className="bg-white p-10 shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] text-[12px] font-sans border border-gray-200">
                  <div className="flex justify-between border-b-2 border-emerald-800 pb-4 mb-6">
                    <div>
                      <h3 className="font-bold text-[14px] uppercase">Empresa Demo Transtecnia S.A.</h3>
                      <p>RUT: 76.123.456-7</p>
                      <p>GIRO: SERVICIOS TECNOLOGICOS</p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold text-[14px]">LIQUIDACION DE SUELDO</h3>
                      <p className="font-bold text-emerald-700 uppercase">{MONTHS[currentPeriod.month]} {currentPeriod.year}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="space-y-1">
                      <p><strong>RUT:</strong> {selectedWorker.rut}</p>
                      <p><strong>NOMBRE:</strong> {selectedWorker.nombre} {selectedWorker.apellidoPaterno} {selectedWorker.apellidoMaterno}</p>
                      <p><strong>CARGO:</strong> {selectedWorker.cargo}</p>
                    </div>
                    <div className="space-y-1">
                      <p><strong>FECHA INGRESO:</strong> {selectedWorker.fechaContrato}</p>
                      <p><strong>DIAS TRABAJADOS:</strong> 30</p>
                      <p><strong>SISTEMA SALUD:</strong> {selectedWorker.tipoSalud}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    {/* Haberes */}
                    <div className="space-y-4">
                      <h4 className="font-bold border-b border-gray-300 pb-1 text-emerald-800 uppercase tracking-wider">Detalle Haberes</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between"><span>Sueldo Base</span><span>${activeCalculation.haberes.sueldoBase.toLocaleString('es-CL')}</span></div>
                        <div className="flex justify-between"><span>Gratificación Legal</span><span>${activeCalculation.haberes.gratificacion.toLocaleString('es-CL')}</span></div>
                        <div className="flex justify-between italic text-gray-500"><span>Sub-Total Imponible</span><span className="font-bold text-gray-700">${activeCalculation.totales.totalImponible.toLocaleString('es-CL')}</span></div>
                        <div className="pt-2 flex justify-between"><span>Asig. Movilización</span><span>${activeCalculation.haberes.movilizacion.toLocaleString('es-CL')}</span></div>
                        <div className="flex justify-between"><span>Asig. Colación</span><span>${activeCalculation.haberes.colacion.toLocaleString('es-CL')}</span></div>
                      </div>
                    </div>

                    {/* Descuentos */}
                    <div className="space-y-4">
                      <h4 className="font-bold border-b border-gray-300 pb-1 text-red-800 uppercase tracking-wider">Detalle Descuentos</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between"><span>AFP {selectedWorker.afpNombre}</span><span>${activeCalculation.descuentos.afpMonto.toLocaleString('es-CL')}</span></div>
                        <div className="flex justify-between"><span>Salud (7%)</span><span>${activeCalculation.descuentos.saludMonto.toLocaleString('es-CL')}</span></div>
                        <div className="flex justify-between"><span>Seguro Cesantía</span><span>${activeCalculation.descuentos.seguroCesantia.toLocaleString('es-CL')}</span></div>
                        <div className="flex justify-between"><span>Impuesto Único</span><span>$0</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 grid grid-cols-2 gap-8 border-t-2 border-emerald-800 pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between font-bold text-[14px]"><span>TOTAL HABERES</span><span>${activeCalculation.totales.totalHaberes.toLocaleString('es-CL')}</span></div>
                      <div className="flex justify-between font-bold text-[14px]"><span>TOTAL DESCUENTOS</span><span>${activeCalculation.totales.totalDescuentos.toLocaleString('es-CL')}</span></div>
                    </div>
                    <div className="bg-emerald-900 text-white p-4 rounded-xl flex items-center justify-between shadow-inner">
                      <span className="font-bold text-[16px]">ALCANCE LÍQUIDO</span>
                      <span className="font-bold text-[22px] font-mono">${activeCalculation.totales.alcanceLiquido.toLocaleString('es-CL')}</span>
                    </div>
                  </div>

                  <div className="mt-24 grid grid-cols-2 gap-20">
                    <div className="border-t border-gray-400 text-center pt-2 italic text-gray-500">Firma del Empleador</div>
                    <div className="border-t border-gray-400 text-center pt-2 italic text-gray-500">Firma del Trabajador</div>
                  </div>

                  <div className="mt-12 text-[10px] text-gray-400 text-center uppercase tracking-tighter border-t pt-4">
                    CERTIFICO QUE HE RECIBIDO DE MI EMPLEADOR, A MI ENTERA SATISFACCION, EL SALDO LIQUIDO INDICADO EN LA PRESENTE LIQUIDACION.
                    <p className="mt-1 font-mono">ID CONTROL: CP-{currentPeriod.year}-{(currentPeriod.month+1).toString().padStart(2,'0')}-{selectedWorker.rut.slice(0,4)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white border-t flex justify-end gap-3">
              <button onClick={() => setViewingPayslip(null)} className="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cerrar</button>
              <button disabled={!activeCalculation} className="flex items-center gap-2 px-6 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"><Download size={18} /> Descargar PDF</button>
              <button disabled={!activeCalculation} onClick={() => handlePrint(selectedWorker.nombre)} className="flex items-center gap-2 px-8 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 disabled:opacity-50"><Printer size={18} /> Imprimir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayslipList;
