import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, Smartphone, QrCode, Copy, Check } from "lucide-react";

interface TwoFactorSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const TwoFactorSetup = ({
  open,
  onOpenChange,
  isEnabled,
  onToggle,
}: TwoFactorSetupProps) => {
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes] = useState([
    "A1B2C3D4",
    "E5F6G7H8",
    "I9J0K1L2",
    "M3N4O5P6",
    "Q7R8S9T0",
  ]);
  const [secretKey] = useState("JBSWY3DPEHPK3PXP");
  const [copied, setCopied] = useState(false);

  const copySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    toast.success("Secret key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    // Simulate verification
    setTimeout(() => {
      if (!isEnabled) {
        toast.success("Two-factor authentication enabled successfully");
        onToggle(true);
        setStep(3);
      } else {
        toast.success("Two-factor authentication disabled");
        onToggle(false);
        onOpenChange(false);
      }
    }, 1000);
  };

  const handleClose = () => {
    setStep(1);
    setVerificationCode("");
    onOpenChange(false);
  };

  const renderSetupStep = () => {
    if (isEnabled) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-medium">
              Two-Factor Authentication is Enabled
            </span>
            <Badge variant="default">Active</Badge>
          </div>

          <p className="text-sm text-gray-600">
            Your account is protected with two-factor authentication. You'll
            need your authenticator app to log in.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Backup Codes</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Keep these codes safe. You can use them to access your account if
              you lose your device.
            </p>
            <div className="grid grid-cols-1 gap-1 font-mono text-sm">
              {backupCodes.map((code, index) => (
                <span key={index} className="bg-white px-2 py-1 rounded border">
                  {code}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="disableCode">
              Enter verification code to disable 2FA
            </Label>
            <Input
              id="disableCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleVerify}
              className="flex-1"
            >
              Disable 2FA
            </Button>
          </div>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <QrCode className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-medium mb-2">
                Setup Two-Factor Authentication
              </h3>
              <p className="text-sm text-gray-600">
                Scan this QR code with your authenticator app (Google
                Authenticator, Authy, etc.)
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                QR Code for OSC Account
              </p>
            </div>

            <div className="space-y-2">
              <Label>Or enter this secret key manually:</Label>
              <div className="flex gap-2">
                <Input
                  value={secretKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="sm" onClick={copySecret}>
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="w-full">
              <Smartphone className="w-4 h-4 mr-2" />
              I've Added the Account
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-medium mb-2">Verify Setup</h3>
              <p className="text-sm text-gray-600">
                Enter the 6-digit code from your authenticator app to complete
                setup
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verifyCode">Verification Code</Label>
              <Input
                id="verifyCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button onClick={handleVerify} className="flex-1">
                Verify & Enable
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Check className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-medium mb-2">
                Two-Factor Authentication Enabled!
              </h3>
              <p className="text-sm text-gray-600">
                Your account is now secured with two-factor authentication.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">
                Important: Save Your Backup Codes
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                Store these codes in a secure location. You can use them if you
                lose access to your authenticator app.
              </p>
              <div className="grid grid-cols-1 gap-1 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <span
                    key={index}
                    className="bg-white px-2 py-1 rounded border"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              Complete Setup
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {isEnabled
              ? "Manage Two-Factor Authentication"
              : "Setup Two-Factor Authentication"}
          </DialogTitle>
          <DialogDescription>
            {isEnabled
              ? "Manage your two-factor authentication settings"
              : "Add an extra layer of security to your account"}
          </DialogDescription>
        </DialogHeader>

        {renderSetupStep()}
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorSetup;
