function formatCreatedAt(createdAt) {
  if (!createdAt?.toDate) {
    return "most";
  }

  return new Intl.DateTimeFormat("hu-HU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(createdAt.toDate());
}

export function CustomerList({
  customers,
  isLoading,
  error,
  emptyMessage = "Meg nincs rogzitett ugyfel.",
}) {
  if (isLoading) {
    return <p className="status">Betöltés...</p>;
  }

  if (error) {
    return <p className="status status-error">{error}</p>;
  }

  if (customers.length === 0) {
    return <p className="status">{emptyMessage}</p>;
  }

  return (
    <ul className="customer-list" aria-live="polite">
      {customers.map((customer) => (
        <li key={customer.id} className="card customer-item">
          <div className="row-between">
            <h3>{customer.name}</h3>
            <small className="muted">{formatCreatedAt(customer.createdAt)}</small>
          </div>

          <p>{customer.email}</p>
          <p>{customer.phone || "Nincs telefon"}</p>
          {customer.notes ? <p className="muted">{customer.notes}</p> : null}
        </li>
      ))}
    </ul>
  );
}
