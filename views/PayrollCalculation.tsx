
import React, { useState } from 'react';
import { usePayroll } from '../App.tsx';
import { Play, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { saveData } from '../db.ts';
import { CalculatedPayroll } from '../types.ts';

const PayrollCalculation: React.FC = () => {
  const { currentPeriod, workers, showToast } = usePayroll();
  const [isCalculating, setIsCalculating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);

  const performCalculations = async () => {
    const IMM = 440000; // Ingreso Mínimo Mensual
    const TOPE_GRATIFICACION = Math.round((IMM * 4.75) / 12);

    for (const worker of workers) {
      const sueldoBase = worker.sueldoBase;
      
      // Gratificación Legal Art. 50 (25% con tope 4.75 IMM)
      let gratificacion = Math.round(sueldoBase * 0.25);
      if (gratificacion > TOPE_GRATIFICACION) {
        gratificacion = TOPE_GRATIFICACION;
      }

      const movilizacion = 55000;
      const colacion = 55000;
      
      const totalImponible = sueldoBase + gratificacion;
      
      // Tasas Reales 2023/2024
      const afpTasa = 0.1145; // Promedio
      const saludTasa = 0.07;
      const afcTasa = worker.hasSeguroCesantia ? 0.006 : 0;
      
      const afpMonto = Math.round(totalImponible * afpTasa);
      const saludMonto = Math.round(totalImponible * saludTasa);
      const seguroCesantia = Math.round(totalImponible * afcTasa);
      
      // Impuesto Único (Simplificado para el demo)
      let impuestoUnico = 0;
      const baseTributable = totalImponible - afpMonto - saludMonto - seguroCesantia;
      if (baseTributable > 800000) {
        impuestoUnico = Math.round((baseTributable - 800000) * 0.04);
      }
      
      const totalDescuentos = afpMonto + saludMonto + seguroCesantia + impuestoUnico;
      const totalHaberes = totalImponible + movilizacion + colacion;
      const alcanceLiquido = totalHaberes - totalDescuentos;

      const calcResult: CalculatedPayroll & { id: string } = {
        id: `${worker.id}_${currentPeriod.month}_${currentPeriod.year}`,
        workerId: worker.id,
        periodo: { ...currentPeriod },
        haberes: {
          sueldoBase,
          gratificacion,
          movilizacion,
          colacion,
          otrosImponibles: 0
        },
        descuentos: {
          afpMonto,
          saludMonto,
          seguroCesantia,
          impuestoUnico,
          anticipos: 0
        },
        totales: {
          totalHaberes,
          totalImponible,
          totalDescuentos,
          alcanceLiquido
        }
      };

      await saveData('calculations', calcResult);
    }
  };

  const startCalculation = () => {
    setIsCalculating(true);
    setIsFinished(false);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          performCalculations().then(() => {
            setIsCalculating(false);
            setIsFinished(true);
            showToast(`Cálculo Transtecnia finalizado para ${workers.length} fichas.`);
          });
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Proceso de Cálculo Mensual</h1>
        <p className="text-gray-500">Motor de Reglas de Negocio Transtecnia (Ref. Cap 7.1)</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 bg-emerald-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Periodo Activo</p>
            <h2 className="text-2xl font-bold">{MONTHS[currentPeriod.month]} {currentPeriod.year}</h2>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Trabajadores</p>
            <h2 className="text-2xl font-bold">{workers.length} Procesables</h2>
          </div>
        </div>

        <div className="p-10 space-y-8">
          {isCalculating ? (
            <div className="space-y-6">
              <div className="flex justify-between text-sm font-bold text-gray-600">
                <span>Ejecutando algoritmos de previsión...</span>
                <span className="text-emerald-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="bg-emerald-600 h-full transition-all duration-300 shadow-[0_0_15px_rgba(5,150,105,0.5)]" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-xs text-gray-400 italic">Validando topes imponibles UF y Gratificación Art. 50...</p>
            </div>
          ) : isFinished ? (
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl flex flex-col items-center text-center space-y-4 animate-in zoom-in-95">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-900 uppercase">Cálculo Terminado</h3>
                <p className="text-sm text-emerald-700 mt-1">Los resultados han sido persistidos en la base de datos local y están listos para la centralización contable.</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all">
                  <FileText size={18} /> Emitir Liquidaciones
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-800 text-sm">
                <AlertCircle className="shrink-0" />
                <p>Este proceso aplicará automáticamente las leyes sociales vigentes y generará los pasivos para <strong>Contador Pro Analytics</strong>.</p>
              </div>
              <button 
                onClick={startCalculation}
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
              >
                <Play size={24} fill="currentColor" />
                Iniciar Proceso de Remuneraciones
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollCalculation;
