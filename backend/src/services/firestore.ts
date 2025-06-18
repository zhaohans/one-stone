import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore();

export const saveDocumentMetadata = async (docId: string, metadata: any) => {
  await firestore.collection('documents').doc(docId).set(metadata, { merge: true });
};

export const getDocumentMetadata = async (docId: string) => {
  const doc = await firestore.collection('documents').doc(docId).get();
  return doc.exists ? doc.data() : null;
};

export const getAllDocumentsMetadata = async (filter?: { q?: string; tag?: string; status?: string; fromDate?: string; toDate?: string; category?: string }) => {
  const snapshot = await firestore.collection('documents').get();
  let docs = snapshot.docs.map(doc => {
    const data: any = { id: doc.id, ...doc.data() };
    // Compliance logic
    let complianceStatus = 'ok';
    const requiredFields = ['tags', 'expiryDate', 'status'];
    if (!data.aiTags?.tags || data.aiTags.tags.length === 0) complianceStatus = 'missing_tags';
    else if (!data.expiryDate) complianceStatus = 'missing_expiry';
    else if (!data.status) complianceStatus = 'missing_status';
    else if (data.expiryDate && new Date(data.expiryDate).getTime() < Date.now() + 7 * 24 * 60 * 60 * 1000) complianceStatus = 'expiring_soon';
    data.complianceStatus = complianceStatus;
    return data;
  });
  if (filter) {
    if (filter.q) {
      const qLower = filter.q.toLowerCase();
      docs = docs.filter(doc =>
        (doc.fileName && doc.fileName.toLowerCase().includes(qLower)) ||
        (doc.aiTags?.tags && doc.aiTags.tags.some((t: string) => t.toLowerCase().includes(qLower)))
      );
    }
    if (filter.tag) {
      docs = docs.filter(doc =>
        doc.aiTags?.tags && doc.aiTags.tags.includes(filter.tag as string)
      );
    }
    if (filter.status) {
      docs = docs.filter(doc => doc.status === filter.status);
    }
    if (filter.fromDate) {
      const from = new Date(filter.fromDate).getTime();
      docs = docs.filter(doc => doc.uploadedAt && new Date(doc.uploadedAt).getTime() >= from);
    }
    if (filter.toDate) {
      const to = new Date(filter.toDate).getTime();
      docs = docs.filter(doc => doc.uploadedAt && new Date(doc.uploadedAt).getTime() <= to);
    }
    if (filter.category) {
      docs = docs.filter(doc => doc.category === filter.category);
    }
  }
  return docs;
}; 