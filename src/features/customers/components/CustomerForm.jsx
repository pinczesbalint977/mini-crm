import { useMemo, useState } from "react";
import { createCustomer } from "../api/customersApi";
import { emptyCustomerForm } from "../model/emptyCustomerForm";

export function CustomerForm({ onCreated }) {
  const [formData, setFormData] = useState(emptyCustomerForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const isSubmitDisabled = useMemo(() => {
    return (
      isSaving ||
      formData.name.trim().length < 2 ||
      formData.email.trim().length < 5
    );
  }, [formData.email, formData.name, isSaving]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await createCustomer(formData);
      setFormData(emptyCustomerForm);
      onCreated();
    } catch (submitError) {
      setError("Sikertelen mentés. Ellenőrizd a Firebase beállátesokat.");
      console.error(submitError);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="stack-md" onSubmit={handleSubmit}>
      <div className="grid-2">
        <label className="field">
          <span>Név *</span>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Példa Katalin"
            required
          />
        </label>

        <label className="field">
          <span>E-mail *</span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="pelda@example.hu"
            required
          />
        </label>
      </div>

      <label className="field">
        <span>Telefon</span>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+36 30 123 4567"
        />
      </label>

      <label className="field">
        <span>Megjegyzés</span>
        <textarea
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Rövid kontextus az ügyfélről"
        />
      </label>

      {error ? <p className="status status-error">{error}</p> : null}

      <button className="btn btn-primary" type="submit" disabled={isSubmitDisabled}>
        {isSaving ? "Mentés folyamatban..." : "ügyfél mentése"}
      </button>
    </form>
  );
}
