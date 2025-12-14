import React, { useState } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
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

  const handlePrint = () => {
    // Simple print simulation
    const content = document.getElementById('report-preview');
    if (content) {
      const w = window.open();
      w?.document.write(`
        <html>
          <head><title>Relatório de Férias</title></head>
          <body style="font-family: sans-serif; padding: 40px;">
            ${content.innerHTML}
          </body>
        </html>
      `);
      w?.document.close();
      w?.print();
    }
  };

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
    doc.text('Documento Oficial - Uso Interno', pageWidth / 2, 26, { align: 'center' });

    // 2. Employee and Reference Info
    doc.autoTable({
      startY: 35,
      theme: 'plain',
      body: [
        [
          { content: 'Colaborador:', styles: { fontStyle: 'bold' } },
          selectedEmployee.name,
          { content: 'Referência:', styles: { fontStyle: 'bold', halign: 'right' } },
          `#${selectedVacation.id.slice(-6)}`,
        ],
        [
          { content: 'Cargo:', styles: { fontStyle: 'bold' } },
          selectedEmployee.role,
          { content: 'Emitido em:', styles: { fontStyle: 'bold', halign: 'right' } },
          new Date().toLocaleDateString('pt-BR'),
        ],
        [
          { content: 'Time:', styles: { fontStyle: 'bold' } },
          selectedEmployee.team,
          '',
          '',
        ],
      ],
      styles: { fontSize: 10, cellPadding: 1 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 30 },
        3: { cellWidth: 30, halign: 'right' },
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    // 3. Vacation Period Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhes do Período Concessivo', 14, finalY + 15);
    doc.autoTable({
      startY: finalY + 18,
      theme: 'grid',
      head: [['Data Início', 'Data Fim', 'Dias Gozados']],
      body: [[
        new Date(selectedVacation.startDate).toLocaleDateString('pt-BR'),
        new Date(selectedVacation.endDate).toLocaleDateString('pt-BR'),
        `${selectedVacation.days} dias`
      ]],
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
      styles: { halign: 'center' }
    });

    const finalY2 = (doc as any).lastAutoTable.finalY;

    // 4. Formal Text
    const text = `Comunicamos que, de acordo com as normas internas e legislação vigente, suas férias foram aprovadas para o período supracitado. Certifique-se de realizar a passagem de conhecimento para o seu substituto técnico antes da data de início.`;
    const splitText = doc.splitTextToSize(text, pageWidth - 28);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(splitText, 14, finalY2 + 15);

    // 5. Signatures
    const signatureY = finalY2 + 50;
    doc.line(30, signatureY, 90, signatureY); // Line for first signature
    doc.text('Assinatura da Gestão', 60, signatureY + 5, { align: 'center' });
    
    doc.line(pageWidth - 90, signatureY, pageWidth - 30, signatureY); // Line for second signature
    doc.text('Assinatura do Colaborador', pageWidth - 60, signatureY + 5, { align: 'center' });

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
                    {new Date(vac.startDate).toLocaleDateString()} a {new Date(vac.endDate).toLocaleDateString()}
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
                  <p className="text-sm text-slate-500">Documento Oficial - Uso Interno</p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Colaborador</h4>
                    <p className="text-lg font-medium">{selectedEmployee.name}</p>
                    <p className="text-sm text-slate-600">{selectedEmployee.role}</p>
                    <p className="text-sm text-slate-600">{selectedEmployee.team}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Referência</h4>
                    <p className="text-lg font-medium">#{selectedVacation.id.slice(-6)}</p>
                    <p className="text-sm text-slate-600">Emitido em: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8">
                  <h3 className="text-sm font-bold uppercase text-blue-900 mb-4">Detalhes do Período Concessivo</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Data Início</p>
                      <p className="font-bold text-xl">{new Date(selectedVacation.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Data Fim</p>
                      <p className="font-bold text-xl">{new Date(selectedVacation.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Dias Gozados</p>
                      <p className="font-bold text-xl">{selectedVacation.days} dias</p>
                    </div>
                  </div>
                </div>

                <p className="mb-8 leading-relaxed">
                  Comunicamos que, de acordo com as normas internas e legislação vigente, suas férias foram aprovadas para o período supracitado. 
                  Certifique-se de realizar a passagem de conhecimento para o seu substituto técnico antes da data de início.
                </p>

                <div className="mt-12 flex justify-between gap-12 pt-8 border-t border-slate-300">
                  <div className="flex-1 text-center">
                    <div className="h-10 border-b border-slate-400 mb-2"></div>
                    <p className="text-xs uppercase font-bold text-slate-500">Assinatura da Gestão</p>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="h-10 border-b border-slate-400 mb-2"></div>
                    <p className="text-xs uppercase font-bold text-slate-500">Assinatura do Colaborador</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3 print:hidden">
                <button 
                  onClick={handlePrint}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium flex items-center gap-2"
                >
                  <Printer size={18} /> Imprimir
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
