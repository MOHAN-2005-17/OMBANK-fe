import React, { useEffect, useState } from 'react';
import { Dashboard } from './Dashboard';
import { LoginPage } from './LoginPage';
import { ClientDashboard } from './ClientDashboard';
import { SignUpPage } from './SignUpPage';
import { saveAuthData, isAuthenticated, isAdmin as checkIsAdmin } from '../services/api';

export const Authenticate = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notif, setNotif] = useState({ message: '', style: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [client, setClient] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  // on mount, check if user is authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const storedUsername = localStorage.getItem('username');
      setIsLoggedIn(true);
      setNotif({ message: `Welcome back, ${storedUsername}!`, style: 'success' });
      setIsAdmin(checkIsAdmin());
    }
  }, []);

  // login handler receives token, isAdmin flag, and username from backend
  const login = (token, adminFlag, username) => {
    saveAuthData(token, adminFlag, username);
    setIsAdmin(adminFlag);
    setIsLoggedIn(true);
    setNotif({ message: `Welcome, ${username}!`, style: 'success' });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setNotif({ message: 'You have logged out.', style: 'success' });
  };

  if (isLoggedIn) {
    if (isAdmin) {
      return <Dashboard logoutHandler={logout} />;
    } else {
      return <ClientDashboard client={client} logout={logout} />;
    }
  } else if (isSignUp) {
    return <SignUpPage setIsSignUp={setIsSignUp} loginHandler={login} setNotif={setNotif} />;
  } else {
    return (
      <LoginPage
        loginHandler={login}
        notif={notif}
        setIsSignUp={setIsSignUp}
        setNotif={setNotif}
      />
    );
  }
};

export default Authenticate;
