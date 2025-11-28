import { Account } from "./Account";
import React, { useEffect, useState } from "react";
import { accountAPI, isAdmin } from "../services/api";

export const MainContent = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = isAdmin() 
        ? await accountAPI.getAllAccounts() 
        : await accountAPI.getMyAccounts();
      setAccounts(data);
    } catch (error) {
      console.error("Error loading accounts:", error);
      setError(error.message || "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="main-content" style={{ textAlign: "center", marginTop: "40px" }}>
        <h2>Loading accounts...</h2>
      </section>
    );
  }

  if (error) {
    return (
      <section id="main-content" style={{ textAlign: "center", marginTop: "40px" }}>
        <h2>Error loading accounts</h2>
        <p>{error}</p>
      </section>
    );
  }

  if (!Array.isArray(accounts) || accounts.length === 0) {
    return (
      <section id="main-content" style={{ textAlign: "center", marginTop: "40px" }}>
        <h2>No accounts available</h2>
        <p>Please create a new account.</p>
      </section>
    );
  }

  const bankAccounts = accounts.map((account, index) => (
    <Account
      key={account.accountNumber}
      index={index}
      accountNumber={account.accountNumber}
      balance={account.balance ?? 0}
      isAdmin={isAdmin()}
    />
  ));

  return <section id="main-content">{bankAccounts}</section>;
};
