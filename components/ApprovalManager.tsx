import React, { useState } from 'react';
import { Employee, VacationRequest } from '../types';
import { Check, X, Mail, Send } from 'lucide-react';
import { STATUS_COLORS, STATUS_TRANSLATION } from '../constants';

interface ApprovalManagerProps {
  employees: Employee[];
  vacations: VacationRequest[];
  setVacations: React.Dispatch<React.SetStateAction<VacationRequest[]>>;
}

export const ApprovalManager: React.FC<ApprovalManagerProps> = ({ employees, vacations, setVacations }) => {
  const pendingVacations = vacations.filter(vac => vac.status === 'planned' || vac.status === 'pending');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState<VacationRequest | null>(null);
  const [emailSending, setEmailSending] = useState(false);

  // Helper function to determine the period number (1st, 2nd, 3rd) for a vacation request
  const getVacationPeriodNumber = (vacation: VacationRequest): number => {
    if (!vacation.acquisitionYear) return 0;

    // Get all vacations for the same employee and acquisition year, sorted by start date
    const employeeVacations = vacations
      .filter(v =>
        v.employeeId === vacation.employeeId &&
        v.acquisitionYear === vacation.acquisitionYear &&
        (v.status === 'approved' || v.status === 'planned' || v.status === 'pending')
      )
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // Find the index of the current vacation and return period number (1-indexed)
    const index = employeeVacations.findIndex(v => v.id === vacation.id);
    return index >= 0 ? index + 1 : 0;
  };

  const handleApprove = (vacationId: string) => {
    const vacation = vacations.find(v => v.id === vacationId);
    if (!vacation) return;

    setVacations(prevVacations =>
      prevVacations.map(vac =>
        vac.id === vacationId ? { ...vac, status: 'approved', specialApprovalReason: undefined } : vac
      )
    );

    // Abrir modal de email após aprovação
    setSelectedVacation({ ...vacation, status: 'approved' });
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = () => {
    if (!selectedVacation) return;

    setEmailSending(true);

    setTimeout(() => {
      alert('Email enviado com sucesso!');
      setEmailSending(false);
      setIsEmailModalOpen(false);
      setSelectedVacation(null);
    }, 1500);
  };

  const handleReject = (vacationId: string) => {
    setVacations(prevVacations =>
      prevVacations.map(vac =>
        vac.id === vacationId ? { ...vac, status: 'rejected', specialApprovalReason: undefined } : vac // Clear reason on rejection
      )
    );
    alert('Férias rejeitadas com sucesso!');
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900">Aprovações de Férias</h2>
      <p className="text-slate-600">Gerencie as solicitações de férias pendentes.</p>

      <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-blue-50">
          <h3 className="font-bold text-blue-900">Solicitações Pendentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]"> {/* Increased min-width to accommodate new column */}
            <thead className="bg-slate-50 text-slate-600 text-sm">
              <tr>
                <th className="p-3 text-left">Colaborador</th>
                <th className="p-3 text-left">Período</th>
                <th className="p-3 text-left">Dias</th>
                <th className="p-3 text-left">Ano Aquisição</th>
                <th className="p-3 text-center">N° Período</th> {/* New column for period number */}
                <th className="p-3 text-left">Motivo</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingVacations.length > 0 ? (
                pendingVacations.map(vac => {
                  const emp = employees.find(e => e.id === vac.employeeId);
                  const displayStartDate = formatDate(vac.startDate);
                  const displayEndDate = formatDate(vac.endDate);
                  // Calculate days if not stored, adding +1 to include both start and end dates
                  const vacationDays = vac.days || Math.round((new Date(vac.endDate).getTime() - new Date(vac.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                  const periodNumber = getVacationPeriodNumber(vac);
                  return (
                    <tr key={vac.id}>
                      <td className="p-3">
                        <div className="font-medium">{emp?.name || 'Desconhecido'}</div>
                        <div className="text-xs text-slate-500">{emp?.team}</div>
                      </td>
                      <td className="p-3 text-sm">
                        {displayStartDate} - {displayEndDate}
                      </td>
                      <td className="p-3 text-sm">{vacationDays}d</td>
                      <td className="p-3 text-sm">{vac.acquisitionYear || 'N/A'}</td>
                      <td className="p-3 text-center">
                        {periodNumber > 0 ? (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            periodNumber === 1 ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            periodNumber === 2 ? 'bg-green-100 text-green-700 border border-green-200' :
                            'bg-purple-100 text-purple-700 border border-purple-200'
                          }`}>
                            {periodNumber}° Período
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td className="p-3 text-sm text-orange-600 font-medium">
                        {vac.specialApprovalReason ? (
                          <ul className="list-disc list-inside text-xs">
                            {vac.specialApprovalReason.split('; ').map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="p-3 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium border ${STATUS_COLORS[vac.status]}`}>
                          {STATUS_TRANSLATION[vac.status]}
                        </span>
                      </td>
                      <td className="p-3 text-center flex gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(vac.id)}
                          className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                          title="Aprovar"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(vac.id)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          title="Rejeitar"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400"> {/* Updated colspan to 8 */}
                    Nenhuma solicitação de férias pendente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Email */}
      {isEmailModalOpen && selectedVacation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-blue-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900">Enviar Aviso de Férias Aprovadas</h3>
                  <p className="text-xs text-slate-500">Visualize e envie o email de notificação</p>
                </div>
              </div>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50 flex-1">
              {(() => {
                const emp = employees.find(e => e.id === selectedVacation.employeeId);
                if (!emp) return <p>Colaborador não encontrado.</p>;

                const startDate = formatDate(selectedVacation.startDate);
                const endDate = formatDate(selectedVacation.endDate);
                const vacationDays = selectedVacation.days || Math.round((new Date(selectedVacation.endDate).getTime() - new Date(selectedVacation.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;

                return (
                  <div className="bg-white p-6 rounded-xl border border-slate-200 font-sans text-slate-800">
                    <p className="mb-4">Prezado(a) <strong>{emp.name}</strong>,</p>

                    <p className="mb-6">Comunicamos que suas férias foram aprovadas.</p>

                    <div className="mb-6">
                      <h4 className="font-bold text-blue-900 mb-3 uppercase text-sm">Informações do Colaborador</h4>
                      <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                        <p><strong>Time:</strong> {emp.team}</p>
                        <p><strong>Data de Admissão:</strong> {formatDate(emp.admissionDate)}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-bold text-blue-900 mb-3 uppercase text-sm">Detalhes do Período</h4>
                      <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                        <p><strong>Período:</strong> {startDate} a {endDate}</p>
                        <p><strong>Duração:</strong> {vacationDays} dias</p>
                        <p><strong>Ano de Aquisição de Referência:</strong> {selectedVacation.acquisitionYear}</p>
                        <p><strong>Status:</strong> <span className="text-green-600 font-bold">Aprovada</span></p>
                      </div>
                    </div>

                    <div className="mb-6 text-sm text-slate-700 leading-relaxed">
                      <p>Lembre-se de realizar o comunicado ao seu time e a passagem de conhecimento para outro QA com antecedência, seguindo as diretrizes internas contidas no documento <strong>PCR-QA - Procedimento para período de férias V2.doc</strong>.</p>
                      <p className="mt-2">
                        <a href="https://shiftbrasil.sharepoint.com/:w:/s/team.teste/IQCXW7G2Sz1xS4UdJcr8UFp4AbF9y2UfZFI0GlyqMUOxIVs?e=OFBobx" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Acessar documento
                        </a>
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-200 text-sm">
                      <p>Atenciosamente,</p>
                      <p className="font-bold">Gisela Nossa - Supervisora</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendEmail}
                disabled={emailSending}
                className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all ${
                  emailSending
                    ? 'bg-slate-400 text-white cursor-wait'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20 hover:-translate-y-0.5'
                }`}
              >
                <Send size={16} />
                {emailSending ? 'Enviando...' : 'Enviar Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
