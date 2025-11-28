import React from "react";
import { Account } from "./Account";
import { formatNumber } from "./Utils";

export const MainClientContent = ({ user }) => {
  // ✅ Safety check: avoid crash if user is null or undefined
  if (!user) {
    console.warn("⚠️ MainClientContent: user is null or not loaded yet");
    return (
      <section id="main-content" style={{ textAlign: "center", marginTop: "40px" }}>
        <h2>Loading your account...</h2>
        <p>Please wait a moment.</p>
      </section>
    );
  }

  // ✅ Default empty transactions if missing
  const transactions = (user.transactions || []).map((transaction, index) => {
    const className = index % 2 === 0 ? "even" : "odd";
    return (
      <div key={index} className={`transaction-item ${className}`}>
        <div>{transaction.date}</div>
        <div>{transaction.title}</div>
        <div>
          {transaction.type === "debit"
            ? formatNumber(transaction.amount * -1)
            : formatNumber(transaction.amount)}
        </div>
      </div>
    );
  });

  return (
    <section id="main-content">
      <h1 className="main">My Account</h1>
      <Account
        type={user.type || "Savings"}
        accountNumber={user.number || "N/A"}
        balance={user.balance ?? 0}
        fullname={user.fullname || "Unknown User"}
      />

      <div id="transactions">
        <h2>Transactions</h2>
        {transactions.length > 0 ? (
          <div id="transaction-div">{transactions}</div>
        ) : (
          <p>No transactions available.</p>
        )}
      </div>
    </section>
  );
};
