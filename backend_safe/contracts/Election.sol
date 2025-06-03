// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Election {
    address public owner;
    uint public constant MAX_CANDIDATES = 5;

    struct Candidate {
        string name;
        address addr;
        uint voteCount;
    }

    struct Voter {
        bool hasVoted;
        address votedCandidate;
    }

    mapping(address => Candidate) public candidates;
    address[] public candidateList;

    mapping(address => Voter) public voters;
    address[] public voterList;

    constructor() {
        owner = msg.sender;
    }

    // Inscription manuelle
    function registerAsCandidate(string memory _name) public {
        require(bytes(_name).length > 0, "Name required");
        require(candidates[msg.sender].addr == address(0), "Already a candidate");
        require(candidateList.length < MAX_CANDIDATES, "Max candidates reached");

        candidates[msg.sender] = Candidate({
            name: _name,
            addr: msg.sender,
            voteCount: 0
        });

        candidateList.push(msg.sender);
    }

    // Initialisation via script
    function initializeCandidates(string[] memory names) public {
        require(msg.sender == owner, "Only owner");
        require(candidateList.length == 0, "Already initialized");
        require(names.length <= MAX_CANDIDATES, "Too many initial candidates");

        for (uint i = 0; i < names.length; i++) {
            address fakeAddr = address(uint160(uint(keccak256(abi.encodePacked(names[i], block.timestamp, i)))));
            candidates[fakeAddr] = Candidate({
                name: names[i],
                addr: fakeAddr,
                voteCount: 0
            });
            candidateList.push(fakeAddr);
        }
    }

    function vote(address _candidateAddr) public {
        require(!voters[msg.sender].hasVoted, "Already voted");
        require(candidates[_candidateAddr].addr != address(0), "Invalid candidate");

        voters[msg.sender] = Voter({
            hasVoted: true,
            votedCandidate: _candidateAddr
        });

        candidates[_candidateAddr].voteCount += 1;
        voterList.push(msg.sender);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory result = new Candidate[](candidateList.length);
        for (uint i = 0; i < candidateList.length; i++) {
            result[i] = candidates[candidateList[i]];
        }
        return result;
    }

    function getCandidate(address _addr) public view returns (string memory name, uint voteCount) {
        Candidate memory c = candidates[_addr];
        return (c.name, c.voteCount);
    }

    function hasVoted(address _addr) public view returns (bool, address) {
        Voter memory v = voters[_addr];
        return (v.hasVoted, v.votedCandidate);
    }

    function getCandidateCount() public view returns (uint) {
        return candidateList.length;
    }

    function getVoterCount() public view returns (uint) {
        return voterList.length;
    }
}
