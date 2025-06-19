import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClientsContext } from "@/contexts/ClientsContext";
import { CreateAccountData } from "@/types/account";
import { z } from "zod";

interface CreateAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAccount: (
    accountData: CreateAccountData,
  ) => Promise<{ success: boolean; data?: any; error?: any }>;
}

const accountSchema = z.object({
  account_name: z.string().min(1, "Account name is required"),
  client_id: z.string().min(1, "Client is required"),
  account_type: z.enum([
    "individual",
    "joint",
    "corporate",
    "trust",
    "retirement",
  ]),
  base_currency: z.string().min(1, "Base currency is required"),
  risk_tolerance: z.string().min(1, "Risk tolerance is required"),
  investment_objective: z.string().optional(),
  benchmark: z.string().optional(),
});

const CreateAccountModal = ({
  open,
  onOpenChange,
  onCreateAccount,
}: CreateAccountModalProps) => {
  const { clients, isLoading: clientsLoading } = useClientsContext();
  const [formData, setFormData] = useState<{
    account_name: string;
    client_id: string;
    account_type: "individual" | "joint" | "corporate" | "trust" | "retirement";
    base_currency: string;
    risk_tolerance: string;
    investment_objective: string;
    benchmark: string;
  }>({
    account_name: "",
    client_id: "",
    account_type: "individual",
    base_currency: "USD",
    risk_tolerance: "moderate",
    investment_objective: "",
    benchmark: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const accountTypes = [
    "individual",
    "joint",
    "corporate",
    "trust",
    "retirement",
  ] as const;
  const currencies = ["USD", "SGD", "EUR", "HKD", "GBP"];
  const riskTolerances = ["conservative", "moderate", "aggressive"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    const parseResult = accountSchema.safeParse(formData);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }
    try {
      const result = await onCreateAccount({
        ...formData,
        opening_date: new Date().toISOString().split("T")[0],
      });
      if (result.success) {
        onOpenChange(false);
        setFormData({
          account_name: "",
          client_id: "",
          account_type: "individual",
          base_currency: "USD",
          risk_tolerance: "moderate",
          investment_objective: "",
          benchmark: "",
        });
      }
    } catch (error) {
      console.error("Error creating account:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="account_name">Account Name</Label>
              <Input
                id="account_name"
                value={formData.account_name}
                onChange={(e) =>
                  setFormData({ ...formData, account_name: e.target.value })
                }
                aria-invalid={!!errors.account_name}
              />
              {errors.account_name && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.account_name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="client_id">Client</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, client_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.first_name} {client.last_name} (
                      {client.client_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.client_id && (
                <p className="text-red-600 text-xs mt-1">{errors.client_id}</p>
              )}
            </div>

            <div>
              <Label htmlFor="account_type">Account Type</Label>
              <Select
                value={formData.account_type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    account_type: value as (typeof accountTypes)[number],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.account_type && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.account_type}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="base_currency">Base Currency</Label>
              <Select
                value={formData.base_currency}
                onValueChange={(value) =>
                  setFormData({ ...formData, base_currency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.base_currency && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.base_currency}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="risk_tolerance">Risk Tolerance</Label>
              <Select
                value={formData.risk_tolerance}
                onValueChange={(value) =>
                  setFormData({ ...formData, risk_tolerance: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {riskTolerances.map((risk) => (
                    <SelectItem key={risk} value={risk}>
                      {risk.charAt(0).toUpperCase() + risk.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.risk_tolerance && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.risk_tolerance}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="benchmark">Benchmark</Label>
              <Input
                id="benchmark"
                value={formData.benchmark}
                onChange={(e) =>
                  setFormData({ ...formData, benchmark: e.target.value })
                }
                placeholder="e.g., S&P 500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="investment_objective">Investment Objective</Label>
            <Textarea
              id="investment_objective"
              value={formData.investment_objective}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  investment_objective: e.target.value,
                })
              }
              placeholder="Describe the investment objective..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccountModal;
