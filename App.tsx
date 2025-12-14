import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { EmployeeManager } from './components/EmployeeManager';
import { VacationManager } from './components/VacationManager';
import { Reports } from './components/Reports';
import { INITIAL_EMPLOYEES, INITIAL_VACATIONS } from './constants';
import { Employee, VacationRequest } from './types';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // --- STATE WITH LOCAL STORAGE PERSISTENCE ---
  
  // Load Employees from LocalStorage
  const [employees, setEmployees] = useState<Employee[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedEmployees = localStorage.getItem('sgf_employees');
        // Se houver dados salvos, usa eles. Se não, usa lista vazia (INITIAL_EMPLOYEES)
        return savedEmployees ? JSON.parse(savedEmployees) : INITIAL_EMPLOYEES;
      } catch (error) {
        console.error("Erro ao carregar colaboradores:", error);
        return INITIAL_EMPLOYEES;
      }
    }
    return INITIAL_EMPLOYEES;
  });

  // Load Vacations from LocalStorage
  const [vacations, setVacations] = useState<VacationRequest[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedVacations = localStorage.getItem('sgf_vacations');
        return savedVacations ? JSON.parse(savedVacations) : INITIAL_VACATIONS;
      } catch (error) {
        console.error("Erro ao carregar férias:", error);
        return INITIAL_VACATIONS;
      }
    }
    return INITIAL_VACATIONS;
  });

  // Save to LocalStorage whenever 'employees' changes
  useEffect(() => {
    try {
      localStorage.setItem('sgf_employees', JSON.stringify(employees));
    } catch (error) {
      console.error("Erro ao salvar colaboradores:", error);
    }
  }, [employees]);

  // Save to LocalStorage whenever 'vacations' changes
  useEffect(() => {
    try {
      localStorage.setItem('sgf_vacations', JSON.stringify(vacations));
    } catch (error) {
      console.error("Erro ao salvar férias:", error);
    }
  }, [vacations]);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard employees={employees} vacations={vacations} />;
      case 'employees':
        return <EmployeeManager employees={employees} setEmployees={setEmployees} />;
      case 'vacations':
        return <VacationManager employees={employees} vacations={vacations} setVacations={setVacations} />;
      case 'reports':
        return <Reports employees={employees} vacations={vacations} />;
      default:
        return <Dashboard employees={employees} vacations={vacations} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className={`flex-1 transition-all duration-300 md:ml-64 p-4 md:p-8 ${isSidebarOpen ? 'overflow-hidden' : ''}`}>
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold text-blue-900">SGF System</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Desktop Header */}
        <header className="hidden md:flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {currentView === 'dashboard' && 'Dashboard'}
              {currentView === 'employees' && 'Colaboradores'}
              {currentView === 'vacations' && 'Férias'}
              {currentView === 'reports' && 'Relatórios'}
            </h1>
            <p className="text-slate-500 text-sm">Bem-vindo ao Sistema de Gerenciamento de Férias</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              GQ
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-800">Gestão Qualidade</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </div>
        </header>

        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;