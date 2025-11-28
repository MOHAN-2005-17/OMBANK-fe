import { useState } from "react";
import { Notif } from "./Notif";
import { formatNumber, trim } from './Utils';
import { accountAPI } from "../services/api";

export const CreateAccountPage = (props) => {
    const createRandomAccount = () => {
        return Math.floor(1000000000 + Math.random() * 9000000000);
    }
    
    const [notif, setNotif] = useState({message: 'Create a new client account.', style: 'left'});
    const [initialBalance, setInitialBalance] = useState(0);
    const [initialAccountNumber, setInitialAccountNumber] = useState(createRandomAccount());
    const [loading, setLoading] = useState(false);

    const handleCreateAccount = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const balance = trim(initialBalance) || 0;
            const data = await accountAPI.createAccount(initialAccountNumber.toString(), parseFloat(balance));

            console.log("✅ Account created:", data);
            setNotif({message: 'Account created successfully!', style: 'success'});

            setInitialAccountNumber(createRandomAccount());
            setInitialBalance(0);

            if (props.onAccountCreated) {
                props.onAccountCreated();
            }

        } catch (error) {
            console.error("❌ Account creation error:", error);
            const message = error.message || 'Failed to create account';
            setNotif({message, style: 'danger'});
        } finally {
            setLoading(false);
        }
    };

    const onInitialBalance = event => {
        const amount = trim(event.target.value) || 0;
        setInitialBalance(amount);
    };

    return (
        <section id="main-content">
            <form id="form" onSubmit={handleCreateAccount}>
                <h1>Create Account</h1>
                <Notif message={notif.message} style={notif.style} />
                
                <label htmlFor="account-number">Account # (Randomly Generated)</label>
                <input 
                    id="account-number"
                    name="accountNumber"
                    className="right"
                    value={initialAccountNumber}
                    type="number"
                    disabled 
                />

                <label htmlFor="balance">Initial balance</label>
                <input 
                    id="balance"
                    type="text"
                    value={formatNumber(initialBalance)}
                    onChange={onInitialBalance}
                    name="initialBalance"
                    className="right"
                />

                <input 
                    value={loading ? "Creating..." : "Create Account"} 
                    className="btn" 
                    type="submit" 
                    disabled={loading}
                />
            </form>
        </section>
    );
};

export default CreateAccountPage;   // ✅ FIXED
