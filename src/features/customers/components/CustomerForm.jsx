import { useMemo, useState } from "react";
import { createCustomer } from "../api/customersApi";
import { emptyCustomerForm } from "../model/emptyCustomerForm";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const PHONE_REGEX = /^\+?[0-9\s()+-]{7,20}$/;

function validateField(name, value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Kötelező mező.";
  }

  if (name === "name" && trimmedValue.length < 2) {
    return "A név legalább 2 karakter legyen.";
  }

  if (name === "email" && !EMAIL_REGEX.test(trimmedValue)) {
    return "Érvenytelen e-mail formátum.";
  }

  if (name === "phone" && !PHONE_REGEX.test(trimmedValue)) {
    return "Érvenytelen telefonszám formátum.";
  }

  return "";
}

function validateForm(formData) {
  const fieldsToValidate = ["name", "email", "phone", "notes"];

  return fieldsToValidate.reduce((errors, fieldName) => {
    const errorMessage = validateField(fieldName, formData[fieldName] || "");

    if (errorMessage) {
      errors[fieldName] = errorMessage;
    }

    return errors;
  }, {});
}

export function CustomerForm({ onCreated }) {
  const [formData, setFormData] = useState(emptyCustomerForm);
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  const isSubmitDisabled = useMemo(() => {
    return isSaving;
  }, [isSaving]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      const nextError = validateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: nextError }));
    }
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    const nextError = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: nextError }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const nextFieldErrors = validateForm(formData);
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      setFormError("Tölts ki minden mezőt helyesen a mentéshez.");
      return;
    }

    setIsSaving(true);

    try {
      await createCustomer(formData);
      setFormData(emptyCustomerForm);
      setFieldErrors({});
      onCreated();
    } catch (submitError) {
      if (submitError.code === "duplicate-email") {
        setFieldErrors((prev) => ({
          ...prev,
          email: "Ez az e-mail már szerepel az adatbázisban.",
        }));
        setFormError("Ezzel az e-mail címmel már létezik ügyfel.");
      } else {
        setFormError("Sikertelen mentés. Ellenőrizd a Firebase beállításokat.");
      }

      console.error(submitError);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="stack-md" onSubmit={handleSubmit} noValidate>
      <div className="grid-2">
        <label className="field">
          <span>Név *</span>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Példa Katalin"
            required
            aria-invalid={Boolean(fieldErrors.name)}
          />
          {fieldErrors.name ? <small className="field-error">{fieldErrors.name}</small> : null}
        </label>

        <label className="field">
          <span>E-mail *</span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="példa@example.hu"
            required
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? <small className="field-error">{fieldErrors.email}</small> : null}
        </label>
      </div>

      <label className="field">
        <span>Telefon *</span>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="+36 30 123 4567"
          required
          aria-invalid={Boolean(fieldErrors.phone)}
        />
        {fieldErrors.phone ? <small className="field-error">{fieldErrors.phone}</small> : null}
      </label>

      <label className="field">
        <span>Megjegyzés *</span>
        <textarea
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Rövid kontextus az ügyfélről"
          required
          aria-invalid={Boolean(fieldErrors.notes)}
        />
        {fieldErrors.notes ? <small className="field-error">{fieldErrors.notes}</small> : null}
      </label>

      {formError ? <p className="status status-error">{formError}</p> : null}

      <button className="btn btn-primary" type="submit" disabled={isSubmitDisabled}>
        {isSaving ? "Mentés folyamatban..." : "Ügyfel mentése"}
      </button>
    </form>
  );
}

