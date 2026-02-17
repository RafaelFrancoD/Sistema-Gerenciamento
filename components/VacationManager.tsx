import React, { useState, useEffect } from 'react';
import { VacationRequest, Employee } from '../types';
import { getSuggestedMonths, getSuggestedDatesForMonth, validateVacationRequest, addDays } from '../utils/dateLogic';
import { Calendar, Users, Search, Check, X as IconX, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import { STATUS_COLORS, STATUS_TRANSLATION } from '../constants';

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
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; messages: string[]; isSpecialApproval: boolean } | null>(null);
  const [editingVacationId, setEditingVacationId] = useState<string | null>(null);
  const [originalStatus, setOriginalStatus] = useState<string | null>(null);

  // Suggestion State
  const [suggestedMonths, setSuggestedMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [suggestedDates, setSuggestedDates] = useState<Date[]>([]);
  const [impediments, setImpediments] = useState<string[]>([]);

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day).toLocaleDateString('pt-BR');
    }
    return iso;
  };

  const resetValidation = () => setValidationResult(null);

  useEffect(() => {
    if (startDate && days > 0) {
      const start = new Date(startDate + 'T00:00:00');
      const end = addDays(start, days - 1);
      setEndDate(end.toISOString().split('T')[0]);
    } else {
      setEndDate('');
    }
    resetValidation();
  }, [startDate, days]);

  useEffect(() => {
    resetValidation();
  }, [employeeId, acquisitionYear]);

  const handleValidate = () => {
    if (!employeeId || !startDate || !endDate || !acquisitionYear) {
      setValidationResult({ isValid: false, messages: ['Preencha Colaborador, Ano de Aquisição, Data de Início e Dias.'], isSpecialApproval: false });
      return;
    }
    const requestToValidate: VacationRequest = {
      id: 'temp-validation', employeeId, startDate, endDate, status: 'planned', acquisitionYear,
    };
    const result = validateVacationRequest(requestToValidate, vacations, employees);
    setValidationResult(result);
  };

  const handleRequest = () => {
    if (!validationResult || (!validationResult.isValid && !validationResult.isSpecialApproval)) {
      alert('Por favor, valide o período de férias antes de solicitar.');
      return;
    }

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
    for (const v of vacations) {
      if (editingVacationId && v.id === editingVacationId) continue;
      if (v.employeeId !== employeeId) continue;
      const existingStart = new Date(v.startDate);
      const existingEnd = new Date(v.endDate);
      if (!(newEnd < existingStart || newStart > existingEnd)) {
        alert('Conflito: já existe uma solicitação de férias neste período para o colaborador selecionado.');
        return;
      }
    }

    const vacationData = {
      employeeId, startDate, endDate, acquisitionYear, days,
      specialApprovalReason: validationResult.isSpecialApproval ? validationResult.messages.join('; ') : undefined,
    };

    if (editingVacationId) {
      setVacations(prev => prev.map(v => v.id === editingVacationId ? {
        ...v, ...vacationData,
        status: (originalStatus === 'rejected') ? 'pending' : v.status,
      } : v));
    } else {
      setVacations([...vacations, { ...vacationData, id: Date.now().toString(), status: 'planned' }]);
    }

    // Reset form
    setEditingVacationId(null);
    setOriginalStatus(null);
    setEmployeeId('');
    setAcquisitionYear(new Date().getFullYear());
    setStartDate('');
    setDays(30);
    resetValidation();
  };

  const handleEditVacation = (id: string) => {
    const req = vacations.find(v => v.id === id);
    if (!req) return;
    setEditingVacationId(id);
    setEmployeeId(req.employeeId);
    setStartDate(req.startDate);
    setOriginalStatus(req.status);
    const s = new Date(req.startDate);
    const e = new Date(req.endDate);
    const diffDays = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    setDays(diffDays);
    setAcquisitionYear(req.acquisitionYear || new Date().getFullYear());
    resetValidation();
  };

  const handleDeleteVacation = (id: string) => {
    const req = vacations.find(v => v.id === id);
    if (!req) return;
    if (window.confirm(`Deseja realmente excluir a solicitação de ${getEmployeeName(req.employeeId)}?`)) {
      setVacations(prev => prev.filter(v => v.id !== id));
      if (editingVacationId === id) setEditingVacationId(null);
    }
  };

  const handleSuggestMonths = () => {
    if (!employeeId || !acquisitionYear) {
      alert('Por favor, selecione um funcionário e o Ano de Aquisição.');
      return;
    }
    setSuggestedMonths(getSuggestedMonths(employeeId, employees, vacations, acquisitionYear));
    setSelectedMonth(null);
    setSuggestedDates([]);
    setImpediments([]);
  };

  const handleSelectMonth = (month: string) => {
    setSelectedMonth(month);
    if (!employeeId || !acquisitionYear) return;
    const result = getSuggestedDatesForMonth(month, employeeId, employees, vacations, acquisitionYear);
    setSuggestedDates(result.dates);
    setImpediments(result.dates.length === 0 ? (result.impediments.length > 0 ? result.impediments : ["Nenhuma data disponível."]) : []);
  };
  
  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Desconhecido';

  // Sort vacations by employee name alphabetically
  const sortedVacations = [...vacations].sort((a, b) => {
    const nameA = getEmployeeName(a.employeeId).toLowerCase();
    const nameB = getEmployeeName(b.employeeId).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-1">{editingVacationId ? 'Editar Solicitação' : 'Nova Solicitação'}</h3>
        <p className="text-sm text-slate-500 mb-6">Preencha os dados, valide e depois solicite o período.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="lg:col-span-2"><label htmlFor="employee-select" className="text-xs font-bold text-slate-500 uppercase">Colaborador</label><select id="employee-select" className="w-full mt-1 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}><option value="" disabled>Selecione...</option>{[...employees].sort((a, b) => a.name.localeCompare(b.name)).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
          <div><label htmlFor="acquisition-year" className="text-xs font-bold text-slate-500 uppercase">Ano Aquisição</label><input id="acquisition-year" type="number" className="w-full mt-1 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none" value={acquisitionYear} onChange={e => setAcquisitionYear(parseInt(e.target.value, 10))} /></div>
          <div><label htmlFor="start-date" className="text-xs font-bold text-slate-500 uppercase">Data de Início</label><input id="start-date" type="date" className="w-full mt-1 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
          <div><label htmlFor="days" className="text-xs font-bold text-slate-500 uppercase">Dias</label><input id="days" type="number" className="w-full mt-1 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none" value={days} onChange={e => setDays(parseInt(e.target.value, 10))} /></div>
          <div><label htmlFor="end-date" className="text-xs font-bold text-slate-500 uppercase">Data Fim</label><input id="end-date" type="date" className="w-full mt-1 border-slate-200 rounded-xl p-3 bg-slate-100 outline-none" value={endDate} readOnly /></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button onClick={handleValidate} className="flex-1 sm:flex-none bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm"><Search size={18} /> Validar Período</button>
          <button onClick={handleRequest} disabled={!validationResult || !validationResult.isValid} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:bg-slate-400 disabled:shadow-none"><Check size={18} /> {editingVacationId ? 'Atualizar' : 'Solicitar'}</button>
          {editingVacationId && (<button onClick={() => { setEditingVacationId(null); setEmployeeId(''); setAcquisitionYear(new Date().getFullYear()); setStartDate(''); setDays(30); resetValidation(); }} className="flex-1 sm:flex-none bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm"><IconX size={18} /> Cancelar</button>)}
        </div>

        {validationResult && (
          <div className={`mt-4 p-4 rounded-lg text-sm font-medium border ${validationResult.isValid && !validationResult.isSpecialApproval ? 'bg-green-50 text-green-800 border-green-200' : validationResult.isSpecialApproval ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            <div className="flex items-start gap-2">
              <div className="pt-0.5">{validationResult.isValid ? (validationResult.isSpecialApproval ? <AlertTriangle size={18} /> : <Check size={18} />) : <AlertTriangle size={18} />}</div>
              <div>
                <p className="font-bold mb-1">{validationResult.isValid && !validationResult.isSpecialApproval ? 'Sucesso' : validationResult.isSpecialApproval ? 'Atenção' : 'Erro'}</p>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.messages.map((msg, i) => <li key={i}>{msg}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-1">Sugestões de Períodos</h3>
        <p className="text-sm text-slate-500 mb-6">Selecione um funcionário e clique para ver os meses com possíveis vagas.</p>
        <button onClick={handleSuggestMonths} className="bg-blue-100 text-blue-700 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-blue-200"><Calendar size={18} /> Sugerir Meses</button>
        {suggestedMonths.length > 0 && (<div className="mt-6"><h4 className="font-bold text-slate-700 mb-3">1. Selecione um Mês:</h4><div className="flex flex-wrap gap-3">{suggestedMonths.map((month) => (<button key={month} onClick={() => handleSelectMonth(month)} className={`px-4 py-2 rounded-full font-semibold text-sm ${selectedMonth === month ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{month}</button>))}</div></div>)}
        {selectedMonth && (<div className="mt-6"><h4 className="font-bold text-slate-700 mb-3">2. Datas de Início Possíveis para {selectedMonth}:</h4>{suggestedDates.length > 0 ? (<div className="flex flex-wrap gap-3">{suggestedDates.map((date) => (<div key={date.toISOString()} className="bg-green-50 text-green-800 font-medium px-4 py-2 rounded-lg text-sm">{date.toLocaleDateString('pt-BR')}</div>))}</div>) : (<div className="bg-red-50 p-4 rounded-lg"><p className="font-bold text-red-800">Nenhuma data de início disponível.</p><ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">{impediments.map((imp, idx) => <li key={idx}>{imp}</li>)}</ul></div>)}</div>)}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6"><h3 className="text-xl font-bold text-slate-800 mb-1">Férias Agendadas</h3><p className="text-sm text-slate-500">Lista de todas as férias agendadas e seus status.</p></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-600 text-xs uppercase"><tr><th className="p-4 font-semibold">Colaborador</th><th className="p-4 font-semibold">Período</th><th className="p-4 font-semibold text-center">Status</th><th className="p-4 font-semibold text-center">Ações</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {sortedVacations.length === 0 ? (<tr><td colSpan={4} className="p-8 text-center text-slate-400">Nenhuma solicitação encontrada.</td></tr>) : (sortedVacations.map((req) => (<tr key={req.id} className="hover:bg-slate-50/50"><td className="p-4 font-medium text-slate-800">{getEmployeeName(req.employeeId)}</td><td className="p-4 text-slate-600">{formatDate(req.startDate)} - {formatDate(req.endDate)}</td><td className="p-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[req.status]}`}>{STATUS_TRANSLATION[req.status]}</span></td><td className="p-4 text-center"><div className="flex items-center justify-center gap-2"><button onClick={() => handleEditVacation(req.id)} title="Editar" className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"><Edit2 size={16} /></button><button onClick={() => handleDeleteVacation(req.id)} title="Excluir" className="p-2 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={16} /></button></div></td></tr>)))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VacationManager;