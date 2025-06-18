
import { useState, useEffect, useCallback } from 'react';
import UserService, { OnboardingStep } from '@/services/UserService';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface OnboardingState {
  steps: OnboardingStep[];
  currentStep: string | null;
  progress: number;
  isComplete: boolean;
  isLoading: boolean;
}

export interface OnboardingActions {
  completeStep: (step: 'profile_completion' | 'preferences_setup' | 'tutorial_completion', data?: Record<string, any>) => Promise<boolean>;
  refreshProgress: () => Promise<void>;
  getNextStep: () => string | null;
}

export function useOnboarding(): OnboardingState & OnboardingActions {
  const { user, refreshProfile } = useAuth();
  const [state, setState] = useState<OnboardingState>({
    steps: [],
    currentStep: null,
    progress: 0,
    isComplete: false,
    isLoading: true,
  });

  const stepOrder = ['profile_completion', 'preferences_setup', 'tutorial_completion'];

  const refreshProgress = useCallback(async () => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { completed, total, steps } = await UserService.getOnboardingProgress(user.id);
      const isComplete = completed === total;
      
      const currentStep = stepOrder.find(step => 
        !steps.some(s => s.step === step && s.completed_at !== null)
      ) || null;

      setState({
        steps,
        currentStep,
        progress: (completed / total) * 100,
        isComplete,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error refreshing onboarding progress:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  const completeStep = useCallback(async (
    step: 'profile_completion' | 'preferences_setup' | 'tutorial_completion',
    data: Record<string, any> = {}
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const success = await UserService.completeOnboardingStep(user.id, step, data);
      
      if (success) {
        await refreshProgress();
        await refreshProfile(); // Update auth state
        
        const stepNames = {
          profile_completion: 'Profile completion',
          preferences_setup: 'Preferences setup',
          tutorial_completion: 'Tutorial completion'
        };
        
        toast.success(`${stepNames[step]} completed!`);
        
        // Check if all steps are complete
        const isNowComplete = await UserService.isOnboardingComplete(user.id);
        if (isNowComplete) {
          toast.success('Welcome! Your onboarding is now complete.');
        }
        
        return true;
      }
      
      toast.error('Failed to complete onboarding step');
      return false;
    } catch (error) {
      console.error('Error completing onboarding step:', error);
      toast.error('Failed to complete onboarding step');
      return false;
    }
  }, [user, refreshProgress, refreshProfile]);

  const getNextStep = useCallback((): string | null => {
    return state.currentStep;
  }, [state.currentStep]);

  useEffect(() => {
    if (user) {
      refreshProgress();
    }
  }, [user, refreshProgress]);

  return {
    ...state,
    completeStep,
    refreshProgress,
    getNextStep,
  };
}
