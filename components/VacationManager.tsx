import React, { useState } from 'react';
import { Calendar, AlertTriangle, Check, X } from 'lucide-react';
import { Employee, VacationRequest } from '../types';
import { checkTeamConflict, isBadStartDate, validatePeriodSplit } from '../utils/dateLogic';

interface VacationManagerProps {
  employees: Employee[];
  vacations: VacationRequest[];
  setVacations: React.Dispatch<React.SetStateAction<VacationRequest[]>>;
}

export const VacationManager: React.FC<VacationManagerProps> = ({ employees, vacations, setVacations }) => {
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSimulate = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedEmpId || !startDate || !endDate) {
      setErrorMsg("Selecione colaborador e datas.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive

    if (end < start) {
      setErrorMsg("Data final deve ser após a inicial.");
      return;
    }

    // RN02: Minimum days
    if (!validatePeriodSplit(days)) {
      setErrorMsg("Período mínimo de 5 dias exigido.");
      return;
    }

    // RN03: Bad Start Date (Thursday/Friday/Weekend)
    if (isBadStartDate(startDate)) {
      setErrorMsg("Férias não podem iniciar Quinta, Sexta ou Fim de semana (RN03).");
      return;
    }

    // RN04: Team Conflict
    const employee = employees.find(e => e.id === selectedEmpId);
    if (employee && checkTeamConflict(employee, startDate, endDate, vacations, employees)) {
      setErrorMsg(`Conflito! Outro QA do ${employee.team} já está de férias neste período.`);
      return;
    }

    setSuccessMsg(`Período válido! Duração: ${days} dias. Pode agendar.`);
  };

  const handleSave = () => {
    if (!successMsg) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newVacation: VacationRequest = {
      id: Date.now().toString(),
      employeeId: selectedEmpId,
      startDate,
      endDate,
      status: 'planned',
      days
    };

    setVacations([...vacations, newVacation]);
    setStartDate('');
    setEndDate('');
    setSuccessMsg(null);
    alert("Férias agendadas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900">Programação de Férias</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 lg:col-span-1 h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Nova Solicitação</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Colaborador</label>
              <select 
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500"
                value={selectedEmpId}
                onChange={e => setSelectedEmpId(e.target.value)}
              >
                <option value="">Selecione...</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} - {e.team}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Início</label>
                <input 
                  type="date" 
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fim</label>
                <input 
                  type="date" 
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex gap-2 items-start">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex gap-2 items-start">
                <Check size={16} className="mt-0.5 shrink-0" />
                {successMsg}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleSimulate}
                className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Validar
              </button>
              <button 
                onClick={handleSave}
                disabled={!successMsg}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  successMsg 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-blue-200 text-blue-50 cursor-not-allowed'
                }`}
              >
                Agendar
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-blue-50">
            <h3 className="font-bold text-blue-900">Próximas Férias Agendadas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-slate-50 text-slate-600 text-sm">
                <tr>
                  <th className="p-3 text-left">Colaborador</th>
                  <th className="p-3 text-left">Período</th>
                  <th className="p-3 text-left">Dias</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vacations.map(vac => {
                  const emp = employees.find(e => e.id === vac.employeeId);
                  return (
                    <tr key={vac.id}>
                      <td className="p-3">
                        <div className="font-medium">{emp?.name || 'Desconhecido'}</div>
                        <div className="text-xs text-slate-500">{emp?.team}</div>
                      </td>
                      <td className="p-3 text-sm">
                        {new Date(vac.startDate).toLocaleDateString()} - {new Date(vac.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm">{vac.days}d</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          {vac.status === 'approved' ? 'Aprovado' : 'Planejado'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => setVacations(prev => prev.filter(v => v.id !== vac.id))}
                          className="text-red-400 hover:text-red-600"
                          title="Cancelar"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {vacations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Nenhuma férias agendada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};