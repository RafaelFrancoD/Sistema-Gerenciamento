import { VacationRequest, Employee } from '../types';

// --- HOLIDAY AND WEEKEND CONFIGURATION ---
// RN00: Considerar sempre calendários e feriados do ano vigente (atual).
// Considere feriados nacionais e municipais em São José do Rio Preto.
// Note: This is a simplified holiday list. For a real-world application,
// especially for movable holidays and municipal holidays,
// a robust library or API (e.g., Google Calendar API, a specific holiday API)
// or a comprehensive local database would be necessary to calculate/fetch these dates for any given year.
// This list includes fixed national dates and a placeholder for municipal holidays in São José do Rio Preto.
const getHolidaysForYear = (year: number): { month: number; day: number; name: string }[] => {
  const holidays = [
    // Fixed National Holidays (Month is 0-indexed: 0=Jan, 1=Feb, etc.)
    { month: 0, day: 1, name: 'Confraternização Universal' },
    { month: 3, day: 21, name: 'Tiradentes' },
    { month: 4, day: 1, name: 'Dia do Trabalho' },
    { month: 8, day: 7, name: 'Independência do Brasil' },
    { month: 9, day: 12, name: 'Nossa Senhora Aparecida' },
    { month: 10, day: 2, name: 'Finados' },
    { month: 10, day: 15, name: 'Proclamação da República' },
    { month: 11, day: 25, name: 'Natal' },
    
    // Placeholder for Movable National Holidays (e.g., Carnaval, Sexta-feira Santa, Corpus Christi)
    // In a real system, these would be calculated dynamically or fetched.
    // Example for 2025 (Carnaval: Mar 3-4, Sexta-feira Santa: Apr 18, Corpus Christi: Jun 19)
    { month: 2, day: 3, name: 'Carnaval' },
    { month: 2, day: 4, name: 'Carnaval' },
    { month: 3, day: 18, name: 'Sexta-feira Santa' },
    { month: 5, day: 19, name: 'Corpus Christi' },

    // Placeholder for Municipal Holidays in São José do Rio Preto (RN00)
    // Example: Aniversário da Cidade (March 19), Padroeiro (March 19)
    { month: 2, day: 19, name: 'Aniversário de São José do Rio Preto' },
    // Add other municipal holidays as needed
  ];

  // Filter out holidays that are not for the current year if they have a specific year defined
  // (This logic is simplified as we're not dynamically calculating movable holidays here)
  return holidays;
};

