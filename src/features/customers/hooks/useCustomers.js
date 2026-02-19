import { useEffect, useState } from "react";
import { subscribeCustomers } from "../api/customersApi";

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeCustomers({
      onData: (items) => {
        setCustomers(items);
        setIsLoading(false);
        setError("");
      },
      onError: (fetchError) => {
        setError("Nem sikerült betölteni az ügyfeleket.");
        setIsLoading(false);
        console.error(fetchError);
      },
    });

    return unsubscribe;
  }, []);

  function markRefreshing() {
    setIsLoading(true);
  }

  return {
    customers,
    isLoading,
    error,
    markRefreshing,
  };
}
