import Metamask from "./WalletIcons/metamaskWallet.png";
import Coin98 from "./WalletIcons/Coin98.png";
// import Web3Auth from "./WalletIcons/web3auth.svg";
// import Web3Auth from "./WalletIcons/web3auth.png";
import Web3Auth from "./WalletIcons/socialMedia.png";
import WalletConnect from "./WalletIcons/wallet-connect.svg";
// import MathWallet from "./WalletIcons/MathWallet.png";
import TokenPocket from "./WalletIcons/TokenPocket.png";
// import SafePal from "./WalletIcons/SafePal.png";
import TrustWallet from "./WalletIcons/TrustWallet.png";

export const connectors = [
  {
    title: "Social media",
    icon: Web3Auth,
    connectorId: "web3auth",
    priority: 1000,
  },
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: "injected",
    priority: 1,
  },
  {
    title: "Trust Wallet",
    icon: TrustWallet,
    connectorId: "injected",
    priority: 3,
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    connectorId: "walletconnect",
    priority: 2,
  },
  {
    title: "Coin98",
    icon: Coin98,
    connectorId: "injected",
    priority: 999,
  },
  {
    title: "TokenPocket",
    icon: TokenPocket,
    connectorId: "injected",
    priority: 999,
  },
  // {
  //   title: "SafePal",
  //   icon: SafePal,
  //   connectorId: "injected",
  //   priority: 999,
  // },
  // {
  //   title: "MathWallet",
  //   icon: MathWallet,
  //   connectorId: "injected",
  //   priority: 999,
  // },
];
