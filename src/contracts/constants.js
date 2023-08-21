import ABI from "./NichoNFT.json";
import AuctionABI from "./NichoNFTAuction.json";
import MarketplaceABI from "./NichoNFTMarketplace.json";
import IERC721ABI from "./IERC721.json";
import NichoRewardABI from "./NichoNFTRewards.json";
import CollectionFactoryAbi from "./CollectionFactory.json";
import CreatorNFTABI from "./CreatorNFT.json";
import NichoFarmABI from "./NichoFarm.json";
import NichoTokenABI from "./NichoToken.json";
import AiAgentABI from "./AiAgent.json";

// CreatorNFT ABI
export const creatorNFTABI = CreatorNFTABI;

// NichoNFT main contract.
export const contractAddress =
  process.env.REACT_APP_NICHONFT_CONTRACT?.toLocaleLowerCase();
export const nichonftABI = ABI;
// export const chainId = process.env.REACT_APP_CHAIN_ID;

// NichoNFT Marketplace contract
export const marketplaceAddress =
  process.env.REACT_APP_MARKETPLACE_CONTRACT?.toLocaleLowerCase();
export const marketplaceABI = MarketplaceABI;

// NichoNFT Auction contract
export const auctionAddress =
  process.env.REACT_APP_AUCTION_CONTRACT?.toLocaleLowerCase();
export const auctionABI = AuctionABI;

// Standard NFT Interface ABI
export const ERC721ABI = IERC721ABI;

// NichoNFT OwnedCollection Factory address
export const collectionFactoryAddress =
  process.env.REACT_APP_COLLECTIONFACTORY_CONTRACT?.toLocaleLowerCase();
export const collectionFactoryAbi = CollectionFactoryAbi;

export const rewardAddress =
  process.env.REACT_APP_REWARD_CONTRACT?.toLocaleLowerCase();
export const nichoRewardABI = NichoRewardABI;

export const nichoTokenAddress =
  process.env.REACT_APP_NICHO_TOKEN_CONTRACT?.toLocaleLowerCase();
export const nichoTokenABI = NichoTokenABI;

export const nichoFarmAddress =
  process.env.REACT_APP_NICHO_FARM_CONTRACT?.toLocaleLowerCase();
export const nichoFarmABI = NichoFarmABI;

export const aiAgentAddress = process.env.REACT_APP_AI_AGENT_CONTRACT_ADDRESS;
export const aiAgentABI = AiAgentABI;

export const API_KEY = process.env.REACT_APP_API_KEY;
