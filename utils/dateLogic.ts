import { Employee, VacationRequest } from '../types';

// RN01 & RN07: Calculate Due Date (Vencimento)
// Admission + 1 year (vesting) + 1 year (concessive) + 6 months (tolerance per RN01)
export const calculateDueDate = (admissionDate: string): Date => {
  const date = new Date(admissionDate);
  // Add 1 year for vesting period completion
  date.setFullYear(date.getFullYear() + 1);
  // Add 1 year + 6 months for max deadline (18 months after vesting)
  date.setMonth(date.getMonth() + 18);
  return date;
};

export const getDaysUntilDue = (dueDate: Date): number => {
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// RN03: Check if starts 2 days before weekend/holiday
// Simplified: Check if starts on Thursday (4) or Friday (5) assuming Sat/Sun weekend
export const isBadStartDate = (startDateStr: string): boolean => {
  const date = new Date(startDateStr);
  // 0=Sun, 1=Mon, ..., 4=Thu, 5=Fri, 6=Sat
  const day = date.getDay();
  // Validates if it is Thursday or Friday
  return day === 4 || day === 5 || day === 6 || day === 0; 
};

// RN04: Check Team Conflicts
export const checkTeamConflict = (
  employee: Employee,
  startDate: string,
  endDate: string,
  allVacations: VacationRequest[],
  allEmployees: Employee[]
): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Find other employees in the same team
  const teamMembers = allEmployees.filter(e => e.team === employee.team && e.id !== employee.id);
  const teamMemberIds = teamMembers.map(e => e.id);

  // Find vacations of team members that overlap
  const conflict = allVacations.find(v => {
    if (!teamMemberIds.includes(v.employeeId)) return false;
    
    const vStart = new Date(v.startDate);
    const vEnd = new Date(v.endDate);

    return (start <= vEnd && end >= vStart);
  });

  return !!conflict;
};

// RN02: Validate period split
export const validatePeriodSplit = (days: number): boolean => {
  return days >= 5;
};
