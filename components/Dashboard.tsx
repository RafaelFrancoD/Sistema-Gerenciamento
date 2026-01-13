import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { AlertTriangle, CheckCircle, Users, Clock, Zap, Send, X, Mail } from 'lucide-react';
import { Employee, VacationRequest } from '../types';
import { calculateVacationDueDate, getDaysUntilDue } from '../utils/dateLogic';

interface DashboardProps {
  employees: Employee[];
  vacations: VacationRequest[];
}

export const Dashboard: React.FC<DashboardProps> = ({ employees, vacations }) => {
  const [notificationStatus, setNotificationStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedAlertIds, setSelectedAlertIds] = useState<string[]>([]);
  const [chartTimeRange, setChartTimeRange] = useState('6m'); // State for chart filter
  
  // Calculate stats
  const totalEmployees = employees.length;
  const activeVacations = vacations.filter(v => {
    const now = new Date();
    const start = new Date(v.startDate);
    const end = new Date(v.endDate);
    return now >= start && now <= end;
  }).length;

  // RN07 – Alerta de vencimento 30 dias antes.
  const alerts = employees.flatMap(emp => {
    const currentYear = new Date().getFullYear();
    const potentialAlerts = [];

    for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
      const acquisitionYear = currentYear + yearOffset;
      const dueDate = calculateVacationDueDate(emp.admissionDate, acquisitionYear);
      const daysLeft = getDaysUntilDue(dueDate);

      const vacationTakenForAcquisitionYear = vacations.some(
        v => v.employeeId === emp.id && v.acquisitionYear === acquisitionYear && v.status === 'approved'
      );

      if (daysLeft < 30 && !vacationTakenForAcquisitionYear) {
        potentialAlerts.push({ ...emp, daysLeft, acquisitionYear, dueDate });
      }
    }
    return potentialAlerts;
  })
  .sort((a, b) => a.daysLeft - b.daysLeft)
  .filter((alert, index, self) =>
    index === self.findIndex((a) => (
      a.id === alert.id
    ))
  );

  const pendingVacations = alerts.length;

  // --- DYNAMIC CHART DATA ---
  const generateChartData = (vacationData: VacationRequest[], timeRange: '6m' | '1y') => {
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const today = new Date();
    const data = [];
    
    const monthsToDisplay = timeRange === '1y' ? 12 : 6;

    // 1. Initialize data for the last N months
    for (let i = monthsToDisplay - 1; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = monthNames[d.getMonth()];
      const year = d.getFullYear().toString().slice(-2);
      data.push({ name: `${monthName}/${year}`, qtd: 0 });
    }

    // 2. Process each vacation request
    vacationData.forEach(vacation => {
      const start = new Date(vacation.startDate);
      const end = new Date(vacation.endDate);

      for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
        const monthIndex = day.getMonth();
        const year = day.getFullYear();

        const targetMonth = data.find(d => {
          const [name, yr] = d.name.split('/');
          const dMonthIndex = monthNames.indexOf(name);
          const dYear = parseInt(yr, 10) + 2000;
          return dMonthIndex === monthIndex && dYear === year;
        });

        if (targetMonth) {
          targetMonth.qtd += 1;
        }
      }
    });

    return data;
  };

  const chartData = generateChartData(vacations, chartTimeRange as '6m' | '1y');

  const handleOpenEmailModal = () => {
    if (alerts.length === 0) return;
    setSelectedAlertIds(alerts.map(a => a.id));
    setIsEmailModalOpen(true);
  };

  const toggleAlertSelection = (id: string) => {
    setSelectedAlertIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleConfirmSend = () => {
    if (selectedAlertIds.length === 0) return;
    
    setIsEmailModalOpen(false);
    setNotificationStatus('sending');
    
    setTimeout(() => {
      setNotificationStatus('sent');
      setTimeout(() => setNotificationStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600">
            Visão Geral
          </h2>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Monitoramento em tempo real da equipe</p>
        </div>
        
        <div className="bg-white px-4 py-2 rounded-full shadow-md border border-blue-100 flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
          <div className={`w-2 h-2 rounded-full ${alerts.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Sistema de Automação: <span className={alerts.length > 0 ? "text-red-600" : "text-green-600"}>{alerts.length > 0 ? 'Pendente' : 'Monitorando'}</span>
          </span>
        </div>
      </div>
      
      {/* KPI Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Users, label: "Total Colaboradores", value: totalEmployees, color: "blue" },
          { icon: CheckCircle, label: "Férias Ativas", value: activeVacations, color: "green" },
          { icon: Clock, label: "A vencer (30 dias)", value: pendingVacations, color: "orange" },
          { icon: Zap, label: "Eficiência do Time", value: "98%", color: "purple" }
        ].map((kpi, idx) => (
          <div 
            key={idx}
            className="group bg-white p-6 rounded-2xl border border-slate-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-200 cursor-default"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.color}-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`}></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className={`p-3 bg-${kpi.color}-100 text-${kpi.color}-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform`}>
                <kpi.icon size={26} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-3xl font-bold text-slate-800">{kpi.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
        
        {/* Chart Section */}
        <div className="xl:col-span-8 bg-white p-4 md:p-8 rounded-3xl shadow-lg border border-slate-100 transition-all hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg md:text-xl font-bold text-slate-800">Tendência de Férias</h3>
            <select 
              value={chartTimeRange}
              onChange={(e) => setChartTimeRange(e.target.value)}
              className="text-sm bg-slate-50 border-none rounded-lg px-3 py-1 text-slate-600 focus:ring-0 cursor-pointer hover:bg-slate-100"
            >
              <option value="6m">Últimos 6 meses</option>
              <option value="1y">Este ano</option>
            </select>
          </div>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorQtd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="qtd" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorQtd)" 
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full filter blur-[60px] opacity-20 animate-pulse"></div>
            
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10">
              <Zap size={20} className="text-yellow-400" />
              Automação de Avisos
            </h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10">
              {alerts.length} colaboradores precisam ser notificados.
            </p>

            <button 
              onClick={handleOpenEmailModal}
              disabled={alerts.length === 0 || notificationStatus !== 'idle'}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all relative z-10 ${
                notificationStatus === 'sent' 
                  ? 'bg-green-500 text-white' 
                  : notificationStatus === 'sending'
                    ? 'bg-blue-600 text-white cursor-wait'
                    : alerts.length > 0 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 shadow-lg shadow-blue-900/50' 
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {notificationStatus === 'idle' && (
                <> <Send size={18} /> Disparar Emails Agora </>
              )}
              {notificationStatus === 'sending' && "Enviando..."}
              {notificationStatus === 'sent' && "Enviado com Sucesso!"}
            </button>
          </div>

          <div className="flex-1 bg-gradient-to-br from-red-900 via-red-800 to-rose-900 rounded-3xl shadow-2xl overflow-hidden border border-red-700/50 relative group min-h-[300px]">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500 rounded-full filter blur-[50px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>

            <div className="p-6 relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-500/20 p-2 rounded-full backdrop-blur-sm border border-red-400/30">
                  <AlertTriangle className="text-red-200" size={20} />
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Risco de Vencimento
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 max-h-[400px]">
                {alerts.length === 0 ? (
                  <p className="text-red-200/60 text-center mt-10">Tudo sob controle.</p>
                ) : (
                  alerts.map(alert => (
                    <div key={alert.id} className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:bg-white/20 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white text-sm">{alert.name}</p>
                          <p className="text-xs text-red-200">{alert.team}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-white leading-none">{alert.daysLeft}</p>
                          <p className="text-[10px] uppercase tracking-wider text-red-300">Dias Restantes</p>
                        </div>
                      </div>
                      <div className="w-full bg-black/30 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div 
                          className="h-full bg-red-400 rounded-full" 
                          style={{ width: `${Math.max(0, 100 - (alert.daysLeft / 30) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Selection Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-blue-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900">Selecionar Destinatários</h3>
                  <p className="text-xs text-slate-500">Escolha quem receberá o aviso de vencimento</p>
                </div>
              </div>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto custom-scrollbar bg-slate-50 flex-1">
              <div className="flex justify-between items-center mb-3 px-2">
                <span className="text-xs font-bold uppercase text-slate-500">Colaboradores em Risco ({alerts.length})</span>
                <button 
                  onClick={() => setSelectedAlertIds(selectedAlertIds.length === alerts.length ? [] : alerts.map(a => a.id))}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  {selectedAlertIds.length === alerts.length ? 'Desmarcar Todos' : 'Marcar Todos'}
                </button>
              </div>

              <div className="space-y-2">
                {alerts.map(alert => {
                  const isSelected = selectedAlertIds.includes(alert.id);
                  return (
                    <div 
                      key={alert.id}
                      onClick={() => toggleAlertSelection(alert.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-white border-blue-500 shadow-sm' 
                          : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-100 border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle size={14} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className={`font-bold text-sm ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>{alert.name}</p>
                          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{alert.daysLeft} dias</span>
                        </div>
                        <p className="text-xs text-slate-400">{alert.email}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setIsEmailModalOpen(false)} 
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmSend} 
                disabled={selectedAlertIds.length === 0}
                className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all ${
                  selectedAlertIds.length > 0 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20 hover:-translate-y-0.5' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send size={16} /> 
                Enviar ({selectedAlertIds.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};