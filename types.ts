export interface VacationRequest {
  id: number | string; // Changed to allow string for temporary IDs
  employeeId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'planned'; // Added 'planned' status
  acquisitionYear?: number; // Added acquisitionYear
  specialApprovalReason?: string; // Added for RN02, RN04
  days?: number; // Number of vacation days
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