function isHoliday(date: Date, year: number): boolean {
  const checkMonth = date.getMonth();
  const checkDay = date.getDate();
  
  const holidaysForYear = getHolidaysForYear(year);

  return holidaysForYear.some(holiday => {
    return holiday.month === checkMonth && holiday.day === checkDay;
  });
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

// RN03 – Férias não podem iniciar 2 dias antes de finais de semana e/ou feriados. (Include RN00)
export function isStartDateInvalid(date: Date): { invalid: boolean, reason?: string } {
  const checkYear = date.getFullYear();

  if (isWeekend(date)) {
    return { invalid: true, reason: 'A data de início não pode ser um final de semana.' };
  }
  if (isHoliday(date, checkYear)) {
    return { invalid: true, reason: 'A data de início não pode ser um feriado.' };
  }

  // Check 2 days before weekend
  const twoDaysAfter = addDays(date, 2);
  if (isWeekend(twoDaysAfter)) {
    return { invalid: true, reason: 'A data de início não pode ser 2 dias antes de um final de semana.' };
  }

  // Check 2 days before holiday
  const holidaysForYear = getHolidaysForYear(checkYear);
  for (const holiday of holidaysForYear) {
    const holidayDate = new Date(checkYear, holiday.month, holiday.day);
    // Ensure holidayDate is in the same year as date
    if (holidayDate.getFullYear() !== checkYear) continue;

    const twoDaysBeforeHoliday = addDays(holidayDate, -2);
    if (date.toDateString() === twoDaysBeforeHoliday.toDateString()) {
      return { invalid: true, reason: `A data de início não pode ser 2 dias antes do feriado de ${holiday.name}.` };
    }
  }
  
  return { invalid: false };
}


// --- DATE UTILITIES ---

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

// --- CORE VALIDATION AND SUGGESTION LOGIC ---

function isDateRangeConflict(
  newStartDate: Date,
  newEndDate: Date,
  existingRequests: VacationRequest[],
  employees: Employee[],
  employeeIdToExclude?: string // Used to exclude the employee's own existing requests during validation
): { conflict: boolean, message: string, conflictingEmployeeId?: string } {
  for (const request of existingRequests) {
    // Skip if validating against the employee's own request (e.g., when editing)
    if (employeeIdToExclude && request.employeeId === employeeIdToExclude) {
      continue;
    }

    const existingStartDate = new Date(request.startDate);
    const existingEndDate = new Date(request.endDate);

    if (
      (newStartDate >= existingStartDate && newStartDate <= existingEndDate) ||
      (newEndDate >= existingStartDate && newEndDate <= existingEndDate) ||
      (newStartDate <= existingStartDate && newEndDate >= existingEndDate)
    ) {
      const employeeName = employees.find(e => e.id === request.employeeId)?.name || 'Desconhecido';
      return { conflict: true, message: `Conflito com férias de ${employeeName}`, conflictingEmployeeId: request.employeeId };
    }
  }
  return { conflict: false, message: '' };
}

// RN04 – Cada time tem 1 QA; não pode haver dois QAs indisponíveis ao mesmo tempo.
function isQAConflict(
  newStartDate: Date,
  newEndDate: Date,
  employeeId: string,
  employees: Employee[],
  existingRequests: VacationRequest[]
): { conflict: boolean, message: string } {
  const currentEmployee = employees.find(emp => emp.id === employeeId);
  if (!currentEmployee || currentEmployee.role !== 'QA') {
    return { conflict: false, message: '' }; // Only applies to QAs
  }

  const qasInSameTeam = employees.filter(
    emp => emp.team === currentEmployee.team && emp.role === 'QA' && emp.id !== employeeId
  );

  for (const qa of qasInSameTeam) {
    const qaVacations = existingRequests.filter(
      req => req.employeeId === qa.id && (req.status === 'approved' || req.status === 'planned')
    );

    for (const qaVac of qaVacations) {
      const qaVacStartDate = new Date(qaVac.startDate);
      const qaVacEndDate = new Date(qaVac.endDate);

      if (
        (newStartDate >= qaVacStartDate && newStartDate <= qaVacEndDate) ||
        (newEndDate >= qaVacStartDate && newEndDate <= qaVacEndDate) ||
        (newStartDate <= qaVacStartDate && newEndDate >= qaVacEndDate)
      ) {
        return { conflict: true, message: `Conflito de QA: ${qa.name} do seu time já estará de férias neste período.` };
      }
    }
  }
  return { conflict: false, message: '' };
}


// RN01 – Cálculo automático de vencimento das férias.
// Regra: o vencimento das férias é calculado usando o dia e mês da data de admissão
// do funcionário e o ano informado como `ano de aquisição`.
// Prazo máximo para gozar as férias: 6 meses após a data de vencimento do período de aquisição.
// Passos de Cálculo:
// 1. Pegar o dia e o mês da data de admissão do funcionário.
// 2. Usar o ano de aquisição que foi inserido manualmente.
// 3. Construir uma nova data base com dia/mês/ano de aquisição.
// 4. Adicionar 6 meses a essa nova data para encontrar a data de vencimento.
// Exemplo: Admissão: 06/11/2017, Ano de Aquisição inserido: 2025
//   Data Base para cálculo: 06/11/2025
//   Data de Vencimento = 06/05/2026 (6 meses depois)
export function calculateVacationDueDate(admissionDateStr: string, acquisitionYear: number): Date {
  // This function now robustly handles 'DD/MM/YYYY' and 'YYYY-MM-DD' formats.
  let day: number, month: number;
  
  const ddmmyyyy = admissionDateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const yyyymmdd = admissionDateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (ddmmyyyy) {
    day = parseInt(ddmmyyyy[1], 10);
    month = parseInt(ddmmyyyy[2], 10) - 1; // JS month is 0-indexed
  } else if (yyyymmdd) {
    day = parseInt(yyyymmdd[3], 10);
    month = parseInt(yyyymmdd[2], 10) - 1; // JS month is 0-indexed
  } else {
    // Fallback for other formats, though less reliable
    const parsedDate = new Date(admissionDateStr);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid or unsupported admissionDate format: ${admissionDateStr}`);
    }
    // Adjust for potential timezone shifts when parsing
    const adjustedDate = new Date(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate());
    day = adjustedDate.getDate();
    month = adjustedDate.getMonth();
  }

  // Construct base date using acquisitionYear with the extracted day/month.
  // Use UTC to prevent timezone-related day shifts.
  const baseDate = new Date(Date.UTC(acquisitionYear, month, day));

  // Due date is 6 months after base date. addMonths should handle month rollovers.
  const dueDate = addMonths(baseDate, 6);
  
  return dueDate;
}

export function getDaysUntilDue(dueDate: Date): number {
  // Create a new Date object for today at midnight UTC to avoid timezone issues.
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  // The dueDate is already in UTC from calculateVacationDueDate.
  // We don't need to modify it, just ensure we're comparing UTC dates.
  const diffTime = dueDate.getTime() - todayUTC.getTime();
  
  // Use Math.floor to get the number of full days remaining.
  // Example: If diffTime is 29.9 days, it's still 29 full days left.
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}


// RN06 – Sistema deve sugerir datas válidas. Sistema deve sugerir primeiro os meses considerando os 6 meses de limitação,
// após o usuário selecionar o mês o sistema deve listar as possíveis datas respeitando as regras e conflitos,
// para os meses onde não há nenhuma data disponível, exibir a regra infrinda,
export function getSuggestedMonths(
  employeeId: string,
  employees: Employee[],
  existingRequests: VacationRequest[],
  acquisitionYear: number
): string[] {
  const suggestedMonths: string[] = [];
  const today = new Date();
  const employee = employees.find(emp => emp.id === employeeId);

  if (!employee) return [];

  // Calculate the due date based on RN01
  const dueDate = calculateVacationDueDate(employee.admissionDate, acquisitionYear);
  // Only suggest months within the permitted window: from baseDate (data base do período aquisitivo)
  // up to dueDate (baseDate + 6 months). This represents the legal 6-month window.
  const baseDate = addMonths(dueDate, -6); // baseDate = acquisition anniversary in acquisitionYear
  const windowStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const windowEnd = new Date(dueDate.getFullYear(), dueDate.getMonth(), 1);

  // Iterate month by month from windowStart to windowEnd (inclusive)
  for (let m = 0; ; m++) {
    const monthStart = new Date(windowStart.getFullYear(), windowStart.getMonth() + m, 1);
    if (monthStart > windowEnd) break;
    // Only include months that are not entirely in the past relative to today
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    if (monthEnd < today) continue; // skip months already finished
    const monthString = monthStart.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    suggestedMonths.push(monthString);
  }
  return suggestedMonths;
}

export function getSuggestedDatesForMonth(
  monthString: string,
  employeeId: string,
  employees: Employee[],
  existingRequests: VacationRequest[],
  acquisitionYear: number
): { dates: Date[], impediments: string[] } {
  const dates: Date[] = [];
  const impediments: string[] = [];
  
  const [monthName, yearString] = monthString.split(' de ');
  // Parse month name to number (0-indexed)
  const monthNames = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const month = monthNames.indexOf(monthName.toLowerCase());
  const year = parseInt(yearString);

  if (month === -1) {
    impediments.push('Mês inválido fornecido para sugestão.');
    return { dates, impediments };
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const startDate = new Date(Date.UTC(year, month, day)); // Use UTC for consistency
    const endDate = addDays(startDate, 29); // Assume 30 days for suggestion (RN02)

    // Create a dummy request for validation
    const dummyRequest: VacationRequest = {
      id: 'temp', // Temporary ID
      employeeId: employeeId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'planned',
      acquisitionYear: acquisitionYear // Pass acquisitionYear for RN01 validation
    };

    const validationResult = validateVacationRequest(dummyRequest, existingRequests, employees);

    if (validationResult.isValid) {
      dates.push(startDate);
    } else {
      // RN06: exibir a regra infringida
      const impedimentMessage = `Período começando em ${startDate.toLocaleDateString('pt-BR')}: ${validationResult.messages.join(', ')}`;
      if (!impediments.includes(impedimentMessage)) { // Avoid duplicate messages for the same reason
        impediments.push(impedimentMessage);
      }
    }
  }

  return { dates, impediments };
}


export function validateVacationRequest(
  request: VacationRequest,
  existingRequests: VacationRequest[],
  employees: Employee[]
): { isValid: boolean; messages: string[]; isSpecialApproval: boolean } {
  const errors: string[] = [];
  const warnings: string[] = [];

  const startDate = new Date(request.startDate + 'T00:00:00');
  const endDate = new Date(request.endDate + 'T00:00:00');
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // --- 1. Hard-blocking errors ---
  if (startDate <= today) {
    errors.push('A data de início deve ser no futuro.');
  }
  if (startDate > endDate) {
    errors.push('A data de início não pode ser posterior à data de fim.');
  }
  const startDateInvalidCheck = isStartDateInvalid(startDate);
  if (startDateInvalidCheck.invalid) {
    errors.push(startDateInvalidCheck.reason || 'Data de início inválida.');
  }
  const conflictResult = isDateRangeConflict(startDate, endDate, existingRequests, employees, String(request.id));
  if (conflictResult.conflict) {
    errors.push(conflictResult.message);
  }
  const qaConflictResult = isQAConflict(startDate, endDate, request.employeeId, employees, existingRequests);
  if (qaConflictResult.conflict) {
    errors.push(qaConflictResult.message);
  }
  if (!request.acquisitionYear) {
    errors.push('Ano de aquisição é obrigatório para validação do vencimento.');
  }

  // --- 2. Warnings (require special approval) ---
  const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
  const standardPeriods = [10, 15, 20];
  if (!standardPeriods.includes(duration)) {
    warnings.push(`Período de ${duration} dias não é um período padrão.`);
  }
  const employee = employees.find(emp => emp.id === request.employeeId);
  if (employee && request.acquisitionYear) {
    const dueDate = calculateVacationDueDate(employee.admissionDate, request.acquisitionYear);
    if (endDate > dueDate) {
      warnings.push(`Período de férias excede o prazo máximo legal de ${dueDate.toLocaleDateString('pt-BR')}.`);
    }
  }

  // --- 3. Final result ---
  if (errors.length > 0) {
    return { isValid: false, messages: errors, isSpecialApproval: false };
  }
  if (warnings.length > 0) {
    return { isValid: true, messages: warnings, isSpecialApproval: true };
  }

  return { isValid: true, messages: ['Período de férias válido.'], isSpecialApproval: false };
}


// The original calculateDueDate and getDaysUntilDue are replaced by calculateVacationDueDate and getDaysUntilDue above.
// This function is kept for compatibility if other parts of the code still reference it,
// but its logic is now handled by calculateVacationDueDate.
export function calculateDueDate(admissionDate: string): Date {
  // This function is now deprecated or should be re-evaluated based on RN01.
  // For now, returning a placeholder or adapting to the new RN01 logic.
  // The new RN01 logic requires an acquisitionYear, which is not available here.
  // This function might need to be removed or its usage updated in other components.
  console.warn("calculateDueDate(admissionDate) is deprecated. Use calculateVacationDueDate(admissionDate, acquisitionYear) instead.");
  const date = new Date(admissionDate);
  date.setMonth(date.getMonth() + 11); // Original logic
  return date;
}

