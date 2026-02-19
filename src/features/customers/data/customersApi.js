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

function createAppError(message, code, cause) {
  const appError = new Error(message);
  appError.code = code;

  if (cause) {
    appError.cause = cause;
  }

  return appError;
}

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
  try {
    const customersSnapshot = await getDocs(customersCollection);

    const hasDuplicate = customersSnapshot.docs.some((doc) => {
      const customer = doc.data();
      const customerEmail = customer.emailLower || normalizeEmail(customer.email);

      return customerEmail === emailLower;
    });

    if (hasDuplicate) {
      throw createAppError("Ez az e-mail cím már szerepel az adatbázisban.", "duplicate-email");
    }
  } catch (error) {
    if (error?.code === "duplicate-email") {
      throw error;
    }

    console.error("Email egyediség ellenőrzés hiba:", error);
    throw createAppError(
      "Nem sikerült ellenőrizni az e-mail egyediségét.",
      "email-check-failed",
      error
    );
  }
}

export async function createCustomer(payload) {
  try {
    const normalizedPayload = normalizeCustomerPayload(payload);

    await assertEmailIsUnique(normalizedPayload.emailLower);

    return await addDoc(customersCollection, normalizedPayload);
  } catch (error) {
    if (error?.code === "duplicate-email") {
      throw error;
    }

    console.error("Ügyfél mentési hiba:", error);
    throw createAppError("Sikertelen mentés az adatbázisba.", "create-customer-failed", error);
  }
}

export function subscribeCustomers({ onData, onError }) {
  try {
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
      (error) => {
        console.error("Ügyfelek feliratkozási hiba:", error);
        onError(createAppError("Nem sikerült betölteni az ügyfeleket.", "subscribe-failed", error));
      }
    );
  } catch (error) {
    console.error("Ügyfelek lekérdezés inicializálási hiba:", error);
    onError(createAppError("Nem sikerült betölteni az ügyfeleket.", "subscribe-init-failed", error));
    return () => {};
  }
}
