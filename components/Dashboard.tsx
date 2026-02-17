import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Users, Clock, Zap, X } from 'lucide-react';
import { Employee, VacationRequest } from '../types';

interface DashboardProps {
  employees: Employee[];
  vacations: VacationRequest[];
}

export const Dashboard: React.FC<DashboardProps> = ({ employees, vacations }) => {
  const [activeVacationsModalOpen, setActiveVacationsModalOpen] = useState(false);
  const [expiringVacationsModalOpen, setExpiringVacationsModalOpen] = useState(false);
  const [takenVacationsModalOpen, setTakenVacationsModalOpen] = useState(false);
  const [expiringDaysFilter, setExpiringDaysFilter] = useState(30);
  
  // Calculate stats
  const totalEmployees = employees.length;

  const activeVacationsData = vacations.filter(v => {
    const now = new Date();
    const start = new Date(v.startDate);
    const end = new Date(v.endDate);
    return now >= start && now <= end;
  });
  const activeVacations = activeVacationsData.length;

  // Férias a vencer baseado em férias aprovadas (status approved) - mínimo 7 dias
  const expiringVacationsData = vacations
    .filter(v => v.status === 'approved')
    .map(v => {
      const endDate = new Date(v.endDate);
      const now = new Date();
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const emp = employees.find(e => e.id === v.employeeId);
      if (!emp) return null;
      if (daysLeft >= 7 && daysLeft <= expiringDaysFilter) {
        return { ...emp, daysLeft, vacation: v, endDate: v.endDate };
      }
      return null;
    })
    .filter(Boolean) as Array<Employee & { daysLeft: number; vacation: VacationRequest; endDate: string }>;

  // Férias gozadas no ano corrente (apenas com endDate já passado)
  const currentYear = new Date().getFullYear();
  const now = new Date();
  const takenVacationsData = employees.map(emp => {
    const empVacations = vacations.filter(v =>
      v.employeeId === emp.id &&
      v.status === 'approved' &&
      v.acquisitionYear === currentYear &&
      new Date(v.endDate) < now
    );
    return {
      employee: emp,
      vacations: empVacations,
      count: empVacations.length
    };
  }).filter(data => data.count > 0);

  const totalVacationsTaken = takenVacationsData.reduce((sum, data) => sum + data.count, 0);

  const pendingVacations = expiringVacationsData.length;

  // --- CONFLICT DETECTION ---
  // Detect vacation conflicts (overlapping periods, QA conflicts)
  const conflictData = React.useMemo(() => {
    const conflicts: Array<{
      type: 'overlap' | 'qa';
      employees: string[];
      period: { start: string; end: string };
      conflictDays: number;
      team?: string;
    }> = [];

    const approvedOrPlanned = vacations.filter(v =>
      v.status === 'approved' || v.status === 'planned' || v.status === 'pending'
    );

    // Check for overlapping vacation periods
    for (let i = 0; i < approvedOrPlanned.length; i++) {
      for (let j = i + 1; j < approvedOrPlanned.length; j++) {
        const v1 = approvedOrPlanned[i];
        const v2 = approvedOrPlanned[j];

        const start1 = new Date(v1.startDate);
        const end1 = new Date(v1.endDate);
        const start2 = new Date(v2.startDate);
        const end2 = new Date(v2.endDate);

        // Check if periods overlap
        const hasOverlap = !(end1 < start2 || start1 > end2);

        if (hasOverlap) {
          const emp1 = employees.find(e => e.id === v1.employeeId);
          const emp2 = employees.find(e => e.id === v2.employeeId);

          if (emp1 && emp2) {
            // Calculate actual overlap period (intersection, not union)
            const overlapStart = start1 > start2 ? v1.startDate : v2.startDate;
            const overlapEnd = end1 < end2 ? v1.endDate : v2.endDate;

            // Calculate conflict days
            const overlapStartDate = new Date(overlapStart);
            const overlapEndDate = new Date(overlapEnd);
            const conflictDays = Math.ceil((overlapEndDate.getTime() - overlapStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

            // Check if it's a QA conflict (both QAs from same team)
            if (emp1.role === 'QA' && emp2.role === 'QA' && emp1.team === emp2.team) {
              conflicts.push({
                type: 'qa',
                employees: [emp1.name, emp2.name],
                period: {
                  start: overlapStart,
                  end: overlapEnd
                },
                conflictDays,
                team: emp1.team
              });
            } else {
              // General overlap conflict
              conflicts.push({
                type: 'overlap',
                employees: [emp1.name, emp2.name],
                period: {
                  start: overlapStart,
                  end: overlapEnd
                },
                conflictDays
              });
            }
          }
        }
      }
    }

    // Remove duplicate conflicts
    return conflicts.filter((conflict, index, self) =>
      index === self.findIndex(c =>
        c.type === conflict.type &&
        JSON.stringify(c.employees.sort()) === JSON.stringify(conflict.employees.sort()) &&
        c.period.start === conflict.period.start
      )
    );
  }, [vacations, employees]);



  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600">
            Visão Geral
          </h2>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Monitoramento em tempo real da equipe</p>
        </div>
      </div>
      
      {/* KPI Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Total Colaboradores */}
        <div className="group bg-white p-6 rounded-2xl border border-slate-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-200 cursor-default">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
              <Users size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Colaboradores</p>
              <p className="text-3xl font-bold text-slate-800">{totalEmployees}</p>
            </div>
          </div>
        </div>

        {/* Férias Ativas - Clicável */}
        <div
          onClick={() => setActiveVacationsModalOpen(true)}
          className="group bg-white p-6 rounded-2xl border border-slate-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-green-200 cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
              <CheckCircle size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Férias Ativas</p>
              <p className="text-3xl font-bold text-slate-800">{activeVacations}</p>
            </div>
          </div>
        </div>

        {/* A vencer - Clicável */}
        <div
          onClick={() => setExpiringVacationsModalOpen(true)}
          className="group bg-white p-6 rounded-2xl border border-slate-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-orange-200 cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
              <Clock size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Férias a vencer</p>
              <p className="text-3xl font-bold text-slate-800">{pendingVacations}</p>
            </div>
          </div>
        </div>

        {/* Férias Gozadas no Ano - Clicável */}
        <div
          onClick={() => setTakenVacationsModalOpen(true)}
          className="group bg-white p-6 rounded-2xl border border-slate-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-purple-200 cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
              <Zap size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Férias Gozadas em {currentYear}</p>
              <p className="text-3xl font-bold text-slate-800">{totalVacationsTaken}</p>
            </div>
          </div>
        </div>
      </div>


      {/* Conflicts Section */}
      {conflictData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden">
          <div className="p-4 border-b border-orange-100 bg-orange-50 flex items-center gap-2">
            <AlertTriangle className="text-orange-600" size={20} />
            <h3 className="font-bold text-orange-900">Conflitos Detectados ({conflictData.length})</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-600 mb-4">
              Os seguintes conflitos de férias foram identificados e podem requerer atenção:
            </p>
            <div className="space-y-4">
              {conflictData.map((conflict, index) => {
                const formatDate = (iso: string) => {
                  const parts = iso.split('-');
                  if (parts.length === 3) {
                    const year = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    const day = parseInt(parts[2], 10);
                    return new Date(year, month, day).toLocaleDateString('pt-BR');
                  }
                  return iso;
                };

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      conflict.type === 'qa'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        conflict.type === 'qa' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        <AlertTriangle
                          size={18}
                          className={conflict.type === 'qa' ? 'text-red-600' : 'text-yellow-600'}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            conflict.type === 'qa'
                              ? 'bg-red-200 text-red-800'
                              : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            {conflict.type === 'qa' ? 'Conflito de QA' : 'Sobreposição de Período'}
                          </span>
                          {conflict.team && (
                            <span className="text-xs text-slate-500">Time: {conflict.team}</span>
                          )}
                        </div>
                        <p className="font-medium text-slate-800 mb-1">
                          {conflict.employees.join(' e ')}
                        </p>
                        <p className="text-sm text-slate-600">
                          Período de conflito: {formatDate(conflict.period.start)} até {formatDate(conflict.period.end)}
                        </p>
                        <p className="text-sm text-slate-600 font-semibold mt-1">
                          Quantidade de dias de conflito: {conflict.conflictDays} dia{conflict.conflictDays > 1 ? 's' : ''}
                        </p>
                        {conflict.type === 'qa' && (
                          <p className="text-xs text-red-700 mt-2 font-medium">
                            ⚠ Atenção: Ambos os QAs do time estarão ausentes simultaneamente!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal Férias Ativas */}
      {activeVacationsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-green-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-900">Férias Ativas</h3>
                  <p className="text-xs text-slate-500">Colaboradores atualmente de férias</p>
                </div>
              </div>
              <button onClick={() => setActiveVacationsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50 flex-1">
              {activeVacationsData.length === 0 ? (
                <p className="text-center text-slate-400 py-8">Nenhum colaborador em férias no momento.</p>
              ) : (
                <div className="space-y-3">
                  {activeVacationsData.map(vac => {
                    const emp = employees.find(e => e.id === vac.employeeId);
                    if (!emp) return null;
                    const formatDate = (iso: string) => {
                      const parts = iso.split('-');
                      if (parts.length === 3) {
                        const year = parseInt(parts[0], 10);
                        const month = parseInt(parts[1], 10) - 1;
                        const day = parseInt(parts[2], 10);
                        return new Date(year, month, day).toLocaleDateString('pt-BR');
                      }
                      return iso;
                    };
                    return (
                      <div key={vac.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-800">{emp.name}</p>
                            <p className="text-xs text-slate-500">{emp.team} • {emp.role}</p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Ativo</span>
                        </div>
                        <div className="mt-3 text-sm text-slate-600">
                          <p><strong>Período:</strong> {formatDate(vac.startDate)} até {formatDate(vac.endDate)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <button
                onClick={() => setActiveVacationsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Férias a Vencer */}
      {expiringVacationsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-orange-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-orange-900">Férias a Vencer</h3>
                  <p className="text-xs text-slate-500">Colaboradores com férias próximas do vencimento</p>
                </div>
              </div>
              <button onClick={() => setExpiringVacationsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 bg-orange-50/50 border-b border-orange-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Filtrar por dias:</span>
              <select
                value={expiringDaysFilter}
                onChange={(e) => setExpiringDaysFilter(parseInt(e.target.value))}
                className="text-sm bg-white border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value={7}>7 dias</option>
                <option value={15}>15 dias</option>
                <option value={30}>30 dias</option>
                <option value={45}>45 dias</option>
                <option value={60}>60 dias</option>
              </select>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50 flex-1">
              {expiringVacationsData.length === 0 ? (
                <p className="text-center text-slate-400 py-8">Nenhuma féria aprovada próxima do término.</p>
              ) : (
                <div className="space-y-3">
                  {expiringVacationsData.map(data => {
                    const formatDate = (iso: string) => {
                      const parts = iso.split('-');
                      if (parts.length === 3) {
                        const year = parseInt(parts[0], 10);
                        const month = parseInt(parts[1], 10) - 1;
                        const day = parseInt(parts[2], 10);
                        return new Date(year, month, day).toLocaleDateString('pt-BR');
                      }
                      return iso;
                    };
                    return (
                      <div key={`${data.id}-${data.vacation.id}`} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-800">{data.name}</p>
                            <p className="text-xs text-slate-500">{data.team}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            data.daysLeft < 15 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {data.daysLeft} dias
                          </span>
                        </div>
                        <div className="mt-3 text-sm text-slate-600">
                          <p><strong>Término:</strong> {formatDate(data.endDate)}</p>
                          <p><strong>Período:</strong> {formatDate(data.vacation.startDate)} até {formatDate(data.endDate)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <button
                onClick={() => setExpiringVacationsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Férias Gozadas no Ano */}
      {takenVacationsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-purple-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-900">Férias Gozadas em {currentYear}</h3>
                  <p className="text-xs text-slate-500">Colaboradores que já concluíram férias este ano</p>
                </div>
              </div>
              <button onClick={() => setTakenVacationsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50 flex-1">
              {takenVacationsData.length === 0 ? (
                <p className="text-center text-slate-400 py-8">Nenhum colaborador gozou férias em {currentYear} ainda.</p>
              ) : (
                <div className="space-y-3">
                  {takenVacationsData.map(data => {
                    const formatDate = (iso: string) => {
                      const parts = iso.split('-');
                      if (parts.length === 3) {
                        const year = parseInt(parts[0], 10);
                        const month = parseInt(parts[1], 10) - 1;
                        const day = parseInt(parts[2], 10);
                        return new Date(year, month, day).toLocaleDateString('pt-BR');
                      }
                      return iso;
                    };
                    const hasTwoPeriodsOrMore = data.count >= 2;
                    return (
                      <div key={data.employee.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-bold text-slate-800">{data.employee.name}</p>
                            <p className="text-xs text-slate-500">{data.employee.team}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                              {data.count} período{data.count > 1 ? 's' : ''}
                            </span>
                            {hasTwoPeriodsOrMore && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                                ✓ Completo
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {data.vacations.map((vac, idx) => (
                            <div key={vac.id} className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                              <span className="font-semibold">{idx + 1}° Período:</span> {formatDate(vac.startDate)} até {formatDate(vac.endDate)}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <button
                onClick={() => setTakenVacationsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};