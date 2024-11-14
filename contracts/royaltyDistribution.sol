pragma solidity ^0.8.0;

contract RoyaltyDistribution {
    mapping(address => uint256) public artistBalances;
    address public owner;

    event RoyaltyPaid(address artist, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function distributeRoyalties(address[] memory artists, uint256[] memory amounts) public {
        require(msg.sender == owner, "Only owner can distribute royalties");
        require(artists.length == amounts.length, "Arrays must have the same length");

        for (uint i = 0; i < artists.length; i++) {
            artistBalances[artists[i]] += amounts[i];
            emit RoyaltyPaid(artists[i], amounts[i]);
        }
    }

    function withdraw() public {
        uint256 amount = artistBalances[msg.sender];
        require(amount > 0, "No balance to withdraw");

        artistBalances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}