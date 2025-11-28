// ===============================
// API Configuration and Utilities
// ===============================

// ⛔ OLD (wrong inside Docker):  http://localhost:8080/api
// ✅ NEW (correct inside Docker network)
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('token');

// Helper function to make authenticated requests
const authFetch = async (url, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('API Request:', `${API_BASE_URL}${url}`, options);

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    console.log('API Response:', response.status, response.statusText);

    if (!response.ok) {
        const error = await response.text();
        console.error('API Error:', response.status, error);
        throw new Error(error || 'Request failed');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    }
    return await response.text();
};

// ===============================
// Authentication APIs
// ===============================
export const authAPI = {
    login: async (username, password) => {
        return await authFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    },

    register: async (username, password) => {
        return await authFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('username');
    }
};

// ===============================
// Dashboard APIs
// ===============================
export const dashboardAPI = {
    getCurrentUser: async () => {
        return await authFetch('/dashboard/me');
    },

    getAllUsers: async () => {
        return await authFetch('/dashboard/users');
    },

    getStats: async () => {
        return await authFetch('/dashboard/stats');
    }
};

// ===============================
// Account APIs
// ===============================
export const accountAPI = {
    getMyAccounts: async () => {
        return await authFetch('/accounts/my-accounts');
    },

    getAllAccounts: async () => {
        return await authFetch('/accounts/all');
    },

    createAccount: async () => {
        return await authFetch('/accounts/create', {
            method: 'POST',
            body: JSON.stringify({}),
        });
    },

    getAccount: async (accountNumber) => {
        return await authFetch(`/accounts/${accountNumber}`);
    },

    adminCreateUser: async (username, password) => {
        return await authFetch('/accounts/admin/create-user', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    },

    adminDeposit: async (userId, amount) => {
        return await authFetch('/accounts/admin/deposit', {
            method: 'POST',
            body: JSON.stringify({ userId, amount }),
        });
    },

    adminWithdraw: async (userId, amount) => {
        return await authFetch('/accounts/admin/withdraw', {
            method: 'POST',
            body: JSON.stringify({ userId, amount }),
        });
    }
};

// ===============================
// Transaction APIs
// ===============================
export const transactionAPI = {
    transfer: async (fromAccount, toAccount, amount, note = '') => {
        return await authFetch('/transactions/transfer', {
            method: 'POST',
            body: JSON.stringify({ fromAccount, toAccount, amount, note }),
        });
    },

    deposit: async (accountNumber, amount, note = 'Deposit') => {
        return await authFetch('/transactions/deposit', {
            method: 'POST',
            body: JSON.stringify({ accountNumber, amount, note }),
        });
    },

    withdraw: async (accountNumber, amount, note = 'Withdrawal') => {
        return await authFetch('/transactions/withdraw', {
            method: 'POST',
            body: JSON.stringify({ accountNumber, amount, note }),
        });
    },

    getAccountTransactions: async (accountNumber) => {
        return await authFetch(`/transactions/account/${accountNumber}`);
    },

    getMyTransactions: async () => {
        return await authFetch('/transactions/my-transactions');
    }
};

// ===============================
// Helper Functions
// ===============================
export const saveAuthData = (token, isAdmin, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', isAdmin.toString());
    localStorage.setItem('username', username);
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const isAdmin = () => {
    return localStorage.getItem('isAdmin') === 'true';
};

export default {
    authAPI,
    dashboardAPI,
    accountAPI,
    transactionAPI,
    saveAuthData,
    isAuthenticated,
    isAdmin
};
