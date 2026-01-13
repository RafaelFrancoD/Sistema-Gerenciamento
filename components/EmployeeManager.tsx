import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Calendar, Mail, Briefcase, Tag, FileSpreadsheet, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Employee, VacationRequest } from '../types';
import { TEAMS } from '../constants';

interface EmployeeManagerProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  vacations: VacationRequest[]; // Added vacations prop for RF03
}

type SortKey = keyof Employee | 'skills';

export const EmployeeManager: React.FC<EmployeeManagerProps> = ({ employees, setEmployees, vacations }) => {
  const formatDate = (iso?: string) => {
    if (!iso) return '';
    // Prefer constructing Date with components to avoid timezone shift (off-by-one)
    const parts = iso.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      return new Date(y, m, d).toLocaleDateString('pt-BR');
    }
    try { return new Date(iso).toLocaleDateString('pt-BR'); } catch { return iso; }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sort State
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('QA Junior'); // Default role
  const [team, setTeam] = useState('');
  const [email, setEmail] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  
  // Skill State
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  // Effect to populate allSkills from employees
  useEffect(() => {
    const skills = new Set(employees.flatMap(emp => emp.skills));
    setAllSkills(Array.from(skills).sort());
  }, [employees]);

  // --- SORTING LOGIC ---
  const sortedEmployees = useMemo(() => {
    let sortableItems = [...employees];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === 'skills') {
          aValue = a.skills.join(', ').toLowerCase();
          bValue = b.skills.join(', ').toLowerCase();
        } else {
          aValue = a[sortConfig.key as keyof Employee];
          bValue = b[sortConfig.key as keyof Employee];
          
          if (typeof aValue === 'string') aValue = aValue.toLowerCase();
          if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [employees, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown size={14} className="opacity-30" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-blue-600" /> 
      : <ArrowDown size={14} className="text-blue-600" />;
  };

  // --- HANDLERS ---
  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingId(employee.id);
      setName(employee.name);
      setRole(employee.role);
      setTeam(employee.team);
      setEmail(employee.email);
      setAdmissionDate(employee.admissionDate);
      setSelectedSkills(employee.skills);
    } else {
      setEditingId(null);
      setName('');
      setRole('QA Junior');
      setTeam('');
      setEmail('');
      setAdmissionDate('');
      setSelectedSkills([]);
    }
    setSkillInput('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // RN08: Cadastro, edição e exclusão de colaboradores com validações.
    if (!name.trim()) return alert("Nome é obrigatório.");
    if (!admissionDate) return alert("Data de Admissão é obrigatória.");
    if (!role.trim()) return alert("Cargo é obrigatório."); // Ensure role is also validated

    const trimmedName = name.trim();
    const normalizedName = trimmedName.toLowerCase();

    // Verificação de Duplicidade (Nome)
    const isDuplicate = employees.some(emp => {
      if (editingId && emp.id === editingId) return false;
      return emp.name.trim().toLowerCase() === normalizedName;
    });

    if (isDuplicate) {
      alert(`Já existe um colaborador cadastrado com o nome "${trimmedName}". Por favor, verifique ou use um nome diferente.`);
      return;
    }

    // Verificar duplicidade por email (se fornecido)
    if (email.trim()) {
      const emailDup = employees.some(emp => {
        if (editingId && emp.id === editingId) return false;
        return (emp.email || '').trim().toLowerCase() === email.trim().toLowerCase();
      });
      if (emailDup) {
        alert(`Já existe um colaborador cadastrado com o email "${email.trim()}".`);
        return;
      }
    }

    const newEmployee: Employee = {
      id: editingId || Date.now().toString(),
      name: trimmedName,
      role: role.trim(), // Ensure role is trimmed
      team: team.trim() || 'Sem Time',
      email: email.trim(),
      admissionDate,
      skills: selectedSkills
    };

    if (editingId) {
      setEmployees(prev => prev.map(e => e.id === editingId ? newEmployee : e));
    } else {
      setEmployees(prev => [...prev, newEmployee]);
    }
    setIsModalOpen(false);
  };

  // RF03 – Exclusão de colaborador (bloquear se tiver férias futuras).
  const handleDelete = (employeeToDelete: Employee) => {
    if (!employeeToDelete) return;

    const hasFutureVacations = vacations.some(vac => 
      vac.employeeId === employeeToDelete.id && new Date(vac.startDate) > new Date() && (vac.status === 'planned' || vac.status === 'approved')
    );

    if (hasFutureVacations) {
      alert(`Não é possível excluir o colaborador "${employeeToDelete.name}" pois ele possui férias futuras planejadas ou aprovadas.`);
      return;
    }

    const confirmDelete = window.confirm(`ATENÇÃO: Você tem certeza que deseja excluir o colaborador "${employeeToDelete.name}" do sistema? Esta ação é irreversível.`);
    
    if (confirmDelete) {
      setEmployees(prev => prev.filter(e => e.id !== employeeToDelete.id));
      // Se o colaborador deletado estava sendo editado no modal, feche o modal
      if (isModalOpen && editingId === employeeToDelete.id) {
        setIsModalOpen(false);
      }
    }
  };

  const handleAddSkill = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e instanceof KeyboardEvent && e.key !== 'Enter') return;
    e?.preventDefault(); 

    const trimmed = skillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      const newSkills = [...selectedSkills, trimmed];
      setSelectedSkills(newSkills);
      setSkillInput('');

      // Add to global list if it's new
      if (!allSkills.includes(trimmed)) {
        setAllSkills(prev => [...prev, trimmed].sort());
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  // --- IMPORT LOGIC (RN10) ---
  const handleImportClick = () => fileInputRef.current?.click();

  const processFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("Não foi possível ler o arquivo.");
        let jsonData: any[];

        if (fileExtension === 'xlsx') {
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        } else if (fileExtension === 'csv' || fileExtension === 'txt') {
          const text = new TextDecoder("utf-8").decode(data as ArrayBuffer);
          jsonData = text.split(/\r\n|\n/).filter(Boolean).map(line => {
            const cols = line.split(/[,;]/);
            return {
              "Nome": cols[0],
              "Data de Admissão": cols[1],
              "Cargo": cols[2],
              "Time": cols[3],
              "Email": cols[4],
              "Skills": cols[5]
            };
          });
          // Remove header if present
          const header = Object.values(jsonData[0] || {}).join('').toLowerCase();
          if(header.includes('nome') || header.includes('data')) jsonData.shift();
        } else {
          throw new Error("Formato de arquivo não suportado. Use .csv, .txt ou .xlsx.");
        }
        
        processImportedData(jsonData);

      } catch (error) {
        alert(`Erro ao processar o arquivo: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processImportedData = (data: any[]) => {
    const newEmployees: Employee[] = [];
    let importedCount = 0, duplicateCount = 0, invalidDateCount = 0, missingFieldsCount = 0;
    const existingNames = new Set(employees.map(emp => emp.name.trim().toLowerCase()));

    data.forEach(row => {
      const nameKey = Object.keys(row).find(k => k.toLowerCase().includes('nome')) || '';
      const dateKey = Object.keys(row).find(k => k.toLowerCase().includes('data')) || '';
      
      const empName = row[nameKey]?.trim();
      let dateValue = row[dateKey];

      if (!empName || !dateValue) {
        missingFieldsCount++;
        return;
      }

      if (existingNames.has(empName.toLowerCase())) {
        duplicateCount++;
        return;
      }
      
      let formattedDate = '';
      if (typeof dateValue === 'number') { // Excel date serial number
        const excelEpoch = new Date(1899, 11, 30);
        const date = new Date(excelEpoch.getTime() + dateValue * 86400000);
        formattedDate = date.toISOString().split('T')[0];
      } else if (typeof dateValue === 'string') {
        const parts = dateValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (parts) {
          formattedDate = `${parts[3]}-${parts[2]}-${parts[1]}`;
        } else if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
          formattedDate = dateValue;
        }
      }

      if (!formattedDate || isNaN(Date.parse(formattedDate))) {
        invalidDateCount++;
        return;
      }

      const roleKey = Object.keys(row).find(k => k.toLowerCase().includes('cargo')) || '';
      const teamKey = Object.keys(row).find(k => k.toLowerCase().includes('time')) || '';
      const emailKey = Object.keys(row).find(k => k.toLowerCase().includes('email')) || '';
      const skillsKey = Object.keys(row).find(k => k.toLowerCase().includes('skills')) || '';

      existingNames.add(empName.toLowerCase());
      newEmployees.push({
        id: `imp-${Date.now()}-${importedCount}`,
        name: empName,
        role: row[roleKey]?.trim() || 'QA Junior',
        team: row[teamKey]?.trim() || 'Sem Time',
        email: row[emailKey]?.trim() || '',
        admissionDate: formattedDate,
        skills: row[skillsKey] ? String(row[skillsKey]).split('|').map(s => s.trim()).filter(Boolean) : []
      });
      importedCount++;
    });

    let summary = [];
    if (importedCount > 0) {
      setEmployees(prev => [...prev, ...newEmployees]);
      summary.push(`${importedCount} colaboradores importados com sucesso.`);
    }
    if (duplicateCount > 0) summary.push(`${duplicateCount} nomes já existiam e foram ignorados.`);
    if (invalidDateCount > 0) summary.push(`${invalidDateCount} linhas com formato de data inválido.`);
    if (missingFieldsCount > 0) summary.push(`${missingFieldsCount} linhas sem campos obrigatórios.`);

    alert(summary.length > 0 ? summary.join('\n\n') : "Nenhum dado novo para importar. Verifique o arquivo.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900">Gerenciar Colaboradores</h2>
          <p className="text-slate-500 text-sm">Gerencie sua equipe manualmente ou importe via CSV/Excel</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <input type="file" ref={fileInputRef} onChange={processFile} accept=".csv,.txt,.xlsx" className="hidden" />
          
          <button onClick={handleImportClick} className="flex-1 md:flex-none bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm transition-all">
            <FileSpreadsheet size={20} /> <span className="hidden sm:inline">Importar Planilha</span>
            <span className="sm:hidden">Importar</span>
          </button>

          <button onClick={() => handleOpenModal()} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all hover:scale-105">
            <Plus size={20} /> <span className="font-bold">Novo Colaborador</span>
          </button>
        </div>
      </div>

      {/* --- DESKTOP VIEW: TABLE --- */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-50/50 text-blue-900 border-b border-blue-100">
              <tr>
                <th className="p-5 font-semibold cursor-pointer select-none" onClick={() => requestSort('name')}>
                  <div className="flex items-center gap-2">Nome {getSortIcon('name')}</div>
                </th>
                <th className="p-5 font-semibold cursor-pointer select-none" onClick={() => requestSort('team')}>
                  <div className="flex items-center gap-2">Time {getSortIcon('team')}</div>
                </th>
                <th className="p-5 font-semibold cursor-pointer select-none" onClick={() => requestSort('admissionDate')}>
                  <div className="flex items-center gap-2">Admissão {getSortIcon('admissionDate')}</div>
                </th>
                <th className="p-5 font-semibold cursor-pointer select-none" onClick={() => requestSort('skills')}>
                  <div className="flex items-center gap-2">Skills {getSortIcon('skills')}</div>
                </th>
                <th className="p-5 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Nenhum colaborador encontrado. Adicione um novo colaborador.
                  </td>
                </tr>
              ) : (
                sortedEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-5">
                      <div className="font-bold text-slate-800">{emp.name}</div>
                      <div className={`text-sm ${!emp.email ? 'text-orange-400 italic' : 'text-slate-500'}`}>
                        {emp.email || 'Email pendente'}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 border rounded-full text-xs font-bold shadow-sm ${
                        emp.team === 'Pendente' || !emp.team 
                        ? 'bg-orange-50 border-orange-200 text-orange-600'
                        : 'bg-white border-blue-100 text-blue-700'
                      }`}>
                        {emp.team || 'Pendente'}
                      </span>
                    </td>
                    <td className="p-5 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-blue-300" />
                        {formatDate(emp.admissionDate)}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-wrap gap-1.5">
                        {emp.skills.length > 0 ? emp.skills.map((skill, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wide">
                            {skill}
                          </span>
                        )) : (
                           <span className="text-[10px] text-slate-400 italic">--</span>
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        type="button"
                        onClick={() => handleOpenModal(emp)} 
                        className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50 cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDelete(emp)} 
                        className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE VIEW: CARDS --- */}
      <div className="md:hidden space-y-4">
        {sortedEmployees.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
            Nenhum colaborador encontrado.
          </div>
        ) : (
          sortedEmployees.map(emp => (
            <div key={emp.id} className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${emp.team === 'Pendente' ? 'bg-orange-400' : 'bg-blue-500'}`}></div>
              
              <div className="flex justify-between items-start mb-4 pl-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 leading-tight">{emp.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{emp.role}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                   emp.team === 'Pendente' || !emp.team 
                   ? 'bg-orange-50 border-orange-200 text-orange-600'
                   : 'bg-blue-50 border-blue-100 text-blue-700'
                }`}>
                  {emp.team || 'Pendente'}
                </span>
              </div>

              <div className="pl-3 space-y-3 mb-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <Mail size={16} />
                  </div>
                  <span className={`truncate ${!emp.email ? 'text-orange-400 italic' : ''}`}>{emp.email || 'Cadastrar Email'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <Calendar size={16} />
                  </div>
                  <span>Adm: {formatDate(emp.admissionDate)}</span>
                </div>
              </div>

              <div className="pl-3 mb-5">
                <p className="text-[10px] uppercase text-slate-400 font-bold mb-2">Competências</p>
                <div className="flex flex-wrap gap-2">
                  {emp.skills.length > 0 ? emp.skills.map((skill, idx) => (
                    <span key={idx} className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded-md">
                      {skill}
                    </span>
                  )) : <span className="text-xs text-slate-400 italic">Nenhuma skill registrada</span>}
                </div>
              </div>

              <div className="flex gap-3 pl-3">
                <button 
                  type="button"
                  onClick={() => handleOpenModal(emp)} 
                  className="flex-1 bg-blue-50 text-blue-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
                >
                  <Edit2 size={16} /> Editar
                </button>
                <button 
                  type="button"
                  onClick={() => handleDelete(emp)} 
                  className="flex-1 bg-red-50 text-red-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
                >
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-extrabold text-blue-900">
                {editingId ? 'Editar Colaborador' : 'Novo Colaborador'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 outline-none transition-all"
                    placeholder="Ex: João Silva"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Email Corporativo</label>
                  <input 
                    type="email" 
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 outline-none transition-all"
                    placeholder="nome@empresa.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Time (Squad)</label>
                  <div className="relative">
                    <input 
                      type="text"
                      className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all"
                      placeholder="Digite o nome do time..."
                      value={team}
                      onChange={e => setTeam(e.target.value)}
                      list="teams-suggestions"
                    />
                    <datalist id="teams-suggestions">
                      {TEAMS.map(t => <option key={t} value={t} />)}
                    </datalist>
                    <Briefcase size={16} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Data de Admissão</label>
                  <input 
                    type="date" 
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all"
                    value={admissionDate}
                    onChange={e => setAdmissionDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 mb-3 block">Skills & Competências (Digite e pressione Enter)</label>
                
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition-all"
                      placeholder="Ex: Cypress, Java, Liderança..."
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      list="skills-suggestions"
                    />
                    <datalist id="skills-suggestions">
                      {allSkills.map(skill => <option key={skill} value={skill} />)}
                    </datalist>
                    <Tag size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                  <button 
                    onClick={handleAddSkill}
                    className="px-4 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  {selectedSkills.length === 0 && <span className="text-slate-400 text-sm italic p-1">Nenhuma competência adicionada.</span>}
                  {selectedSkills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="animate-fade-in inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white text-slate-700 border border-slate-200 shadow-sm"
                    >
                      {skill}
                      <button 
                        onClick={() => removeSkill(skill)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mt-auto">
              {editingId ? (
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const employeeToDelete = employees.find(emp => emp.id === editingId);
                    if (employeeToDelete) {
                      handleDelete(employeeToDelete);
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-red-100 cursor-pointer shadow-sm"
                >
                  <Trash2 size={20} /> Excluir
                </button>
              ) : (
                <div className="hidden sm:block"></div>
              )}
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 sm:flex-none px-6 py-3 text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave} 
                  className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
                >
                  <Save size={20} /> Salvar Colaborador
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};