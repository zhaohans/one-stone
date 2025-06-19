import { supabase } from "../lib/supabase";
import { Notification } from "../types";
import { sessionService } from "./session";

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const session = await sessionService.getSession();
    if (!session) throw new Error("No active session");

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Notification[];
  },

  async markAsRead(notificationId: string): Promise<void> {
    const session = await sessionService.getSession();
    if (!session) throw new Error("No active session");

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)
      .eq("user_id", session.user.id);

    if (error) throw error;
  },

  async markAllAsRead(): Promise<void> {
    const session = await sessionService.getSession();
    if (!session) throw new Error("No active session");

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", session.user.id)
      .is("read", false);

    if (error) throw error;
  },

  async deleteNotification(notificationId: string): Promise<void> {
    const session = await sessionService.getSession();
    if (!session) throw new Error("No active session");

    const { error } = await supabase
      .from("notifications")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", notificationId)
      .eq("user_id", session.user.id);

    if (error) throw error;
  },

  async deleteAllNotifications(): Promise<void> {
    const session = await sessionService.getSession();
    if (!session) throw new Error("No active session");

    const { error } = await supabase
      .from("notifications")
      .update({ deleted_at: new Date().toISOString() })
      .eq("user_id", session.user.id)
      .is("deleted_at", null);

    if (error) throw error;
  },

  subscribeToNotifications(callback: (notification: Notification) => void) {
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          callback(payload.new as Notification);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
