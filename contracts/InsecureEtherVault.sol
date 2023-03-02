//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
contract InsecureEtherVault is Ownable,Pausable {
    event WithdrawAllCalled(address indexed userAddress, uint256 indexed balance);
    mapping (address => uint256) private userBalances;

    function deposit() whenNotPaused external payable {
        userBalances[msg.sender] += msg.value;
    }

    function withdrawAll() whenNotPaused external {

        uint256 balance = getUserBalance(msg.sender);
        require(balance > 0, "Insufficient balance");
        emit WithdrawAllCalled(msg.sender, balance);
        
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Failed to send Ether");

        userBalances[msg.sender] = 0;
    }

    function getBalance() whenNotPaused external view returns (uint256) {
        return address(this).balance;
    }

    function getUserBalance(address _user) whenNotPaused public view returns (uint256) {
        return userBalances[_user];
    }

    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() public onlyOwner whenPaused {
        _unpause();
    }
}