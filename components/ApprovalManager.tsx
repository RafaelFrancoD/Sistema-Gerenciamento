import React from 'react';
import { Employee, VacationRequest } from '../types';
import { Check, X } from 'lucide-react';

interface ApprovalManagerProps {
  employees: Employee[];
  vacations: VacationRequest[];
  setVacations: React.Dispatch<React.SetStateAction<VacationRequest[]>>;
}

export const ApprovalManager: React.FC<ApprovalManagerProps> = ({ employees, vacations, setVacations }) => {
  const pendingVacations = vacations.filter(vac => vac.status === 'planned' || vac.status === 'pending');

  const handleApprove = (vacationId: string) => {
    setVacations(prevVacations =>
      prevVacations.map(vac =>
        vac.id === vacationId ? { ...vac, status: 'approved', specialApprovalReason: undefined } : vac // Clear reason on approval
      )
    );
    alert('Férias aprovadas com sucesso!');
  };

  const handleReject = (vacationId: string) => {
    setVacations(prevVacations =>
      prevVacations.map(vac =>
        vac.id === vacationId ? { ...vac, status: 'rejected', specialApprovalReason: undefined } : vac // Clear reason on rejection
      )
    );
    alert('Férias rejeitadas com sucesso!');
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
          <table className="w-full min-w-[1000px]"> {/* Increased min-width to accommodate new column */}
            <thead className="bg-slate-50 text-slate-600 text-sm">
              <tr>
                <th className="p-3 text-left">Colaborador</th>
                <th className="p-3 text-left">Período</th>
                <th className="p-3 text-left">Dias</th>
                <th className="p-3 text-left">Ano Aquisição</th>
                <th className="p-3 text-left">Motivo</th> {/* New column for reason */}
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingVacations.length > 0 ? (
                pendingVacations.map(vac => {
                  const emp = employees.find(e => e.id === vac.employeeId);
                  const displayStartDate = new Date(vac.startDate + 'T00:00:00').toLocaleDateString('pt-BR');
                  const displayEndDate = new Date(vac.endDate + 'T00:00:00').toLocaleDateString('pt-BR');
                  // Calculate days if not stored, adding +1 to include both start and end dates
                  const vacationDays = vac.days || Math.round((new Date(vac.endDate).getTime() - new Date(vac.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
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
                      <td className="p-3 text-sm text-orange-600 font-medium"> {/* Display reason */}
                        {vac.specialApprovalReason || 'N/A'}
                      </td>
                      <td className="p-3 text-sm">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                          Pendente
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
                  <td colSpan={7} className="p-8 text-center text-slate-400"> {/* Updated colspan */}
                    Nenhuma solicitação de férias pendente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
