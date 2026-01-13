import { Employee, Skill, VacationRequest, VacationStatus } from './types';

export const TEAMS = ['Time Alpha', 'Time Beta', 'Time Gamma', 'Time Delta'];

// Kept for reference if needed, but UI now allows free text
export const AVAILABLE_SKILLS: Skill[] = [
  { id: 's1', name: 'Automação Cypress' },
  { id: 's2', name: 'Selenium Java' },
  { id: 's3', name: 'API Testing' },
  { id: 's4', name: 'Performance K6' },
  { id: 's5', name: 'Mobile Appium' },
];

// Dados iniciais removidos conforme solicitado para iniciar com a tabela limpa
export const INITIAL_EMPLOYEES: Employee[] = [];

export const INITIAL_VACATIONS: VacationRequest[] = [];

export const STATUS_TRANSLATION: Record<VacationStatus, string> = {
  planned: 'Planejada',
  pending: 'Pendente',
  approved: 'Aprovada',
  rejected: 'Rejeitada',
  notified: 'Notificado',
};

export const STATUS_COLORS: Record<VacationStatus, string> = {
  planned: 'bg-gray-100 text-gray-700 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  notified: 'bg-cyan-100 text-cyan-700 border-cyan-200',
};
