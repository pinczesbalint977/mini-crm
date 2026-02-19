import { CustomerForm } from "../components/CustomerForm";
import { CustomerList } from "../components/CustomerList";
import { useCustomers } from "../hooks/useCustomers";

export function CustomersPage() {
  const { customers, isLoading, error, markRefreshing } = useCustomers();

  return (
    <section className="stack-lg">
      <section className="stack-md">
        <h2>Új ügyfél felvétele</h2>
        <CustomerForm onCreated={markRefreshing} />
      </section>

      <section className="stack-md">
        <div className="row-between">
          <h2>Ügyfelek</h2>
          <span className="badge">{customers.length} db</span>
        </div>

        <CustomerList customers={customers} isLoading={isLoading} error={error} />
      </section>
    </section>
  );
}
