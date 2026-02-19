import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../lib/firebase/firebase";

const COLLECTION_NAME = "customers";
const customersCollection = collection(db, COLLECTION_NAME);

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeCustomerPayload(payload) {
  const name = payload.name.trim();
  const email = payload.email.trim();
  const phone = payload.phone.trim();
  const notes = payload.notes.trim();

  return {
    name,
    email,
    emailLower: normalizeEmail(email),
    phone,
    notes,
    createdAt: serverTimestamp(),
  };
}

async function assertEmailIsUnique(emailLower) {
  const customersSnapshot = await getDocs(customersCollection);

  const hasDuplicate = customersSnapshot.docs.some((doc) => {
    const customer = doc.data();
    const customerEmail = customer.emailLower || normalizeEmail(customer.email);

    return customerEmail === emailLower;
  });

  if (hasDuplicate) {
    const duplicateError = new Error("Ez az e-mail cim mar szerepel az adatbazisban.");
    duplicateError.code = "duplicate-email";
    throw duplicateError;
  }
}

export async function createCustomer(payload) {
  const normalizedPayload = normalizeCustomerPayload(payload);

  await assertEmailIsUnique(normalizedPayload.emailLower);

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
