//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//prevents re-entrancy attacks
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds; //total number of items ever created
    Counters.Counter private _itemsSold; //total number of items sold

    address payable public owner; //owner of the smart contract
    address public contractAddress; //owner of the smart contract
    //people have to pay to puy their NFT on this marketplace
    uint256 listingPrice = 0.00253 ether;

    constructor() {
        owner = payable(msg.sender);
        contractAddress = address(this);
        console.log("NFTMarket constructor: contract address is: ");
        console.log(contractAddress);
        console.log("NFTMarket constructor: Owner address is: ");
        console.log(owner);
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller; //person selling the nft
        address payable owner; //owner of the nft
        uint256 price;
        bool sold;
    }

    //a way to access values of the MarketItem struct above by passing an integer ID
    mapping(uint256 => MarketItem) private marketItems;

    //log message (when Item is sold)
    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    event MarketItemSold(address nftContract, uint256 itemId, uint256 price);

    /// @notice function to get listingprice
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function setListingPrice(uint256 _price) public returns (uint256) {
        if (msg.sender == address(this)) {
            listingPrice = _price;
        }
        return listingPrice;
    }

    /// @notice function to create market item
    function addMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be above zero");
        require(
            price == listingPrice,
            "Price must be equal to listing price"
        );

        _itemIds.increment(); //add 1 to the total number of items ever created
        uint256 itemId = _itemIds.current();

        marketItems[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender), //address of the seller putting the nft up for sale
            payable(address(0)), //no owner yet (set owner to empty address)
            price,
            false
        );

        MarketItem memory item = marketItems[itemId];

        console.log("NFTMarket: MarketItem built ...");

        //transfer ownership of the nft to the contract itself
        //IERC721(address(this)).transferFrom(msg.sender, address(this), tokenId);

        //log this transaction
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
        console.log(
            "NFTMarket: Market Item created"
        );
    }
    function getContractAddress() public view returns(address) {
        return address(this);
    }

    /// @notice function to create a sale
    function makeMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = marketItems[itemId].price;
        uint256 tokenId = marketItems[itemId].tokenId;

        require(
            msg.value == price,
            "Please submit the asking price in order to complete purchase"
        );

        //pay the seller the amount
        marketItems[itemId].seller.transfer(msg.value);

        //transfer ownership of the nft from the contract itself to the buyer
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        marketItems[itemId].owner = payable(msg.sender); //mark buyer as new owner
        marketItems[itemId].sold = true; //mark that it has been sold
        _itemsSold.increment(); //increment the total number of Items sold by 1
        payable(owner).transfer(listingPrice); //pay owner of contract the listing price

        emit MarketItemSold(nftContract, itemId, price);
        console.log("NFTMarket: Market Item sold");
        
    }

    /// @notice total number of items unsold on our platform
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current(); //total number of items ever created
        //total number of items that are unsold = total items ever created - total items ever sold
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        //loop through all items ever created
        for (uint256 i = 0; i < itemCount; i++) {
            //get only unsold item
            //check if the item has not been sold
            //by checking if the owner field is empty
            if (marketItems[i + 1].owner == address(0)) {
                //yes, this item has never been sold
                uint256 currentId = marketItems[i + 1].itemId;
                MarketItem storage currentItem = marketItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items; //return array of all unsold items
    }

    /// @notice fetch list of NFTS owned/bought by this user
    function fetchUserNFTs() public view returns (MarketItem[] memory) {
        //get total number of items ever created
        uint256 totalItemCount = _itemIds.current();

        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            //get only the items that this user has bought/is the owner
            if (marketItems[i + 1].owner == msg.sender) {
                itemCount += 1; //total length
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (marketItems[i + 1].owner == msg.sender) {
                uint256 currentId = marketItems[i + 1].itemId;
                MarketItem storage currentItem = marketItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /// @notice fetch list of NFTS owned/bought by this user
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        //get total number of items ever created
        uint256 totalItemCount = _itemIds.current();

        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            //get only the items that this user has bought/is the owner
            if (marketItems[i + 1].seller == msg.sender) {
                itemCount += 1; //total length
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (marketItems[i + 1].seller == msg.sender) {
                uint256 currentId = marketItems[i + 1].itemId;
                MarketItem storage currentItem = marketItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function getContractDate() public view returns (uint256) {
        uint256 time = block.timestamp;
        return time;
    }
    //function approve(address to, uint256 tokenId) public virtual override {
    // function approveMarketItem(address to, uint256 tokenId) public returns (bool) {

    //     _approve(to, tokenId);
    //     return true;
    // }
}
