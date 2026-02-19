export function filterCustomers(customers, searchTerm) {
  const normalizedSearchTerm = String(searchTerm || "").trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return customers;
  }

  return customers.filter((customer) => {
    const searchableFields = [
      customer.name,
      customer.email,
      customer.phone,
      customer.notes,
    ];

    return searchableFields.some((field) =>
      String(field || "").toLowerCase().includes(normalizedSearchTerm)
    );
  });
}

export function getCustomerListEmptyMessage(searchTerm) {
  return String(searchTerm || "").trim()
    ? "Nincs találat a keresési feltételre."
    : "Még nincs rögzített ügyfél.";
}
