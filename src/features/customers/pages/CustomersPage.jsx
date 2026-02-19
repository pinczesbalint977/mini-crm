import { useMemo, useState } from "react";
import { CustomerForm } from "../components/CustomerForm";
import { CustomerList } from "../components/CustomerList";
import { useCustomers } from "../hooks/useCustomers";

export function CustomersPage() {
  const { customers, isLoading, error, markRefreshing } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredCustomers = useMemo(() => {
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
  }, [customers, normalizedSearchTerm]);

  const emptyMessage = normalizedSearchTerm
    ? "Nincs talalát a keresési feltételre."
    : "Még nincs rögzített ügyfél.";

  return (
    <section className="stack-lg">
      <section className="stack-md">
        <h2>Új ügyfél felvétele</h2>
        <CustomerForm onCreated={markRefreshing} />
      </section>

      <section className="stack-md">
        <div className="row-between">
          <h2>Ügyfelek</h2>
          <span className="badge">{filteredCustomers.length} db</span>
        </div>

        <label className="field" htmlFor="customer-search">
          <span>Keresés</span>
          <input
            id="customer-search"
            type="search"
            placeholder="Név, e-mail, telefon vagy megjegyzés"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <CustomerList
          customers={filteredCustomers}
          isLoading={isLoading}
          error={error}
          emptyMessage={emptyMessage}
        />
      </section>
    </section>
  );
}
