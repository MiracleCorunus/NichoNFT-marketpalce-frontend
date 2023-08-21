// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

interface NichoNFT {
    function mint(
        string memory _tokenURI,
        address _toAddress,
        uint price,
        string memory cId
    ) external returns (uint);
}

/**
 * @dev This contract is to bypass the collection id, so with this contract, one collection can have many wallet address
 */
contract AiAgent {
    // return the current token id  for frontend to use
    uint private tokenId;

    // different wallet address will connect to this agent, and this agent is responsible for the mint action
    function mint(
        NichoNFT _nichoNft,
        string memory _tokenURI,
        address _toAddress,
        uint _price,
        string memory _cId
    ) public {
        tokenId = _nichoNft.mint(_tokenURI, _toAddress, _price, _cId);
    }

    // for interaction with frontend
    function getTokenId() public view returns (uint) {
        return tokenId;
    }
}
