import React, { useState } from 'react';
import { FileText, Mail, Search, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Employee, VacationRequest } from '../types';
import { STATUS_TRANSLATION } from '../constants';

interface ReportsProps {
  employees: Employee[];
  vacations: VacationRequest[];
  setVacations: React.Dispatch<React.SetStateAction<VacationRequest[]>>;
}

type SortOrder = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';

export const Reports: React.FC<ReportsProps> = ({ employees, vacations, setVacations }) => {
  const [selectedVacationId, setSelectedVacationId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('name-asc');

  const selectedVacation = vacations.find(v => v.id === selectedVacationId);
  const selectedEmployee = selectedVacation ? employees.find(e => e.id === selectedVacation.employeeId) : null;

  // Helper function to determine the period number (1st, 2nd, 3rd) for a vacation request
  const getVacationPeriodNumber = (vacation: VacationRequest): number => {
    if (!vacation.acquisitionYear) return 0;

    // Get all vacations for the same employee and acquisition year, sorted by start date
    const employeeVacations = vacations
      .filter(v =>
        v.employeeId === vacation.employeeId &&
        v.acquisitionYear === vacation.acquisitionYear &&
        (v.status === 'approved' || v.status === 'notified' || v.status === 'planned' || v.status === 'pending')
      )
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // Find the index of the current vacation and return period number (1-indexed)
    const index = employeeVacations.findIndex(v => v.id === vacation.id);
    return index >= 0 ? index + 1 : 0;
  };

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

  const getReportData = () => {
    if (!selectedEmployee || !selectedVacation) return null;
    return [
      {
        "Colaborador": selectedEmployee.name,
        "Email": selectedEmployee.email,
        "Time": selectedEmployee.team,
        "Data de Admissão": formatDate(selectedEmployee.admissionDate),
        "Ano Aquisição": selectedVacation.acquisitionYear || 'N/A',
        "Início Férias": formatDate(selectedVacation.startDate),
        "Fim Férias": formatDate(selectedVacation.endDate),
        "Dias": selectedVacation.days,
        "Status": STATUS_TRANSLATION[selectedVacation.status] || selectedVacation.status,
        "Observações": selectedVacation.specialApprovalReason || ''
      }
    ];
  };

  const handleExportIndividual = () => {
    const data = getReportData();
    if (!data) return;

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatorio Ferias");

    const fileName = `Relatorio_Ferias_${selectedEmployee?.name.replace(/\s+/g, '_')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Export all scheduled vacations
  const getAllVacationsData = () => {
    const approvedOrNotified = vacations.filter(v => v.status === 'approved' || v.status === 'notified');

    return approvedOrNotified.map(vac => {
      const emp = employees.find(e => e.id === vac.employeeId);
      const periodNumber = getVacationPeriodNumber(vac);
      return {
        "Colaborador": emp?.name || 'Desconhecido',
        "Email": emp?.email || '',
        "Time": emp?.team || '',
        "Data de Admissão": formatDate(emp?.admissionDate),
        "Ano Aquisição": vac.acquisitionYear || 'N/A',
        "Período": periodNumber > 0 ? `${periodNumber}°` : 'N/A',
        "Início Férias": formatDate(vac.startDate),
        "Fim Férias": formatDate(vac.endDate),
        "Dias": vac.days,
        "Status": STATUS_TRANSLATION[vac.status] || vac.status,
        "Observações": vac.specialApprovalReason || ''
      };
    });
  };

  const handleExportAllExcel = () => {
    const data = getAllVacationsData();
    if (data.length === 0) {
      alert('Nenhuma férias aprovada ou notificada para exportar.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Todas Ferias");

    const fileName = `Relatorio_Todas_Ferias_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleSendEmail = () => {
    if (!selectedEmployee || !selectedVacation) return;

    const subject = `Aviso de Férias Aprovadas - ${selectedEmployee.name}`;
    let body = `Prezado(a) ${selectedEmployee.name},\n\n` +
                 `Comunicamos que suas férias foram aprovadas.\n\n` +
                 `INFORMAÇÕES DO COLABORADOR\n` +
                 `Time: ${selectedEmployee.team}\n` +
                 `Data de Admissão: ${formatDate(selectedEmployee.admissionDate)}\n\n` +
                 `DETALHES DO PERÍODO\n` +
                 `Período: ${formatDate(selectedVacation.startDate)} a ${formatDate(selectedVacation.endDate)}\n` +
                 `Duração: ${selectedVacation.days} dias\n` +
                 `Ano de Aquisição de Referência: ${selectedVacation.acquisitionYear || 'N/A'}\n` +
                 `Status: Aprovada\n\n` +
                 `Lembre-se de realizar o comunicado ao seu time e a passagem de conhecimento para outro QA com antecedência, seguindo as diretrizes internas contidas no documento\n` +
                 `PCR-QA - Procedimento para período de férias V2.doc https://shiftbrasil.sharepoint.com/:w:/s/team.teste/IQCXW7G2Sz1xS4UdJcr8UFp4AbF9y2UfZFI0GlyqMUOxIVs?e=OFBobx\n\n` +
                 `Atenciosamente,\n` +
                 `Gisela Nossa - Supervisora de Qualidade`;

    window.location.href = `mailto:${selectedEmployee.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setVacations(prevVacations =>
      prevVacations.map(vac =>
        vac.id === selectedVacation.id ? { ...vac, status: 'notified' } : vac
      )
    );
    alert('Email pronto para ser enviado. O status da solicitação foi atualizado para "Notificado".');
  };

  // Filter and sort vacations list
  const approvedOrNotifiedVacations = vacations
    .filter(v => v.status === 'approved' || v.status === 'notified')
    .filter(v => {
      if (!searchTerm) return true;
      const emp = employees.find(e => e.id === v.employeeId);
      return emp?.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const empA = employees.find(e => e.id === a.employeeId);
      const empB = employees.find(e => e.id === b.employeeId);

      if (sortOrder === 'name-asc') {
        return (empA?.name || '').localeCompare(empB?.name || '');
      } else if (sortOrder === 'name-desc') {
        return (empB?.name || '').localeCompare(empA?.name || '');
      } else if (sortOrder === 'date-asc') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
    });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-900">Relatórios e Exportação</h2>
      <p className="text-slate-600">Selecione uma solicitação de férias aprovada para gerar o documento ou exporte todas as férias.</p>

      {/* Export All Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-1">Exportar Todas as Férias</h3>
            <p className="text-sm text-slate-600">Gere um relatório completo com todas as férias aprovadas e notificadas.</p>
          </div>
          <button
            onClick={handleExportAllExcel}
            className="px-4 py-2.5 border rounded-lg font-medium flex items-center gap-2 border-green-600 text-green-700 bg-white hover:bg-green-50 shadow-sm"
          >
            <FileSpreadsheet size={18} /> Exportar Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 lg:col-span-1 h-fit">
          <label className="block text-sm font-medium text-slate-700 mb-3">Selecione o Agendamento</label>

          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="w-full mb-3 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="name-asc">Nome (A-Z)</option>
            <option value="name-desc">Nome (Z-A)</option>
            <option value="date-asc">Data (Mais Antiga)</option>
            <option value="date-desc">Data (Mais Recente)</option>
          </select>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {approvedOrNotifiedVacations.length > 0 ? approvedOrNotifiedVacations.map(vac => {
              const emp = employees.find(e => e.id === vac.employeeId);
              const isActive = selectedVacationId === vac.id;
              const periodNumber = getVacationPeriodNumber(vac);
              return (
                <div
                  key={vac.id}
                  onClick={() => setSelectedVacationId(vac.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-slate-800">{emp?.name}</p>
                    {periodNumber > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        periodNumber === 1 ? 'bg-blue-100 text-blue-700' :
                        periodNumber === 2 ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {periodNumber}°
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {formatDate(vac.startDate)} a {formatDate(vac.endDate)}
                  </p>
                </div>
              );
            }) : <p className="text-sm text-slate-400 text-center p-4">Nenhuma férias aprovada.</p>}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedEmployee && selectedVacation ? (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div id="report-preview" className="prose max-w-none text-slate-800">
                <div className="text-center border-b-2 border-slate-800 pb-4 mb-8">
                  <h1 className="text-2xl font-bold uppercase tracking-wide">Aviso de Férias</h1>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Colaborador</h4>
                    <p className="text-lg font-medium">{selectedEmployee.name}</p>
                    <p className="text-sm text-slate-600">Time: {selectedEmployee.team}</p>
                    <p className="text-sm text-slate-600">Email: {selectedEmployee.email}</p>
                    <p className="text-sm text-slate-600">Admissão: {formatDate(selectedEmployee.admissionDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Emitido em: {new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8">
                  <h3 className="text-sm font-bold uppercase text-blue-900 mb-4">Detalhes do Período Concessivo</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><p className="text-xs text-slate-500 uppercase">Início</p><p className="font-bold text-xl">{formatDate(selectedVacation.startDate)}</p></div>
                    <div><p className="text-xs text-slate-500 uppercase">Fim</p><p className="font-bold text-xl">{formatDate(selectedVacation.endDate)}</p></div>
                    <div><p className="text-xs text-slate-500 uppercase">Dias</p><p className="font-bold text-xl">{selectedVacation.days} dias</p></div>
                    <div><p className="text-xs text-slate-500 uppercase">Ano Aquisição</p><p className="font-bold text-xl">{selectedVacation.acquisitionYear || 'N/A'}</p></div>
                    <div><p className="text-xs text-slate-500 uppercase">Status</p><p className="font-bold text-xl">{STATUS_TRANSLATION[selectedVacation.status] || selectedVacation.status}</p></div>
                    {getVacationPeriodNumber(selectedVacation) > 0 && (
                      <div><p className="text-xs text-slate-500 uppercase">Período</p><p className="font-bold text-xl">{getVacationPeriodNumber(selectedVacation)}° Período</p></div>
                    )}
                  </div>
                </div>

                {selectedVacation.specialApprovalReason && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-8">
                    <h4 className="text-xs font-bold uppercase text-orange-700 mb-2">Observações da Aprovação</h4>
                    <p className="text-sm text-orange-800">{selectedVacation.specialApprovalReason}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap justify-end gap-3 print:hidden">
                <button onClick={handleExportIndividual} className="px-4 py-2 border rounded-lg font-medium flex items-center gap-2 border-green-600 text-green-700 hover:bg-green-50"><FileSpreadsheet size={18} /> Exportar Excel</button>
                <button onClick={handleSendEmail} className="px-4 py-2 border rounded-lg font-medium flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"><Mail size={18} /> Enviar por Email</button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 text-slate-400">
              <FileText size={48} className="mb-4 opacity-50" />
              <p>Selecione um item à esquerda para visualizar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
