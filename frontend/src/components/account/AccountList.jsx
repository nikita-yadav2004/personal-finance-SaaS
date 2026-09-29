import React from "react";
import AccountCard from "./AccountCard";

const AccountList = ({ allAccounts }) => {
  
  return (
    <div className="px-6 py-5 flex flex-wrap gap-7 ">
      {allAccounts &&
        allAccounts.map((account, idx) => {
          return <AccountCard key={idx} account={account} />;
        })}
    </div>
  );
};

export default AccountList;
