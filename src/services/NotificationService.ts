
import { supabase } from '@/integrations/supabase/client';

export interface EmailNotification {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  attachments?: {
    filename: string;
    content: string;
    contentType: string;
  }[];
}

export interface SMSNotification {
  to: string;
  message: string;
}

export class NotificationService {
  
  // Send email notification
  static async sendEmail(notification: EmailNotification): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: { 
          type: 'email',
          ...notification 
        }
      });

      if (error) throw error;
      
      return { success: true };

    } catch (error) {
      console.error('Error sending email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Send SMS notification
  static async sendSMS(notification: SMSNotification): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: { 
          type: 'sms',
          ...notification 
        }
      });

      if (error) throw error;
      
      return { success: true };

    } catch (error) {
      console.error('Error sending SMS:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Send compliance alert
  static async sendComplianceAlert(
    recipientEmail: string,
    alertType: string,
    clientName: string,
    description: string
  ): Promise<{ success: boolean; error?: string }> {
    const subject = `Compliance Alert: ${alertType}`;
    const htmlContent = `
      <h2>Compliance Alert</h2>
      <p><strong>Alert Type:</strong> ${alertType}</p>
      <p><strong>Client:</strong> ${clientName}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      <p>Please review and take appropriate action.</p>
    `;

    return this.sendEmail({
      to: [recipientEmail],
      subject,
      htmlContent,
      textContent: `Compliance Alert: ${alertType} for ${clientName}. ${description}`
    });
  }

  // Send trade confirmation
  static async sendTradeConfirmation(
    clientEmail: string,
    tradeDetails: any
  ): Promise<{ success: boolean; error?: string }> {
    const subject = `Trade Confirmation - ${tradeDetails.security_symbol}`;
    const htmlContent = `
      <h2>Trade Confirmation</h2>
      <p>Dear Client,</p>
      <p>This confirms your ${tradeDetails.trade_type} order:</p>
      <ul>
        <li><strong>Security:</strong> ${tradeDetails.security_symbol}</li>
        <li><strong>Quantity:</strong> ${tradeDetails.quantity}</li>
        <li><strong>Price:</strong> ${tradeDetails.price}</li>
        <li><strong>Trade Date:</strong> ${tradeDetails.trade_date}</li>
        <li><strong>Settlement Date:</strong> ${tradeDetails.settlement_date}</li>
      </ul>
      <p>If you have any questions, please contact your advisor.</p>
    `;

    return this.sendEmail({
      to: [clientEmail],
      subject,
      htmlContent
    });
  }

  // Send fee invoice
  static async sendFeeInvoice(
    clientEmail: string,
    feeDetails: any
  ): Promise<{ success: boolean; error?: string }> {
    const subject = `Fee Invoice - ${feeDetails.fee_type}`;
    const htmlContent = `
      <h2>Fee Invoice</h2>
      <p>Dear Client,</p>
      <p>Please find your ${feeDetails.fee_type} fee invoice below:</p>
      <ul>
        <li><strong>Period:</strong> ${feeDetails.calculation_period_start} to ${feeDetails.calculation_period_end}</li>
        <li><strong>Fee Amount:</strong> ${feeDetails.currency} ${feeDetails.fee_amount}</li>
        <li><strong>Due Date:</strong> ${feeDetails.due_date}</li>
      </ul>
      <p>Payment will be automatically debited from your account.</p>
    `;

    return this.sendEmail({
      to: [clientEmail],
      subject,
      htmlContent
    });
  }
}
