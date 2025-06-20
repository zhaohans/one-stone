import React, { useState } from "react";
import { useAuth } from "@/contexts/SimpleAuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSuccessToast, useErrorToast } from "@/components/ui/toast-manager";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const steps = ["Profile Info", "Preferences", "Security"];

const Onboarding: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    department: profile?.department || "",
    position: profile?.position || "",
    theme: "light",
    notifications: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = async () => {
    if (step === 0) {
      setIsSubmitting(true);
      setError(null);
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          department: form.department,
          position: form.position,
        })
        .eq("id", profile?.id ?? "");
      setIsSubmitting(false);
      if (error) {
        setError("Failed to update profile info");
        errorToast("Failed to update profile info");
        return;
      }
      successToast("Profile info saved");
      refreshProfile();
    }
    setStep((s) => s + 1);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setError(null);
    // Mark all onboarding steps as completed
    const requiredSteps = [
      "profile_completion",
      "preferences_setup",
      "tutorial_completion",
    ];
    const onboardingRows = requiredSteps.map((step) => {
      if (!profile?.id) {
        throw new Error("Profile ID is missing");
      }
      return {
        user_id: profile.id,
        step: step as any, // typecast for supabase enum
        completed_at: new Date().toISOString(),
        data: {},
        updated_at: new Date().toISOString(),
      };
    });
    await supabase
      .from("user_onboarding")
      .upsert(onboardingRows, { onConflict: "user_id,step" });
    // Mark onboarding complete in profiles (optional, for legacy support)
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        department: form.department,
        position: form.position,
      })
      .eq("id", profile?.id ?? "");
    setIsSubmitting(false);
    if (error) {
      setError("Failed to complete onboarding");
      errorToast("Failed to complete onboarding");
      return;
    }
    successToast("Onboarding complete!");
    refreshProfile();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <ErrorBoundary>
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Welcome to One Stone Capital</CardTitle>
            <CardDescription>
              Step {step + 1} of {steps.length}: {steps[step]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-red-600 font-medium text-center mb-4">
                {error}
              </div>
            )}
            {step === 0 && (
              <form className="space-y-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                  />
                </div>
                <Button
                  type="button"
                  className="w-full mt-4"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Next"
                  )}
                </Button>
              </form>
            )}
            {step === 1 && (
              <form className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <select
                    id="theme"
                    name="theme"
                    value={form.theme}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="notifications"
                    checked={form.notifications}
                    onChange={handleChange}
                  />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
                <Button
                  type="button"
                  className="w-full mt-4"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </form>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <p>
                  For your security, we recommend enabling two-factor
                  authentication (2FA) in your profile settings after
                  onboarding.
                </p>
                <Button
                  type="button"
                  className="w-full mt-4"
                  onClick={handleFinish}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Finishing...
                    </>
                  ) : (
                    "Finish Onboarding"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </ErrorBoundary>
    </div>
  );
};

export default Onboarding;
