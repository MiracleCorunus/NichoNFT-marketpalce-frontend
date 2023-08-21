import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";
import { contractAddress } from "contracts/constants";

export const useNFTBalance = (options) => {
  const { account } = useMoralisWeb3Api();
  const { chainId } = useMoralisDapp();
  const { resolveLink } = useIPFS();
  const [NFTBalance, setNFTBalance] = useState([]);
  const {
    fetch: getNFTBalance,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(account.getNFTs, { chain: chainId, ...options });
  const [fetchSuccess, setFetchSuccess] = useState(true);

  useEffect(() => {
    const getYourNFTBalance = async () => {
      if (data?.result) {
        const NFTs = data.result;
        setFetchSuccess(true);
        // console.log("NFT counts:", NFTs)
        const newResults = [];
        for (let NFT of NFTs) {
          try {
            if (NFT?.token_address.toLocaleLowerCase()===contractAddress.toLocaleLowerCase()) continue;
          } catch (e) {
            console.log(e);
          }

          if (NFT?.metadata) {
            NFT.metadata = JSON.parse(NFT.metadata);
            NFT.image = resolveLink(NFT.metadata?.image);
          } else if (NFT?.token_uri) {
            try {
              if (NFT.token_uri.includes("ipfs")) {
                await fetch(NFT.token_uri)
                  .then((response) => response.json())
                  .then((data) => {
                    NFT.image = resolveLink(data.image);
                    NFT.metadata = data;
                  });
              } else {
                continue;  
              }
            } catch (error) {
              continue;
              // setFetchSuccess(false);
              // continue;
  /*          !!Temporary work around to avoid CORS issues when retrieving NFT images!!
              Create a proxy server as per https://dev.to/terieyenike/how-to-create-a-proxy-server-on-heroku-5b5c
              Replace <your url here> with your proxy server_url below
              Remove comments :)

                try {
                  await fetch(`<your url here>/${NFT.token_uri}`)
                  .then(response => response.json())
                  .then(data => {
                    NFT.image = resolveLink(data.image);
                  });
                } catch (error) {
                  setFetchSuccess(false);
                }

  */
            }
          }

          newResults.push(NFT);
        }

        setNFTBalance(newResults);
      }
    }
    getYourNFTBalance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { getNFTBalance, NFTBalance, fetchSuccess, error, isLoading };
};
