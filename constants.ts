import { Employee, Skill, VacationRequest } from './types';

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