export interface Skill {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  team: string; // Free text
  admissionDate: string; // ISO Date YYYY-MM-DD
  skills: string[]; // List of Skill Names (Free text)
  email: string;
}

export interface VacationRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'approved' | 'completed';
  days: number;
}

export interface VacationRuleError {
  hasError: boolean;
  message: string;
}