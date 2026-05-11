import { describe, it, expect } from 'vitest';
import {
  isValidTransition,
  getAllowedTransitions,
  isTerminalState,
  getTransitionErrorMessage
} from './responseStateMachine';
import { ResponseStatus } from '@/types/donor-response';

describe('responseStateMachine', () => {
  describe('isValidTransition', () => {
    // Valid transitions from Interested
    it('should allow Interested → Confirmed', () => {
      expect(isValidTransition(ResponseStatus.Interested, ResponseStatus.Confirmed)).toBe(true);
    });

    it('should allow Interested → Rejected', () => {
      expect(isValidTransition(ResponseStatus.Interested, ResponseStatus.Rejected)).toBe(true);
    });

    it('should allow Interested → Cancelled', () => {
      expect(isValidTransition(ResponseStatus.Interested, ResponseStatus.Cancelled)).toBe(true);
    });

    // Invalid transitions from Interested
    it('should reject Interested → Donated', () => {
      expect(isValidTransition(ResponseStatus.Interested, ResponseStatus.Donated)).toBe(false);
    });

    it('should reject Interested → NoShow', () => {
      expect(isValidTransition(ResponseStatus.Interested, ResponseStatus.NoShow)).toBe(false);
    });

    // Valid transitions from Confirmed
    it('should allow Confirmed → Donated', () => {
      expect(isValidTransition(ResponseStatus.Confirmed, ResponseStatus.Donated)).toBe(true);
    });

    it('should allow Confirmed → NoShow', () => {
      expect(isValidTransition(ResponseStatus.Confirmed, ResponseStatus.NoShow)).toBe(true);
    });

    it('should allow Confirmed → Cancelled', () => {
      expect(isValidTransition(ResponseStatus.Confirmed, ResponseStatus.Cancelled)).toBe(true);
    });

    // Invalid transitions from Confirmed
    it('should reject Confirmed → Interested', () => {
      expect(isValidTransition(ResponseStatus.Confirmed, ResponseStatus.Interested)).toBe(false);
    });

    it('should reject Confirmed → Rejected', () => {
      expect(isValidTransition(ResponseStatus.Confirmed, ResponseStatus.Rejected)).toBe(false);
    });

    // Valid transitions from Rejected
    it('should allow Rejected → Cancelled', () => {
      expect(isValidTransition(ResponseStatus.Rejected, ResponseStatus.Cancelled)).toBe(true);
    });

    // Invalid transitions from Rejected
    it('should reject Rejected → Confirmed', () => {
      expect(isValidTransition(ResponseStatus.Rejected, ResponseStatus.Confirmed)).toBe(false);
    });

    it('should reject Rejected → Donated', () => {
      expect(isValidTransition(ResponseStatus.Rejected, ResponseStatus.Donated)).toBe(false);
    });

    // Valid transitions from NoShow
    it('should allow NoShow → Confirmed', () => {
      expect(isValidTransition(ResponseStatus.NoShow, ResponseStatus.Confirmed)).toBe(true);
    });

    it('should allow NoShow → Cancelled', () => {
      expect(isValidTransition(ResponseStatus.NoShow, ResponseStatus.Cancelled)).toBe(true);
    });

    // Invalid transitions from NoShow
    it('should reject NoShow → Donated', () => {
      expect(isValidTransition(ResponseStatus.NoShow, ResponseStatus.Donated)).toBe(false);
    });

    it('should reject NoShow → Interested', () => {
      expect(isValidTransition(ResponseStatus.NoShow, ResponseStatus.Interested)).toBe(false);
    });

    // Terminal state: Donated
    it('should reject any transition from Donated', () => {
      const allStatuses = [
        ResponseStatus.Interested,
        ResponseStatus.Confirmed,
        ResponseStatus.Rejected,
        ResponseStatus.NoShow,
        ResponseStatus.Cancelled
      ];

      allStatuses.forEach(status => {
        expect(isValidTransition(ResponseStatus.Donated, status)).toBe(false);
      });
    });

    // Terminal state: Cancelled
    it('should reject any transition from Cancelled', () => {
      const allStatuses = [
        ResponseStatus.Interested,
        ResponseStatus.Confirmed,
        ResponseStatus.Donated,
        ResponseStatus.Rejected,
        ResponseStatus.NoShow
      ];

      allStatuses.forEach(status => {
        expect(isValidTransition(ResponseStatus.Cancelled, status)).toBe(false);
      });
    });
  });

  describe('getAllowedTransitions', () => {
    it('should return correct transitions for Interested', () => {
      const transitions = getAllowedTransitions(ResponseStatus.Interested);
      expect(transitions).toEqual([
        ResponseStatus.Confirmed,
        ResponseStatus.Rejected,
        ResponseStatus.Cancelled
      ]);
    });

    it('should return correct transitions for Confirmed', () => {
      const transitions = getAllowedTransitions(ResponseStatus.Confirmed);
      expect(transitions).toEqual([
        ResponseStatus.Donated,
        ResponseStatus.NoShow,
        ResponseStatus.Cancelled
      ]);
    });

    it('should return correct transitions for Rejected', () => {
      const transitions = getAllowedTransitions(ResponseStatus.Rejected);
      expect(transitions).toEqual([ResponseStatus.Cancelled]);
    });

    it('should return correct transitions for NoShow', () => {
      const transitions = getAllowedTransitions(ResponseStatus.NoShow);
      expect(transitions).toEqual([
        ResponseStatus.Confirmed,
        ResponseStatus.Cancelled
      ]);
    });

    it('should return empty array for Donated', () => {
      const transitions = getAllowedTransitions(ResponseStatus.Donated);
      expect(transitions).toEqual([]);
    });

    it('should return empty array for Cancelled', () => {
      const transitions = getAllowedTransitions(ResponseStatus.Cancelled);
      expect(transitions).toEqual([]);
    });
  });

  describe('isTerminalState', () => {
    it('should identify Donated as terminal state', () => {
      expect(isTerminalState(ResponseStatus.Donated)).toBe(true);
    });

    it('should identify Cancelled as terminal state', () => {
      expect(isTerminalState(ResponseStatus.Cancelled)).toBe(true);
    });

    it('should identify Interested as non-terminal state', () => {
      expect(isTerminalState(ResponseStatus.Interested)).toBe(false);
    });

    it('should identify Confirmed as non-terminal state', () => {
      expect(isTerminalState(ResponseStatus.Confirmed)).toBe(false);
    });

    it('should identify Rejected as non-terminal state', () => {
      expect(isTerminalState(ResponseStatus.Rejected)).toBe(false);
    });

    it('should identify NoShow as non-terminal state', () => {
      expect(isTerminalState(ResponseStatus.NoShow)).toBe(false);
    });
  });

  describe('getTransitionErrorMessage', () => {
    it('should return specific error for Donated state', () => {
      const message = getTransitionErrorMessage(
        ResponseStatus.Donated,
        ResponseStatus.Cancelled
      );
      expect(message).toBe('لا يمكن تغيير حالة استجابة تم التبرع بها مسبقاً');
    });

    it('should return specific error for Cancelled state', () => {
      const message = getTransitionErrorMessage(
        ResponseStatus.Cancelled,
        ResponseStatus.Confirmed
      );
      expect(message).toBe('لا يمكن تغيير حالة استجابة ملغاة');
    });

    it('should return descriptive error for invalid transition', () => {
      const message = getTransitionErrorMessage(
        ResponseStatus.Interested,
        ResponseStatus.Donated
      );
      expect(message).toContain('الانتقال من');
      expect(message).toContain('مهتم');
      expect(message).toContain('تم التبرع');
      expect(message).toContain('غير مسموح');
    });

    it('should list allowed transitions in error message', () => {
      const message = getTransitionErrorMessage(
        ResponseStatus.Interested,
        ResponseStatus.NoShow
      );
      expect(message).toContain('مؤكد');
      expect(message).toContain('مرفوض');
      expect(message).toContain('ملغى');
    });
  });

  describe('Edge cases', () => {
    it('should handle same state transition (should be invalid)', () => {
      expect(isValidTransition(ResponseStatus.Interested, ResponseStatus.Interested)).toBe(false);
      expect(isValidTransition(ResponseStatus.Confirmed, ResponseStatus.Confirmed)).toBe(false);
    });

    it('should handle all possible state combinations', () => {
      const allStatuses = [
        ResponseStatus.Interested,
        ResponseStatus.Confirmed,
        ResponseStatus.Donated,
        ResponseStatus.Rejected,
        ResponseStatus.NoShow,
        ResponseStatus.Cancelled
      ];

      // Verify that every state has a defined transition map
      allStatuses.forEach(from => {
        allStatuses.forEach(to => {
          // Should not throw error
          const result = isValidTransition(from, to);
          expect(typeof result).toBe('boolean');
        });
      });
    });
  });
});
