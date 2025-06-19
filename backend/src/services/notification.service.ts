import { firestore } from "./firestore";

export interface Notification {
  id: string;
  userId: string;
  type: "new_file" | "compliance_issue" | "expiry_warning";
  title: string;
  message: string;
  documentId?: string;
  read: boolean;
  createdAt: string;
}

export class NotificationService {
  async createNotification(
    notification: any,
  ) {
    const notificationData = {
      ...notification,
      createdAt: new Date().toISOString(),
      read: false,
    };

    const docRef = await firestore
      .collection("notifications")
      .add(notificationData);
    return { id: docRef.id, ...notificationData };
  }

  async notifyNewFile(fileName: string, documentId: string) {
    // Get all users who should be notified
    const usersSnapshot = await firestore.collection("users").get();

    const notifications = usersSnapshot.docs.map((doc: any) => ({
      userId: doc.id,
      type: "new_file" as const,
      title: "New File Detected",
      message: `A new file "${fileName}" was detected in Google Drive and needs review.`,
      documentId,
      read: false,
    }));

    // Create notifications for all users
    await Promise.all(
      notifications.map((notification) =>
        this.createNotification(notification),
      ),
    );
  }

  async notifyComplianceIssue(documentId: string, issue: string) {
    const docSnapshot = await firestore
      .collection("documents")
      .doc(documentId)
      .get();
    const doc = docSnapshot.data();

    if (!doc) return;

    const usersSnapshot = await firestore.collection("users").get();

    const notifications = usersSnapshot.docs.map((doc: any) => ({
      userId: doc.id,
      type: "compliance_issue" as const,
      title: "Compliance Issue Detected",
      message: `Document "${(doc.data() as any).fileName}" has a compliance issue: ${issue}`,
      documentId,
      read: false,
    }));

    await Promise.all(
      notifications.map((notification: any) =>
        this.createNotification(notification),
      ),
    );
  }

  async notifyExpiryWarning(documentId: string, daysUntilExpiry: number) {
    const docSnapshot = await firestore
      .collection("documents")
      .doc(documentId)
      .get();
    const doc = docSnapshot.data();

    if (!doc) return;

    const usersSnapshot = await firestore.collection("users").get();

    const notifications = usersSnapshot.docs.map((doc: any) => ({
      userId: doc.id,
      type: "expiry_warning" as const,
      title: "Document Expiring Soon",
      message: `Document "${(doc.data() as any).fileName}" will expire in ${daysUntilExpiry} days.`,
      documentId,
      read: false,
    }));

    await Promise.all(
      notifications.map((notification: any) =>
        this.createNotification(notification),
      ),
    );
  }

  async getUserNotifications(userId: string) {
    const snapshot = await firestore
      .collection("notifications")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async markAsRead(notificationId: string) {
    await firestore
      .collection("notifications")
      .doc(notificationId)
      .update({ read: true });
  }

  async markAllAsRead(userId: string) {
    const snapshot = await firestore
      .collection("notifications")
      .where("userId", "==", userId)
      .where("read", "==", false)
      .get();

    const batch = firestore.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
  }
}
