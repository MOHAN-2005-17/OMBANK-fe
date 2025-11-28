import React, { useState, useEffect } from 'react';
import { accountAPI, transactionAPI } from '../services/api';
import '../modern.css';

export const UserDashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('balance');
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    note: ''
  });

  const username = localStorage.getItem('username');

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (activePage === 'history') {
      loadTransactions();
    }
  }, [activePage]);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await accountAPI.getMyAccounts();
      setAccounts(data);
    } catch (error) {
      showNotification(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await transactionAPI.getMyTransactions();
      setTransactions(data);
    } catch (error) {
      showNotification(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await transactionAPI.transfer(
        transferData.fromAccount,
        transferData.toAccount,
        parseFloat(transferData.amount),
        transferData.note || 'Transfer'
      );
      showNotification('Transfer successful!', 'success');
      setTransferData({ fromAccount: '', toAccount: '', amount: '', note: '' });
      loadAccounts();
    } catch (error) {
      showNotification(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + parseFloat(acc.balance || 0),
    0
  );

  return (
    <div className="app-container">
      <div className="dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>🏦 Om Bank</h2>
          </div>

          <div className="user-info">
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <h3>{username}</h3>
              <span className="user-badge">💳 Customer</span>
            </div>
          </div>

          <div className="nav-menu">
            <div
              className={`nav-item ${activePage === 'balance' ? 'active' : ''}`}
              onClick={() => setActivePage('balance')}
            >
              <span className="nav-icon">💰</span>
              <span>My Balance</span>
            </div>

            <div
              className={`nav-item ${activePage === 'transfer' ? 'active' : ''}`}
              onClick={() => setActivePage('transfer')}
            >
              <span className="nav-icon">↔️</span>
              <span>Transfer Funds</span>
            </div>

            <div
              className={`nav-item ${activePage === 'history' ? 'active' : ''}`}
              onClick={() => setActivePage('history')}
            >
              <span className="nav-icon">📜</span>
              <span>Transaction History</span>
            </div>
          </div>

          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {notification && (
            <div className={`alert alert-${notification.type}`}>
              {notification.type === 'success' ? '✅' : '⚠️'} {notification.message}
            </div>
          )}

          {/* Balance Page */}
          {activePage === 'balance' && (
            <div>
              <div className="content-header">
                <h1>My Account Balance</h1>
                <p>View all your accounts and balances</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Balance</div>
                  <div className="stat-value animate-count">${totalBalance.toFixed(2)}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Total Accounts</div>
                  <div className="stat-value animate-count">{accounts.length}</div>
                </div>
              </div>
              
              {/* Accounts Table */}
              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                </div>
              ) : accounts.length === 0 ? (
                <div className="card">
                  <h3>No Accounts Yet</h3>
                  <p>Contact bank admin to create an account for you.</p>
                </div>
              ) : (
                <div className="card">
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Account Number</th>
                          <th>Balance</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accounts.map((acc) => (
                          <tr key={acc.accountNumber}>
                            <td>#{acc.accountNumber}</td>
                            <td>${parseFloat(acc.balance).toFixed(2)}</td>
                            <td><span className="badge badge-success">Active</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transfer Page */}
          {activePage === 'transfer' && (
            <div>
              <div className="content-header">
                <h1>Transfer Funds</h1>
                <p>Send money to another account</p>
              </div>

              <div className="form-card">
                <form onSubmit={handleTransfer}>
                  {/* Transfer Form */}
                </form>
              </div>
            </div>
          )}

          {/* History Page */}
          {activePage === 'history' && (
            <div>
              <div className="content-header">
                <h1>Transaction History</h1>
              </div>

              {/* Transactions */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ⭐ IMPORTANT FIX ⭐
export default UserDashboard;
