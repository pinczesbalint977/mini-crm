import { CustomersPage } from "../features/customers/pages/CustomersPage";

export function App() {
  return (
    <main className="app-shell">
      <section className="page card surface-elevated">
        <header className="page-header">
          <p className="eyebrow">Mini CRM</p>
          <h1>Ügyfélkezelés</h1>
          <p className="muted">
            Új ügyfél rögzítése és listázása Firestore adatbázisban.
          </p>
        </header>

        <CustomersPage />
      </section>
    </main>
  );
}
