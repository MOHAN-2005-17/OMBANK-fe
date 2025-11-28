import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";
import { CreateAccountPage } from "./CreateAccountPage";
import TransferPage from "./TransferPage";   // FIXED DEFAULT IMPORT
import { TransactPage } from "./TransactPage";

export const Dashboard = (props) => {
    const [page, setPage] = useState('home');
    const [notif, setNotif] = useState({ message: "", style: "" });

    const changePageHandler = (pageName) => {
        setPage(pageName);

        if (pageName === "withdraw") {
            setNotif({
                message: "Select an account to withdraw money from.",
                style: "left",
            });
        }

        if (pageName === "deposit") {
            setNotif({
                message: "Select an account to deposit money.",
                style: "left",
            });
        }
    };

    return (
        <main className="dashboard">
            <Sidebar changePage={changePageHandler} page={page} logoutHandler={props.logoutHandler} />

            <div className="main-content">
                {page === "home" && <MainContent />}
                {page === "create-account" && <CreateAccountPage />}
                {page === "transfer" && <TransferPage />}
                {page === "deposit" && (
                    <TransactPage notif={notif} setNotif={setNotif} type="deposit" />
                )}
                {page === "withdraw" && (
                    <TransactPage notif={notif} setNotif={setNotif} type="withdraw" />
                )}
            </div>
        </main>
    );
};
