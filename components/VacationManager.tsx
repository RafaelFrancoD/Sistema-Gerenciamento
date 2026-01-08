import React, { useState, useEffect } from 'react';
import { VacationRequest, Employee } from '../types';
import { getSuggestedMonths, getSuggestedDatesForMonth, validateVacationRequest, addDays } from '../utils/dateLogic';
import { Calendar, Users, Search, Check, X as IconX, AlertTriangle, Edit2, Trash2 } from 'lucide-react';

interface VacationManagerProps {
  employees: Employee[];
  vacations: VacationRequest[];
  setVacations: React.Dispatch<React.SetStateAction<VacationRequest[]>>;
}

export const VacationManager: React.FC<VacationManagerProps> = ({ employees, vacations, setVacations }) => {
  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [acquisitionYear, setAcquisitionYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState(30);
  const [endDate, setEndDate] = useState('');
  
  // Validation State
  const [isValidated, setIsValidated] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [editingVacationId, setEditingVacationId] = useState<string | null>(null);
  const [originalStartDate, setOriginalStartDate] = useState<string | null>(null);
  const [originalEndDate, setOriginalEndDate] = useState<string | null>(null);
  const [originalStatus, setOriginalStatus] = useState<string | null>(null);

  // Suggestion State
  const [suggestedMonths, setSuggestedMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [suggestedDates, setSuggestedDates] = useState<Date[]>([]);
  const [impediments, setImpediments] = useState<string[]>([]);

  // Calculate End Date automatically
  useEffect(() => {
    if (startDate && days > 0) {
      const start = new Date(startDate + 'T00:00:00'); // Ensure UTC for consistent day/month
      const end = addDays(start, days - 1); // -1 because the start date is inclusive
      setEndDate(end.toISOString().split('T')[0]);
    } else {
      setEndDate('');
    }
    setIsValidated(false);
    setValidationMessage('');
  }, [startDate, days]);

  const handleValidate = () => {
    if (!employeeId || !startDate || !endDate || !acquisitionYear) {
      setValidationMessage('Erro: Preencha Colaborador, Ano de Aquisição, Data de Início e Dias.');
      setIsValidated(false);
      return;
    }

    const requestToValidate: VacationRequest = {
      id: 'temp-validation', // Use a temporary ID for validation
      employeeId,
      startDate,
      endDate,
      status: 'planned', // Status for validation
      acquisitionYear, // Pass acquisitionYear
    };

    const validationResult = validateVacationRequest(requestToValidate, vacations, employees);

    if (validationResult.isValid) {
      setIsValidated(true);
      setValidationMessage('Sucesso: Período de férias é válido e pode ser solicitado.');
    } else {
      setIsValidated(false);
      setValidationMessage(`Erro: ${validationResult.message}`);
    }
  };

  const handleRequest = () => {
    // If not validated, or validated but with a message indicating special approval is needed
    if (!isValidated && !validationMessage.includes('Requer aprovação especial.')) {
      alert('Por favor, valide o período de férias antes de solicitar.');
      return;
    }

    // Check if editing a rejected request
    if (editingVacationId && originalStatus === 'rejected') {
      // Validate that dates have changed
      if (startDate === originalStartDate && endDate === originalEndDate) {
        alert('Erro: Para reenviar uma solicitação rejeitada, você deve alterar as datas solicitadas.');
        return;
      }
    }

    // Prevent duplicates / overlapping for the same employee
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
    for (const v of vacations) {
      if (editingVacationId && v.id === editingVacationId) continue;
      if (v.employeeId !== employeeId) continue;
      const existingStart = new Date(v.startDate);
      const existingEnd = new Date(v.endDate);
      const overlaps = !(newEnd < existingStart || newStart > existingEnd);
      if (overlaps) {
        alert('Conflito: já existe uma solicitação de férias neste período para o colaborador selecionado.');
        return;
      }
      if (v.startDate === startDate && v.endDate === endDate) {
        alert('Já existe uma solicitação idêntica registrada para esse colaborador.');
        return;
      }
    }

    if (editingVacationId) {
      // Update existing
      setVacations(prev => prev.map(v => v.id === editingVacationId ? {
        ...v,
        employeeId,
        startDate,
        endDate,
        acquisitionYear,
        days, // Store the number of days
        specialApprovalReason: isValidated ? undefined : validationMessage,
        // If editing a rejected request with new dates, change status to pending
        status: (originalStatus === 'rejected' && (startDate !== originalStartDate || endDate !== originalEndDate)) ? 'pending' : v.status,
      } : v));
      setEditingVacationId(null);
      setOriginalStartDate(null);
      setOriginalEndDate(null);
      setOriginalStatus(null);
    } else {
      const newRequest: VacationRequest = {
        id: Date.now().toString(), // Use string ID
        employeeId,
        startDate,
        endDate,
        status: 'planned', // New requests start as 'planned'
        acquisitionYear,
        days, // Store the number of days
        specialApprovalReason: isValidated ? undefined : validationMessage, // Set reason if not fully valid
      };
      setVacations([...vacations, newRequest]);
    }

    // Reset form
    setEmployeeId('');
    setAcquisitionYear(new Date().getFullYear());
    setStartDate('');
    setDays(30);
    setIsValidated(false);
    setValidationMessage('');
  };

  const handleEditVacation = (id: string) => {
    const req = vacations.find(v => v.id === id);
    if (!req) return;
    setEditingVacationId(id);
    setEmployeeId(req.employeeId);
    setStartDate(req.startDate);
    // Store original dates and status for validation
    setOriginalStartDate(req.startDate);
    setOriginalEndDate(req.endDate);
    setOriginalStatus(req.status);
    // calculate days from start/end
    const s = new Date(req.startDate);
    const e = new Date(req.endDate);
    const diffDays = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    setDays(diffDays);
    setAcquisitionYear(req.acquisitionYear || new Date().getFullYear());
    setIsValidated(false);
    setValidationMessage('');
  };

  const handleDeleteVacation = (id: string) => {
    const req = vacations.find(v => v.id === id);
    if (!req) return;
    const confirmDelete = window.confirm(`Deseja realmente excluir a solicitação de férias de ${getEmployeeName(req.employeeId)} (${new Date(req.startDate).toLocaleDateString('pt-BR')} - ${new Date(req.endDate).toLocaleDateString('pt-BR')})?`);
    if (!confirmDelete) return;
    setVacations(prev => prev.filter(v => v.id !== id));
    if (editingVacationId === id) {
      setEditingVacationId(null);
      setOriginalStartDate(null);
      setOriginalEndDate(null);
      setOriginalStatus(null);
    }
  };

  const handleSuggestMonths = () => {
    if (!employeeId || !acquisitionYear) {
      alert('Por favor, selecione um funcionário e o Ano de Aquisição para obter sugestões de datas.');
      return;
    }
    const suggestions = getSuggestedMonths(employeeId, employees, vacations, acquisitionYear);
    setSuggestedMonths(suggestions);
    setSelectedMonth(null);
    setSuggestedDates([]);
    setImpediments([]);
  };

  const handleSelectMonth = (month: string) => {
    setSelectedMonth(month);
    if (!employeeId || !acquisitionYear) {
      setImpediments(["Selecione um funcionário e o Ano de Aquisição."]);
      setSuggestedDates([]);
      return;
    }
    const result = getSuggestedDatesForMonth(month, employeeId, employees, vacations, acquisitionYear);
    if (result.dates.length > 0) {
      setSuggestedDates(result.dates);
      setImpediments([]);
    } else {
      setSuggestedDates([]);
      setImpediments(result.impediments.length > 0 ? result.impediments : ["Nenhuma data disponível neste mês devido a regras de negócio ou conflitos."]);
    }
  };
  
  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Desconhecido';

  return (
    <div className="space-y-6">
      {/* --- CARD DE NOVA SOLICITAÇÃO --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-1">
          {editingVacationId ? (originalStatus === 'rejected' ? 'Editar Solicitação Rejeitada' : 'Editar Solicitação') : 'Nova Solicitação'}
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          {editingVacationId && originalStatus === 'rejected'
            ? 'Altere as datas da solicitação rejeitada, valide e envie novamente para aprovação.'
            : 'Preencha os dados, valide e depois solicite o período.'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="employee-select" className="text-xs font-bold text-slate-500 uppercase">Colaborador</label>
            <select id="employee-select" className="w-full mt-1 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
              <option value="" disabled>Selecione...</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="acquisition-year" className="text-xs font-bold text-slate-500 uppercase">Ano Aquisição</label>
            <input id="acquisition-year" type="number" className="w-full mt-1 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all" value={acquisitionYear} onChange={e => setAcquisitionYear(parseInt(e.target.value, 10))} />
          </div>
          <div>
            <label htmlFor="start-date" className="text-xs font-bold text-slate-500 uppercase">Data de Início</label>
            <input id="start-date" type="date" className="w-full mt-1 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="days" className="text-xs font-bold text-slate-500 uppercase">Dias</label>
            <input id="days" type="number" className="w-full mt-1 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all" value={days} onChange={e => setDays(parseInt(e.target.value, 10))} />
          </div>
          <div>
            <label htmlFor="end-date" className="text-xs font-bold text-slate-500 uppercase">Data Fim</label>
            <input id="end-date" type="date" className="w-full mt-1 border-slate-200 rounded-xl p-3 bg-slate-100 outline-none" value={endDate} readOnly />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button onClick={handleValidate} className="flex-1 sm:flex-none bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-all">
            <Search size={18} /> Validar Período
          </button>
          <button
            onClick={handleRequest}
            disabled={!(isValidated || validationMessage.includes('Requer aprovação especial.'))}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all hover:scale-105 disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
          >
            <Check size={18} /> {editingVacationId ? 'Atualizar Solicitação' : (validationMessage.includes('Requer aprovação especial.') ? 'Solicitar (Requer aprovação)' : 'Solicitar')}
          </button>
          {editingVacationId && (
            <button
              onClick={() => {
                setEditingVacationId(null);
                setOriginalStartDate(null);
                setOriginalEndDate(null);
                setOriginalStatus(null);
                setEmployeeId('');
                setAcquisitionYear(new Date().getFullYear());
                setStartDate('');
                setDays(30);
                setIsValidated(false);
                setValidationMessage('');
              }}
              className="flex-1 sm:flex-none bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-all"
            >
              <IconX size={18} /> Cancelar
            </button>
          )}
        </div>

        {editingVacationId && originalStatus === 'rejected' && (
          <div className="mt-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2 bg-blue-50 text-blue-800 border border-blue-200">
            <AlertTriangle size={18} />
            Você está editando uma solicitação rejeitada. Ao alterar as datas e solicitar novamente, a solicitação será enviada para aprovação (status: pendente).
          </div>
        )}

        {validationMessage && (
          <div className={`mt-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${isValidated ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {isValidated ? <Check size={18} /> : <AlertTriangle size={18} />}
            {validationMessage}
          </div>
        )}
      </div>

      {/* --- CARD DE SUGESTÕES --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-1">Sugestões de Períodos</h3>
        <p className="text-sm text-slate-500 mb-6">Selecione um funcionário e clique para ver os meses com possíveis vagas para 30 dias de férias.</p>
        <button onClick={handleSuggestMonths} className="bg-blue-100 text-blue-700 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-all hover:bg-blue-200">
          <Calendar size={18} /> Sugerir Meses Disponíveis
        </button>

        {suggestedMonths.length > 0 && (
          <div className="mt-6">
            <h4 className="font-bold text-slate-700 mb-3">1. Selecione um Mês:</h4>
            <div className="flex flex-wrap gap-3">
              {suggestedMonths.map((month) => (
                <button key={month} onClick={() => handleSelectMonth(month)} className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${selectedMonth === month ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {month}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedMonth && (
          <div className="mt-6">
            <h4 className="font-bold text-slate-700 mb-3">2. Datas de Início Possíveis para {selectedMonth}:</h4>
            {suggestedDates.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {suggestedDates.map((date) => (
                  <div key={date.toISOString()} className="bg-green-50 text-green-800 font-medium px-4 py-2 rounded-lg text-sm">
                    {date.toLocaleDateString('pt-BR')}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-bold text-red-800">Nenhuma data de início disponível para {selectedMonth}.</p>
                <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                  {impediments.map((imp, idx) => <li key={idx}>{imp}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- CARD DE SOLICITAÇÕES AGENDADAS --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-1">Férias Agendadas</h3>
          <p className="text-sm text-slate-500">Lista de todas as férias agendadas e seus status.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-600 text-xs uppercase">
              <tr>
                <th className="p-4 font-semibold">Colaborador</th>
                <th className="p-4 font-semibold">Período</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vacations.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-slate-400">Nenhuma solicitação encontrada.</td></tr>
              ) : (
                vacations.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-slate-800">{getEmployeeName(req.employeeId)}</td>
                    <td className="p-4 text-slate-600">{new Date(req.startDate).toLocaleDateString('pt-BR')} - {new Date(req.endDate).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        req.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEditVacation(req.id)} title="Editar" className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteVacation(req.id)} title="Excluir" className="p-2 rounded-lg hover:bg-red-50 text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VacationManager;