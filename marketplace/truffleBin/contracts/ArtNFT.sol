// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "truffle/Console.sol";

/**
 * @title ArtNFT
 * @dev Very simple ERC721 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 * Based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.1/contracts/examples/SimpleToken.sol
 */


contract ArtNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address constructorAddress;

    constructor() ERC721("ArtNFT", "AAT") {
        constructorAddress = msg.sender;
        Console.log("ArtNFT Contract constructor: " + constructorAddress);
    }

    event ArtNFTMinted(uint256 tokenId, string tokenUri);
    /// @notice create new token
    /// @param tokenUri uri of new token
    
    function createToken(string memory tokenUri) external onlyOwner returns (uint256) {
        
        _tokenIds.increment();
        uint256 newNftTokenId = _tokenIds.current();
        _mint(msg.sender, newNftTokenId);
        _setTokenURI(newNftTokenId, tokenUri);
        //grant transaction permission to marketplace
        setApprovalForAll(constructorAddress, true);

        emit ArtNFTMinted(newNftTokenId, tokenUri);
        Console.log("Token created: " + newNftTokenId);

        return newNftTokenId;
    }

    function getCurrentTokenId() public view returns(uint256){
        
        uint256 id =  _tokenIds.current();
        Console.log("Current Token Id: " + newNftTokenId);
        return id;
       
    }
    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) 
        internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)  {
        
        return super.tokenURI(tokenId);
    }
    
    function getContractDate() public view returns(uint) {
        uint time = block.timestamp;
         Console.log("Block Timesatmp: " + time);
        return time;
    }
}