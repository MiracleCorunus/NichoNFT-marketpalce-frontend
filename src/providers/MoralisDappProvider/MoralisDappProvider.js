import React, { useState } from "react";
import { useChain  } from "react-moralis";
import MoralisDappContext from "./context";

function MoralisDappProvider({ children }) {
  // const { web3, Moralis, user } = useMoralis();
  const { chainId, account } = useChain();
  const [contractABI, setContractABI] = useState('{"noContractDeployed": true}'); //Smart Contract ABI here
  const [marketAddress, setMarketAddress] = useState(); //Smart Contract Address Here

  return (
    <MoralisDappContext.Provider value={{ account, chainId, marketAddress, setMarketAddress, contractABI, setContractABI }}>
      {children}
    </MoralisDappContext.Provider>
  );
}

function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
  }
  return context;
}

export { MoralisDappProvider, useMoralisDapp };
