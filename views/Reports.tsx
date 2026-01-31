
import React from 'react';
import { usePayroll } from '../App';
import { BookOpen, FileSpreadsheet, ShieldCheck, PieChart, Users, ChevronRight, FileOutput } from 'lucide-react';

const ReportsView: React.FC = () => {
  const { currentPeriod } = usePayroll();
  const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const reportGroups = [
    {
      title: 'Libros Legales',
      items: [
        { name: 'Libro de Remuneraciones Electrónico (LRE)', desc: 'Formato XML/CSV para la Dirección del Trabajo.', icon: <BookOpen className="text-blue-600" /> },
        { name: 'Libro de Remuneraciones Estándar', desc: 'Resumen detallado de haberes y descuentos por periodo.', icon: <FileOutput className="text-emerald-600" /> },
      ]
    },
    {
      title: 'Previsión y Tesorería',
      items: [
        { name: 'Archivo Previred (105 Campos)', desc: 'Generación de archivo para pago masivo de leyes sociales.', icon: <ShieldCheck className="text-red-600" /> },
        { name: 'Nómina de Pago de Sueldos (Bancos)', desc: 'Exportación masiva para transferencias bancarias.', icon: <FileOutput className="text-amber-600" /> },
      ]
    },
    {
      title: 'Gestión y Análisis',
      items: [
        { name: 'Resumen Centro de Costos', desc: 'Desglose de gastos por unidad de negocio.', icon: <PieChart className="text-purple-600" /> },
        { name: 'Certificado de Renta (F1887)', desc: 'Declaración jurada anual de sueldos.', icon: <FileSpreadsheet className="text-teal-600" /> },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Informes y Consultas</h1>
          <p className="text-gray-500">Reportes legales y de gestión para {MONTHS[currentPeriod.month]} {currentPeriod.year} (Ref. Cap 6.1)</p>
        </div>
        <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-bold text-xs uppercase">
          Periodo Activo
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reportGroups.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{group.title}</h3>
            <div className="space-y-3">
              {group.items.map((item, i) => (
                <div key={i} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm group-hover:text-emerald-700 transition-colors">{item.name}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">{item.desc}</p>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-emerald-500 mt-1" size={16} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Consolidador de Movimientos Mensuales</h3>
            <p className="text-emerald-300 text-sm">Genera un informe consolidado de todos los trabajadores para revisión de auditoría.</p>
          </div>
          <button className="px-8 py-3 bg-white text-emerald-900 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg shadow-emerald-950/20">
            Descargar Consolidado
          </button>
        </div>
        <Users className="absolute -bottom-4 -right-4 text-emerald-800/50" size={180} />
      </div>
    </div>
  );
};

export default ReportsView;
