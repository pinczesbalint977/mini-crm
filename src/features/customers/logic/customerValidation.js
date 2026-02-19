export function validateField(name, value) {
  const trimmedValue = String(value || "").trim();

  if (!trimmedValue) {
    return "Kötelező mező.";
  }

  if (name === "name" && trimmedValue.length < 2) {
    return "A név legalább 2 karakter legyen.";
  }

  if (name === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!emailRegex.test(trimmedValue)) {
      return "Érvénytelen e-mail formátum.";
    }
  }

  if (name === "phone") {
    const phoneRegex = /^\+?[0-9\s()+-]{7,20}$/;

    if (!phoneRegex.test(trimmedValue)) {
      return "Érvénytelen telefonszám formátum.";
    }
  }

  return "";
}

export function validateCustomerForm(formData) {
  const fieldsToValidate = ["name", "email", "phone", "notes"];

  return fieldsToValidate.reduce((errors, fieldName) => {
    const errorMessage = validateField(fieldName, formData[fieldName] || "");

    if (errorMessage) {
      errors[fieldName] = errorMessage;
    }

    return errors;
  }, {});
}
