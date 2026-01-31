
import React, { useState } from 'react';
import { usePayroll } from '../App';
import { Play, Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { saveData } from '../db';
import { CalculatedPayroll } from '../types';

const PayrollCalculation: React.FC = () => {
  const { currentPeriod, workers, showToast } = usePayroll();
  const [isCalculating, setIsCalculating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);

  const performCalculations = async () => {
    // Simulate real calculations for each worker
    for (const worker of workers) {
      const sueldoBase = worker.sueldoBase;
      const gratificacion = Math.min(sueldoBase * 0.25, 158452); // Simplified grat. legal
      const movilizacion = 45000;
      const colacion = 45000;
      
      const totalImponible = sueldoBase + gratificacion;
      const afpMonto = Math.round(totalImponible * 0.1145);
      const saludMonto = Math.round(totalImponible * 0.07);
      const seguroCesantia = Math.round(totalImponible * 0.006);
      
      const totalDescuentos = afpMonto + saludMonto + seguroCesantia;
      const alcanceLiquido = (totalImponible + movilizacion + colacion) - totalDescuentos;

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
          impuestoUnico: 0,
          anticipos: 0
        },
        totales: {
          totalHaberes: totalImponible + movilizacion + colacion,
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
    
    const interval = setInterval(async () => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          performCalculations().then(() => {
            setIsCalculating(false);
            setIsFinished(true);
            showToast(`Cálculo finalizado y persistido para ${workers.length} trabajadores.`);
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Proceso de Cálculo Mensual</h1>
        <p className="text-gray-500">Generación de liquidaciones y libro de remuneraciones (Ref. Cap 7.1)</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 bg-emerald-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Periodo a Procesar</p>
            <h2 className="text-2xl font-bold">{MONTHS[currentPeriod.month]} {currentPeriod.year}</h2>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Total Fichas</p>
            <h2 className="text-2xl font-bold">{workers.length} Activos</h2>
          </div>
        </div>

        <div className="p-10 space-y-8">
          {!isCalculating && !isFinished && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 items-center">
              <AlertCircle className="text-amber-500" />
              <p className="text-sm text-amber-800 font-medium">
                Asegúrese de haber ingresado todos los movimientos mensuales antes de iniciar el cálculo.
              </p>
            </div>
          )}

          {isCalculating && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold text-gray-600">
                <span>Procesando Fórmulas Legales...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-xs text-gray-400 animate-pulse">Calculando Gratificación Legal (Art. 47 y 50)...</p>
            </div>
          )}

          {isFinished && (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900">¡Proceso Exitoso!</h3>
                <p className="text-sm text-emerald-700">Las liquidaciones están listas para su revisión y emisión.</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700">
                  <FileText size={16} /> Ver Liquidaciones
                </button>
                <button className="flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-50">
                   Libro de Remuneraciones
                </button>
              </div>
            </div>
          )}

          {!isCalculating && !isFinished && (
            <button 
              onClick={startCalculation}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
            >
              <Play size={24} fill="currentColor" />
              Iniciar Cálculo de Remuneraciones
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollCalculation;
