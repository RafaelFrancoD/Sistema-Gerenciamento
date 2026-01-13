export interface Skill {
  id: string;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
}

export type VacationStatus = 'pending' | 'approved' | 'rejected' | 'planned' | 'notified';

export interface VacationRequest {
  id: number | string;
  employeeId: string;
  startDate: string;
  endDate: string;
  status: VacationStatus;
  acquisitionYear?: number;
  specialApprovalReason?: string;
  days?: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  team: string;
  email: string;
  admissionDate: string;
  skills: string[];
}