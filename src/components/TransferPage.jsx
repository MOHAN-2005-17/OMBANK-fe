import { useState, useEffect } from "react";
import { Notif } from "./Notif";
import { formatNumber } from "./Utils";
import { accountAPI, transactionAPI, isAdmin } from "../services/api";

export const TransferPage = (props) => {
    const [accounts, setAccounts] = useState([]);
    const [receivers, setReceivers] = useState([]);
    const [sender, setSender] = useState(null);
    const [receiver, setReceiver] = useState(null);
    const [notif, setNotif] = useState({message: 'Transfer money from one account to another.', style: 'left'});
    const [transferAmount, setTransferAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingAccounts, setLoadingAccounts] = useState(true);

    // Load accounts on mount
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
            setReceivers(data);
        } catch (error) {
            console.error("Error loading accounts:", error);
            setNotif({message: 'Failed to load accounts', style: 'danger'});
        } finally {
            setLoadingAccounts(false);
        }
    };

    const senderSelected = (event) => {
        const accountNumber = event.target.value;
        const selectedSender = accounts.find(acc => acc.accountNumber === accountNumber);
        setSender(selectedSender);
        
        // Update receivers to exclude sender
        const filteredReceivers = accounts.filter(acc => acc.accountNumber !== accountNumber);
        setReceivers(filteredReceivers);
        setReceiver(null);
    }

    const receiverSelected = event => {
        const accountNumber = event.target.value;
        const selectedReceiver = accounts.find(acc => acc.accountNumber === accountNumber);
        setReceiver(selectedReceiver);
    }

    const transferFund = async (event) => {
        event.preventDefault();
        
        if (!sender || !receiver) {
            setNotif({message: 'Please select both sender and receiver accounts', style: 'danger'});
            return;
        }

        const amount = parseFloat(transferAmount);
        if (amount <= 0) {
            setNotif({message: 'Amount must be greater than 0', style: 'danger'});
            return;
        }

        setLoading(true);
        try {
            await transactionAPI.transfer(
                sender.accountNumber,
                receiver.accountNumber,
                amount,
                `Transfer to ${receiver.accountNumber}`
            );

            setNotif({message: 'Transfer successful!', style: 'success'});
            setTransferAmount(0);
            
            // Reload accounts to get updated balances
            await loadAccounts();
            
            // Reset sender/receiver with updated data
            const updatedSender = accounts.find(acc => acc.accountNumber === sender.accountNumber);
            const updatedReceiver = accounts.find(acc => acc.accountNumber === receiver.accountNumber);
            setSender(updatedSender);
            setReceiver(updatedReceiver);
        } catch (error) {
            console.error("Transfer error:", error);
            setNotif({message: error.message || 'Transfer failed', style: 'danger'});
        } finally {
            setLoading(false);
        }
    }

    const onTransfer = (e) => {
        const transfer = parseFloat(e.target.value.replace(/,/g, '')) || 0;
        setTransferAmount(transfer);
    }

    if (loadingAccounts) {
        return (
            <section id="main-content">
                <h1>Fund Transfer</h1>
                <p>Loading accounts...</p>
            </section>
        );
    }

    return (
        <section id="main-content">
            <form id="form" onSubmit={transferFund}>
                <h1>Fund Transfer</h1>
                
                <Notif message={notif.message} style={notif.style} />
                <h2>Sender</h2>
                <label>From (Sender)</label>
                <select onChange={senderSelected} name="sender" value={sender?.accountNumber || ''}>
                    <option value="">Select Sender</option>
                    {accounts.map(acc => (
                        <option key={acc.accountNumber} value={acc.accountNumber}>
                            Account #{acc.accountNumber}
                        </option>
                    ))}
                </select>

                <label>Current balance</label>
                <input 
                    type="text" 
                    className="right" 
                    value={formatNumber(sender?.balance || 0)} 
                    disabled 
                />

                <label>Amount to Transfer</label>
                <input 
                    type="text" 
                    name="amount" 
                    value={formatNumber(transferAmount)} 
                    onChange={onTransfer} 
                    autoComplete="off" 
                    className="right big-input" 
                />

                <div className="transfer-icon"><i className='bx bx-down-arrow-alt'></i></div>
                <h2>Receiver</h2>
                <label>To (Receiver)</label>
                <select 
                    value={receiver?.accountNumber || ''} 
                    onChange={receiverSelected} 
                    name="receiver"
                >
                    <option value="">Select Receiver</option>
                    {receivers.map(acc => (
                        <option key={acc.accountNumber} value={acc.accountNumber}>
                            Account #{acc.accountNumber}
                        </option>
                    ))}
                </select>
                
                <label>Current balance</label>
                <input 
                    type="text" 
                    className="right" 
                    value={formatNumber(receiver?.balance || 0)} 
                    disabled 
                />
                
                <input 
                    type="submit" 
                    className="btn" 
                    value={loading ? "Processing..." : "Transfer Fund"} 
                    disabled={loading}
                />
            </form>
        </section>
    )
}