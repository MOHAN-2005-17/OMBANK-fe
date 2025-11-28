import React, { useState, useEffect } from 'react';
import { dashboardAPI, accountAPI } from '../services/api';
import '../modern.css';

export const AdminDashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('users');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [createUserData, setCreateUserData] = useState({ username: '', password: '' });
  const [depositData, setDepositData] = useState({ userId: '', amount: '' });

  const username = localStorage.getItem('username');

  useEffect(() => {
    if (activePage === 'users') {
      loadUsers();
    }
  }, [activePage]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await dashboardAPI.getAllUsers();
      setAccounts(data);
    } catch (error) {
      showNotification(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await accountAPI.adminCreateUser(
        createUserData.username,
        createUserData.password
      );
      showNotification(`User created! Account #${response.accountNumber}`, 'success');
      setCreateUserData({ username: '', password: '' });

      if (activePage === 'users') loadUsers();
    } catch (error) {
      showNotification(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await accountAPI.adminDeposit(
        parseInt(depositData.userId),
        parseFloat(depositData.amount)
      );
      showNotification(
        `Deposited $${response.depositedAmount} to ${response.username}. New balance: $${response.newBalance}`,
        'success'
      );
      setDepositData({ userId: '', amount: '' });

      if (activePage === 'users') loadUsers();
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

  return (
    <div className="app-container">
      <div className="dashboard">
        <div className="sidebar">

          <div className="sidebar-header">
            <h2>🏦 Om Bank</h2>
          </div>

          <div className="user-info">
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <h3>{username}</h3>
              <span className="user-badge">👑 Admin</span>
            </div>
          </div>

          <div className="nav-menu">
            <div
              className={`nav-item ${activePage === 'users' ? 'active' : ''}`}
              onClick={() => setActivePage('users')}
            >
              <span className="nav-icon">👥</span>
              <span>All Users</span>
            </div>

            <div
              className={`nav-item ${activePage === 'create' ? 'active' : ''}`}
              onClick={() => setActivePage('create')}
            >
              <span className="nav-icon">➕</span>
              <span>Create Account</span>
            </div>

            <div
              className={`nav-item ${activePage === 'deposit' ? 'active' : ''}`}
              onClick={() => setActivePage('deposit')}
            >
              <span className="nav-icon">💰</span>
              <span>Deposit Funds</span>
            </div>
          </div>

          <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
        </div>

        <div className="main-content">

          {notification && (
            <div className={`alert alert-${notification.type}`}>
              {notification.type === 'success' ? '✅' : '⚠️'} {notification.message}
            </div>
          )}

          {activePage === 'users' && (
            <div>
              <div className="content-header">
                <h1>All User Accounts</h1>
                <p>Account Number, Balance, Owner ID</p>
              </div>

              {loading ? (
                <div className="loading"><div className="spinner"></div></div>
              ) : accounts.length === 0 ? (
                <div className="card"><p>No accounts found. Create user accounts to get started.</p></div>
              ) : (
                <div className="card">
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Account Number</th>
                          <th>Balance</th>
                          <th>Owner ID</th>
                        </tr>
                      </thead>

                      <tbody>
                        {accounts.map((account, index) => (
                          <tr key={index}>
                            <td><strong>{account.accountNumber}</strong></td>
                            <td>
                              <span className="stat-value" style={{ fontSize: '18px', color: 'var(--success)' }}>
                                ${parseFloat(account.balance).toFixed(2)}
                              </span>
                            </td>
                            <td><span className="badge badge-primary">ID: {account.ownerId}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activePage === 'create' && (
            <div>
              <div className="content-header">
                <h1>Create New User Account</h1>
                <p>Create a new user with account (same as signup)</p>
              </div>

              <div className="form-card">
                <form onSubmit={handleCreateUser}>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-input"
                      value={createUserData.username}
                      onChange={(e) => setCreateUserData({ ...createUserData, username: e.target.value })}
                      placeholder="Enter username"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={createUserData.password}
                      onChange={(e) => setCreateUserData({ ...createUserData, password: e.target.value })}
                      placeholder="Enter password"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : '➕ Create User & Account'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activePage === 'deposit' && (
            <div>
              <div className="content-header">
                <h1>Deposit Funds</h1>
                <p>Add money to any user account by User ID</p>
              </div>

              <div className="form-card">
                <form onSubmit={handleDeposit}>
                  <div className="form-group">
                    <label>User ID</label>
                    <input
                      type="number"
                      className="form-input"
                      value={depositData.userId}
                      onChange={(e) => setDepositData({ ...depositData, userId: e.target.value })}
                      placeholder="Enter user ID"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      className="form-input"
                      value={depositData.amount}
                      onChange={(e) => setDepositData({ ...depositData, amount: e.target.value })}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Processing...' : '💰 Deposit Funds'}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;   // ✅ FIXED
