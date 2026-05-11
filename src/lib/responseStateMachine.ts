/**
 * Response State Machine
 * Manages state transitions for donor responses to blood requests
 * 
 * State Transition Rules:
 * - Interested → Confirmed, Rejected, Cancelled
 * - Confirmed → Donated, NoShow, Cancelled
 * - Rejected → Cancelled
 * - NoShow → Confirmed, Cancelled
 * - Donated → (no transitions allowed - terminal state)
 * - Cancelled → (no transitions allowed - terminal state)
 */

import { ResponseStatus } from '@/types/donor-response';

/**
 * State transition map defining allowed transitions from each state
 */
const STATE_TRANSITIONS: Record<ResponseStatus, ResponseStatus[]> = {
  [ResponseStatus.Interested]: [
    ResponseStatus.Confirmed,
    ResponseStatus.Rejected,
    ResponseStatus.Cancelled
  ],
  [ResponseStatus.Confirmed]: [
    ResponseStatus.Donated,
    ResponseStatus.NoShow,
    ResponseStatus.Cancelled
  ],
  [ResponseStatus.Rejected]: [
    ResponseStatus.Cancelled
  ],
  [ResponseStatus.NoShow]: [
    ResponseStatus.Confirmed,
    ResponseStatus.Cancelled
  ],
  [ResponseStatus.Donated]: [],
  [ResponseStatus.Cancelled]: []
};

/**
 * Terminal states that cannot transition to any other state
 */
const TERMINAL_STATES: ResponseStatus[] = [
  ResponseStatus.Donated,
  ResponseStatus.Cancelled
];

/**
 * Validates if a state transition is allowed
 * 
 * @param from - Current response status
 * @param to - Target response status
 * @returns true if the transition is valid, false otherwise
 * 
 * @example
 * isValidTransition(ResponseStatus.Interested, ResponseStatus.Confirmed) // true
 * isValidTransition(ResponseStatus.Interested, ResponseStatus.Donated) // false
 * isValidTransition(ResponseStatus.Donated, ResponseStatus.Cancelled) // false
 */
export function isValidTransition(
  from: ResponseStatus,
  to: ResponseStatus
): boolean {
  const allowedTransitions = STATE_TRANSITIONS[from];
  return allowedTransitions.includes(to);
}

/**
 * Gets all allowed transitions from a given state
 * 
 * @param from - Current response status
 * @returns Array of allowed target states
 * 
 * @example
 * getAllowedTransitions(ResponseStatus.Interested) 
 * // [ResponseStatus.Confirmed, ResponseStatus.Rejected, ResponseStatus.Cancelled]
 * 
 * getAllowedTransitions(ResponseStatus.Donated) 
 * // []
 */
export function getAllowedTransitions(from: ResponseStatus): ResponseStatus[] {
  return STATE_TRANSITIONS[from] || [];
}

/**
 * Checks if a state is terminal (no further transitions allowed)
 * 
 * @param status - Response status to check
 * @returns true if the state is terminal, false otherwise
 * 
 * @example
 * isTerminalState(ResponseStatus.Donated) // true
 * isTerminalState(ResponseStatus.Cancelled) // true
 * isTerminalState(ResponseStatus.Interested) // false
 */
export function isTerminalState(status: ResponseStatus): boolean {
  return TERMINAL_STATES.includes(status);
}

/**
 * Gets a human-readable error message for an invalid transition
 * 
 * @param from - Current response status
 * @param to - Target response status
 * @returns Arabic error message describing why the transition is invalid
 * 
 * @example
 * getTransitionErrorMessage(ResponseStatus.Donated, ResponseStatus.Cancelled)
 * // "لا يمكن تغيير حالة استجابة تم التبرع بها مسبقاً"
 */
export function getTransitionErrorMessage(
  from: ResponseStatus,
  to: ResponseStatus
): string {
  // Check if from state is terminal
  if (from === ResponseStatus.Donated) {
    return 'لا يمكن تغيير حالة استجابة تم التبرع بها مسبقاً';
  }
  
  if (from === ResponseStatus.Cancelled) {
    return 'لا يمكن تغيير حالة استجابة ملغاة';
  }
  
  // Check if transition is invalid
  if (!isValidTransition(from, to)) {
    const allowedTransitions = getAllowedTransitions(from);
    const allowedLabels = allowedTransitions
      .map(status => getStatusLabel(status))
      .join('، ');
    
    return `الانتقال من ${getStatusLabel(from)} إلى ${getStatusLabel(to)} غير مسموح. الانتقالات المسموحة: ${allowedLabels}`;
  }
  
  return 'انتقال غير صحيح';
}

/**
 * Helper function to get Arabic label for a status
 * 
 * @param status - Response status
 * @returns Arabic label for the status
 */
function getStatusLabel(status: ResponseStatus): string {
  const labels: Record<ResponseStatus, string> = {
    [ResponseStatus.Interested]: 'مهتم',
    [ResponseStatus.Confirmed]: 'مؤكد',
    [ResponseStatus.Donated]: 'تم التبرع',
    [ResponseStatus.Rejected]: 'مرفوض',
    [ResponseStatus.NoShow]: 'لم يحضر',
    [ResponseStatus.Cancelled]: 'ملغى'
  };
  
  return labels[status] || 'غير معروف';
}
