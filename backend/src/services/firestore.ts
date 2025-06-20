// import { Firestore } from "@google-cloud/firestore";
// const firestore = new Firestore();
// export { firestore };

export const saveDocumentMetadata = async (docId: string, metadata: any) => {
  try {
    // await firestore
    //   .collection("documents")
    //   .doc(docId)
    //   .set(metadata, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error("Error saving document metadata:", error);
    return { success: false, error };
  }
};

export const getAllDocumentsMetadata = async (filters: any = {}) => {
  try {
    // let query: any = firestore.collection("documents");

    // Apply filters
    // if (filters.q) {
    //   query = query
    //     .where("fileName", ">=", filters.q)
    //     .where("fileName", "<=", filters.q + "\uf8ff");
    // }
    // if (filters.tag) {
    //   query = query.where("aiTags.tags", "array-contains", filters.tag);
    // }
    // if (filters.status) {
    //   query = query.where("status", "==", filters.status);
    // }
    // if (filters.fromDate) {
    //   query = query.where("uploadedAt", ">=", filters.fromDate);
    // }
    // if (filters.toDate) {
    //   query = query.where("uploadedAt", "<=", filters.toDate);
    // }

    // const snapshot = await query.get();
    return [];
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    return [];
  }
};

export const getDocumentMetadata = async (docId: string) => {
  try {
    // const doc = await firestore.collection("documents").doc(docId).get();
    // if (doc.exists) {
    //   return { id: doc.id, ...doc.data() };
    // }
    return null;
  } catch (error: any) {
    console.error("Error fetching document metadata:", error);
    return null;
  }
};
