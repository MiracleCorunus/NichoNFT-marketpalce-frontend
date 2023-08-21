/**
 * ChainData Helper
 */

 import BNBIcon from "assets/images/new/header/bnb.png";
 import ETHIcon from "assets/images/new/header/eth.png";
 import PolygonIcon from "assets/images/new/header/polygon.png";
 import AvalancheIcon from "assets/images/new/header/avalanche.png";
 import FantomIcon from "assets/images/new/header/fantom.png";
 import SuiIcon from "assets/images/new/header/sui.png";
 import AptosIcon from "assets/images/new/header/aptos.png";

/**
 * @dev Get chain data based on chain id.
 * @param { chain id } chainId 
 * @returns chain data or null if not exist
 */
export const getChainData = (chainId) => {
    const dataSize = chainData.length;
    for(let i=0; i < dataSize; i++) {
        const chain = chainData[i];
        // if chain id is same, return chain data.
        if(compareChainID(chain.chainId, chainId) === true) return chain;
    }
    return null;
}

// return true if chain id is same
const compareChainID = (chainID_a, chainID_b) => {
    const chainA = parseInt(chainID_a.toString(), 16);
    const chainB = parseInt(chainID_b.toString(), 16);

    return chainA === chainB;
}

// For now, chainData is just testnet
export const chainData = [
    {
        value: "BSC T",
        label: "Binance Smart Chain Testnet",
        logoUrl: BNBIcon,
        disabled: false,
        chainId: "0x61", // 97
        visible: true,
        site_url: "https://testnet.nichonft.com"
    },
    {
        value: "BSC",
        label: "Binance Smart Chain",
        logoUrl: BNBIcon,
        disabled: false,
        chainId: "0x38", // 56
        visible: true,
        site_url: "https://nichonft.com"
    },
    {
        value: "Polygon",
        label: "Polygon",
        logoUrl: PolygonIcon,
        disabled: true,
        chainId: "0x89", // 137
        visible: true,
        site_url: "https://nichonft.com"
    },
    { 
        value: "Ethereum", 
        label: "Ethereum", 
        logoUrl: ETHIcon, 
        disabled: true, 
        chainId: "0x1",
        visible: true,
        site_url: "https://nichonft.com"
    },
    { 
        value: "Sui", 
        label: "Sui", 
        logoUrl: SuiIcon, 
        disabled: true,
        chainId: "0xBBB",
        visible: false,
        site_url: "https://nichonft.com"
    },
    { 
        value: "Aptos", 
        label: "Aptos", 
        logoUrl: AptosIcon, 
        disabled: true,
        chainId: "0xAAA", // 97
        visible: false,
        site_url: "https://nichonft.com"
    },
    {
        value: "Fantom",
        label: "Fantom mainnet",
        logoUrl: FantomIcon,
        disabled: true,
        chainId: "0xFA", // 250
        visible: true,
        site_url: "https://nichonft.com"
    },
    {
        value: "Avalanche",
        label: "Avalanche",
        logoUrl: AvalancheIcon,
        disabled: true,
        chainId: "0xA86A", // 43114
        visible: true,
        site_url: "https://nichonft.com"
    },
];
