import { useMemo, useState } from "react";
import { CustomerForm } from "../ui/CustomerForm";
import { CustomerList } from "../ui/CustomerList";
import { filterCustomers, getCustomerListEmptyMessage } from "../logic/customerSearch";
import { useCustomers } from "../logic/useCustomers";

export function CustomersPage() {
  const { customers, isLoading, error, markRefreshing } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = useMemo(() => {
    return filterCustomers(customers, searchTerm);
  }, [customers, searchTerm]);

  const emptyMessage = getCustomerListEmptyMessage(searchTerm);

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
