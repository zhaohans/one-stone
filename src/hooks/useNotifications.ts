import { useState } from "react";
import {
  NotificationService,
  EmailNotification,
  SMSNotification,
} from "@/services/NotificationService";
import { useToast } from "@/hooks/use-toast";

export const useNotifications = () => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendEmail = async (notification: EmailNotification) => {
    setIsSending(true);

    try {
      const result = await NotificationService.sendEmail(notification);

      if (result.success) {
        toast({
          title: "Email Sent",
          description: "Email notification has been sent successfully",
        });
        return { success: true };
      } else {
        throw new Error(result.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Email Failed",
        description:
          error instanceof Error ? error.message : "Failed to send email",
        variant: "destructive",
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsSending(false);
    }
  };

  const sendSMS = async (notification: SMSNotification) => {
    setIsSending(true);

    try {
      const result = await NotificationService.sendSMS(notification);

      if (result.success) {
        toast({
          title: "SMS Sent",
          description: "SMS notification has been sent successfully",
        });
        return { success: true };
      } else {
        throw new Error(result.error || "Failed to send SMS");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast({
        title: "SMS Failed",
        description:
          error instanceof Error ? error.message : "Failed to send SMS",
        variant: "destructive",
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsSending(false);
    }
  };

  const sendComplianceAlert = async (
    recipientEmail: string,
    alertType: string,
    clientName: string,
    description: string,
  ) => {
    setIsSending(true);

    try {
      const result = await NotificationService.sendComplianceAlert(
        recipientEmail,
        alertType,
        clientName,
        description,
      );

      if (result.success) {
        toast({
          title: "Compliance Alert Sent",
          description: `Alert sent to ${recipientEmail}`,
        });
        return { success: true };
      } else {
        throw new Error(result.error || "Failed to send compliance alert");
      }
    } catch (error) {
      console.error("Error sending compliance alert:", error);
      toast({
        title: "Alert Failed",
        description:
          error instanceof Error ? error.message : "Failed to send alert",
        variant: "destructive",
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendEmail,
    sendSMS,
    sendComplianceAlert,
    isSending,
  };
};
