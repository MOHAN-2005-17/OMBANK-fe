import React from "react";
import { formatNumber } from "./Utils";

export const Account = (props) => {
  const { accountNumber, balance, isAdmin } = props;
  
  return (
    <div className="account">
      <div className="details">
        <AccountNumber accountNumber={accountNumber} />
      </div>
      <AccountBalance balance={formatNumber(balance)} />
    </div>
  );
};

export const AccountNumber = (props) => {
  return <div>Account #{props.accountNumber}</div>;
};

export const AccountBalance = (props) => {
  const balance = props.balance;
  return <div className="balance">{balance}</div>;
};

export default Account;   // <-- ADD THIS
