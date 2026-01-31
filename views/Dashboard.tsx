
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { DollarSign, Users, Clock, AlertCircle } from 'lucide-react';
import { usePayroll } from '../App.tsx';

const data = [
  { name: 'Ene', total: 4500000 },
  { name: 'Feb', total: 4600000 },
  { name: 'Mar', total: 5200000 },
  { name: 'Abr', total: 4800000 },
  { name: 'May', total: 5100000 },
  { name: 'Jun', total: 5900000 },
  { name: 'Jul', total: 6100000 },
  { name: 'Ago', total: 6250000 },
];

const pieData = [
  { name: 'Imponible', value: 75, color: '#059669' },
  { name: 'Previsión', value: 15, color: '#10b981' },
  { name: 'Salud', value: 10, color: '#34d399' },
];

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const Dashboard: React.FC = () => {
  const { currentPeriod } = usePayroll();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resumen Ejecutivo de Remuneraciones</h1>
        <p className="text-sm text-gray-500">Periodo activo: <span className="font-bold text-emerald-600">{MONTHS[currentPeriod.month]} {currentPeriod.year}</span></p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Costo Total Empresa', value: '$6.250.815', icon: <DollarSign className="text-emerald-600" />, trend: '+3.2%' },
          { label: 'Trabajadores Activos', value: '42', icon: <Users className="text-blue-600" />, trend: '0' },
          { label: 'Horas Extras Mes', value: '124.5', icon: <Clock className="text-amber-600" />, trend: '-12%' },
          { label: 'Pendientes Cierre', value: '3', icon: <AlertCircle className="text-red-600" />, trend: 'Revisión' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
              <p className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : stat.trend === '0' ? 'text-gray-400' : 'text-red-500'}`}>
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-700">Evolución de Gasto en Remuneraciones</h3>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-gray-400 uppercase">Año {currentPeriod.year}</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `$${v/1000000}M`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#059669' : '#10b981'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-6">Distribución de Costos ({MONTHS[currentPeriod.month]})</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
