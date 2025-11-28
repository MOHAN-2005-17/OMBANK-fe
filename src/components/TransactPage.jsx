import { useState, useEffect } from "react";
import { Notif } from "./Notif";
import { formatNumber, trim, capitalize } from "./Utils";
import { accountAPI, transactionAPI, isAdmin } from "../services/api";

export const TransactPage = (props) => {
  const { type, notif, setNotif } = props;
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const data = isAdmin()
        ? await accountAPI.getAllAccounts()
        : await accountAPI.getMyAccounts();
      setAccounts(data);
    } catch (error) {
      console.error("Error loading accounts:", error);
      setNotif({ message: "Failed to load accounts", style: "danger" });
    } finally {
      setLoadingAccounts(false);
    }
  };

  const displayBalance = (e) => {
    const accountNumber = e.target.value;
    const account = accounts.find((acc) => acc.accountNumber === accountNumber);
    setSelectedAccount(account);
  };

  const onAmountChange = (e) => {
    const value = trim(e.target.value) || 0;
    setAmount(value);
  };

  const processTransfer = async (e) => {
    e.preventDefault();

    if (!selectedAccount) {
      setNotif({ message: "Please select an account", style: "danger" });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) {
      setNotif({ message: "Amount must be greater than 0", style: "danger" });
      return;
    }

    setLoading(true);
    try {
      if (type === "deposit") {
        await transactionAPI.deposit(selectedAccount.accountNumber, parsedAmount);
      } else {
        await transactionAPI.withdraw(selectedAccount.accountNumber, parsedAmount);
      }

      setNotif({ message: `${capitalize(type)} successful!`, style: "success" });
      setAmount(0);

      await loadAccounts();

      const updatedAccount = accounts.find(
        (acc) => acc.accountNumber === selectedAccount.accountNumber
      );
      setSelectedAccount(updatedAccount);
    } catch (error) {
      console.error(`${type} error:`, error);
      setNotif({
        message: error.message || `${capitalize(type)} failed`,
        style: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const icon =
    type === "withdraw" ? "bx bx-down-arrow-alt" : "bx bx-up-arrow-alt";

  if (loadingAccounts) {
    return (
      <section id="main-content">
        <h1>{capitalize(type)}</h1>
        <p>Loading accounts...</p>
      </section>
    );
  }

  return (
    <section id="main-content">
      <form id="form" onSubmit={processTransfer}>
        <h1>{capitalize(type)}</h1>
        <Notif message={notif.message} style={notif.style} />
        <label>Account</label>
        <select
          name="account"
          onChange={displayBalance}
          value={selectedAccount?.accountNumber || ""}
        >
          <option value="">Select Account</option>
          {accounts.map((acc) => (
            <option key={acc.accountNumber} value={acc.accountNumber}>
              Account #{acc.accountNumber}
            </option>
          ))}
        </select>

        <label>Current balance</label>
        <input
          type="text"
          className="right"
          value={formatNumber(selectedAccount?.balance || 0)}
          disabled
        />

        <div className="transfer-icon">
          <i className={icon}></i>
        </div>
        <label>Amount to {type}</label>
        <input
          type="text"
          name="amount"
          value={formatNumber(amount)}
          onChange={onAmountChange}
          autoComplete="off"
          className="right big-input"
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Processing..." : capitalize(type)}
        </button>
      </form>
    </section>
  );
};

export default TransactPage;   // ✅ REQUIRED
