import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase/firebase";

const COLLECTION_NAME = "customers";
const customersCollection = collection(db, COLLECTION_NAME);

export async function createCustomer(payload) {
  const normalizedPayload = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    notes: payload.notes.trim(),
    createdAt: serverTimestamp(),
  };

  return addDoc(customersCollection, normalizedPayload);
}

export function subscribeCustomers({ onData, onError }) {
  const customersQuery = query(customersCollection, orderBy("createdAt", "desc"));

  return onSnapshot(
    customersQuery,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      onData(items);
    },
    onError
  );
}
