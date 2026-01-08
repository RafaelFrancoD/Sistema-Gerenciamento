import React, { useState } from 'react';
import { Download, FileText, Mail } from 'lucide-react'; // Alterado Printer para Mail
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Employee, VacationRequest } from '../types';

// Augment jsPDF with autoTable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ReportsProps {
  employees: Employee[];
  vacations: VacationRequest[];
}

export const Reports: React.FC<ReportsProps> = ({ employees, vacations }) => {
  const [selectedVacationId, setSelectedVacationId] = useState('');
  
  const selectedVacation = vacations.find(v => v.id === selectedVacationId);
  const selectedEmployee = selectedVacation ? employees.find(e => e.id === selectedVacation.employeeId) : null;

  const handleDownloadPdf = () => {
    if (!selectedEmployee || !selectedVacation) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('AVISO DE FÉRIAS', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // 2. Employee and Reference Info
    const employeeInfoBody = [
      [
        { content: 'Colaborador:', styles: { fontStyle: 'bold' } },
        selectedEmployee.name,
        '',
        '',
      ],
      [
        { content: 'Time:', styles: { fontStyle: 'bold' } },
        selectedEmployee.team,
        '',
        '',
      ],
      [
        { content: 'Email:', styles: { fontStyle: 'bold' } },
        selectedEmployee.email,
        '',
        '',
      ],
      [
        { content: 'Admissão:', styles: { fontStyle: 'bold' } } ,
        new Date(selectedEmployee.admissionDate + 'T00:00:00').toLocaleDateString('pt-BR'),
        '',
        '',
      ],
    ];

    if (selectedEmployee.skills.length > 0) {
      employeeInfoBody.push([
        { content: 'Habilidades:', styles: { fontStyle: 'bold' } },
        selectedEmployee.skills.join(', '),
        '',
        '',
      ]);
    }

    doc.autoTable({
      startY: 35,
      theme: 'plain',
      body: employeeInfoBody,
      styles: { fontSize: 10, cellPadding: 1 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 30 },
        3: { cellWidth: 30, halign: 'right' },
      }
    });

    let finalY = (doc as any).lastAutoTable.finalY;

    // 3. Vacation Period Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhes do Período Concessivo', 14, finalY + 15);
    doc.autoTable({
      startY: finalY + 18,
      theme: 'grid',
      head: [['Ano Aquisição', 'Data Início', 'Data Fim', 'Dias Gozados', 'Status']],
      body: [[
        selectedVacation.acquisitionYear || 'N/A',
        new Date(selectedVacation.startDate + 'T00:00:00').toLocaleDateString('pt-BR'),
        new Date(selectedVacation.endDate + 'T00:00:00').toLocaleDateString('pt-BR'),
        `${selectedVacation.days} dias`,
        selectedVacation.status === 'approved' ? 'Aprovado' : 'Planejado'
      ]],
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
      styles: { halign: 'center' }
    });

    finalY = (doc as any).lastAutoTable.finalY;

    // Add special approval reason if exists
    if (selectedVacation.specialApprovalReason) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Motivo da Aprovação Especial:', 14, finalY + 10);
      doc.setFont('helvetica', 'normal');
      const reasonText = doc.splitTextToSize(selectedVacation.specialApprovalReason, pageWidth - 28);
      doc.text(reasonText, 14, finalY + 15);
      finalY += reasonText.length * 5 + 10; // Adjust Y position
    }

    // 4. Formal Text
    const text = `Comunicamos que, de acordo com as normas internas e legislação vigente, suas férias foram aprovadas para o período supracitado. Certifique-se de realizar a passagem de conhecimento para o seu substituto técnico antes da data de início. Além de seguir as demais diretrizes contidas no PCR de férias.`;
    const splitText = doc.splitTextToSize(text, pageWidth - 28);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(splitText, 14, finalY + 15);

    // 6. Footer
    const pageCount = doc.internal.pages.length;
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, 287, { align: 'center' });
      doc.text(`SGF System - ${new Date().getFullYear()}`, 14, 287);
    }

    // Save the PDF
    doc.save(`aviso_ferias_${selectedEmployee.name.replace(/\s+/g, '_')}.pdf`);
  };

  const handleSendEmail = () => {
    if (!selectedEmployee || !selectedVacation) return;

    const subject = `Aprovação de Férias - ${selectedEmployee.name}`;
    let body = `Prezado(a) ${selectedEmployee.name},\n\n` +
                 `Comunicamos que suas férias foram aprovadas para o período de ` +
                 `${new Date(selectedVacation.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} a ` +
                 `${new Date(selectedVacation.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}, ` +
                 `totalizando ${selectedVacation.days} dias.\n\n` +
                 `Ano de Aquisição: ${selectedVacation.acquisitionYear || 'N/A'}\n` +
                 `Status: ${selectedVacation.status === 'approved' ? 'Aprovado' : 'Planejado'}\n\n` +
                 `Time: ${selectedEmployee.team}\n` +
                 `Admissão: ${new Date(selectedEmployee.admissionDate + 'T00:00:00').toLocaleDateString('pt-BR')}\n`;
    
    if (selectedEmployee.skills.length > 0) {
      body += `Habilidades: ${selectedEmployee.skills.join(', ')}\n\n`;
    } else {
      body += '\n';
    }

    if (selectedVacation.specialApprovalReason) {
      body += `Motivo da Aprovação Especial: ${selectedVacation.specialApprovalReason}\n\n`;
    }

    body += `Por favor, certifique-se de realizar a passagem de conhecimento para o seu substituto técnico antes da data de início.\n\n` +
            `Atenciosamente,\nGestão de RH`;
    
    // Usar window.location.href para abrir o cliente de e-mail padrão
    window.location.href = `mailto:${selectedEmployee.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-900">Relatórios e Exportação</h2>
      <p className="text-slate-600">Selecione uma solicitação de férias para gerar o documento formal.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 lg:col-span-1 h-fit">
          <label className="block text-sm font-medium text-slate-700 mb-2">Selecione o Agendamento</label>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {vacations.map(vac => {
              const emp = employees.find(e => e.id === vac.employeeId);
              const isActive = selectedVacationId === vac.id;
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
                  <p className="font-bold text-slate-800">{emp?.name}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(vac.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} a {new Date(vac.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              );
            })}
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
                    <p className="text-sm text-slate-600">Admissão: {new Date(selectedEmployee.admissionDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                    {selectedEmployee.skills.length > 0 && (
                      <p className="text-sm text-slate-600">Habilidades: {selectedEmployee.skills.join(', ')}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Emitido em: {new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8">
                  <h3 className="text-sm font-bold uppercase text-blue-900 mb-4">Detalhes do Período Concessivo</h3>
                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Ano Aquisição</p>
                      <p className="font-bold text-xl">{selectedVacation.acquisitionYear || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Data Início</p>
                      <p className="font-bold text-xl">{new Date(selectedVacation.startDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Data Fim</p>
                      <p className="font-bold text-xl">{new Date(selectedVacation.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Dias Gozados</p>
                      <p className="font-bold text-xl">{selectedVacation.days} dias</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Status</p>
                      <p className="font-bold text-xl">{selectedVacation.status === 'approved' ? 'Aprovado' : 'Planejado'}</p>
                    </div>
                  </div>
                </div>

                {selectedVacation.specialApprovalReason && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-8">
                    <h4 className="text-xs font-bold uppercase text-orange-700 mb-2">Motivo da Aprovação Especial</h4>
                    <p className="text-sm text-orange-800">{selectedVacation.specialApprovalReason}</p>
                  </div>
                )}

                <p className="mb-8 leading-relaxed">
                  Comunicamos que, de acordo com as normas internas e legislação vigente, suas férias foram aprovadas para o período supracitado. 
                  Certifique-se de realizar a passagem de conhecimento para o seu substituto técnico antes da data de início. Além de seguir as demais diretrizes contidas no PCR de férias.
                </p>

              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3 print:hidden">
                <button 
                  onClick={handleSendEmail}
                  disabled={selectedVacation.status !== 'approved'}
                  className={`px-4 py-2 border rounded-lg font-medium flex items-center gap-2 ${
                    selectedVacation.status === 'approved'
                      ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                      : 'border-slate-300 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Mail size={18} /> Enviar por Email
                </button>
                <button 
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Download size={18} /> Exportar PDF
                </button>
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
