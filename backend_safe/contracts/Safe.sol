// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Safe {
    address public owner;
    mapping(address => uint) public balanceAdd;

    struct Voter {
        string name;
        bool isRegistered;
    }

    mapping(address => Voter) public voters;
    address[] public voterList;

    constructor() {
        owner = msg.sender;
    }

    // --- FONCTIONS FINANCIÈRES ---

    function sendMoney() public payable {
        require(msg.value >= 0.01 ether, "Minimum 0.01 ETH");
        balanceAdd[msg.sender] += msg.value;
    }

    function seeBalance() public view returns (uint) {
        return balanceAdd[msg.sender];
    }

    function withdraw(uint amount) public {
        require(msg.sender == owner, "Not the owner");
        require(balanceAdd[msg.sender] >= amount, "Not enough eth");

        balanceAdd[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function viewBalance() public view returns (uint) {
        return address(this).balance;
    }

    // --- FONCTIONS D'INSCRIPTION ---

    function register(string memory _name) public {
        require(!voters[msg.sender].isRegistered, "Already registered");

        voters[msg.sender] = Voter({name: _name, isRegistered: true});

        voterList.push(msg.sender);
    }

    function getVoters() public view returns (address[] memory) {
        return voterList;
    }

    function getVoter(
        address _addr
    ) public view returns (string memory name, bool registered) {
        Voter memory voter = voters[_addr];
        return (voter.name, voter.isRegistered);
    }
}
