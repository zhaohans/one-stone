import { useState, useEffect } from "react";
import UserService, { OnboardingStep } from "@/services/UserService";
import { useAuth } from "@/contexts/SimpleAuthContext";

export interface OnboardingState {
  steps: OnboardingStep[];
  completed: number;
  total: number;
  isComplete: boolean;
  isLoading: boolean;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [state, setState] = useState<OnboardingState>({
    steps: [],
    completed: 0,
    total: 3,
    isComplete: false,
    isLoading: true,
  });

  useEffect(() => {
    if (!user) {
      setState({
        steps: [],
        completed: 0,
        total: 3,
        isComplete: false,
        isLoading: false,
      });
      return;
    }

    loadOnboardingProgress();
  }, [user]);

  const loadOnboardingProgress = async () => {
    if (!user) return;

    try {
      const progress = await UserService.getOnboardingProgress(user.id);
      setState({
        steps: progress.steps,
        completed: progress.completed,
        total: progress.total,
        isComplete: progress.completed === progress.total,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading onboarding progress:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const completeStep = async (
    step: "profile_completion" | "preferences_setup" | "tutorial_completion",
    data: Record<string, any> = {},
  ) => {
    if (!user) return false;

    try {
      const success = await UserService.completeOnboardingStep(
        user.id,
        step,
        data,
      );
      if (success) {
        await loadOnboardingProgress();
      }
      return success;
    } catch (error) {
      console.error("Error completing onboarding step:", error);
      return false;
    }
  };

  return {
    ...state,
    completeStep,
    refresh: loadOnboardingProgress,
  };
};
