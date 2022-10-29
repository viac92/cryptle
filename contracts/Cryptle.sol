// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Cryptle is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /* the current word to guess */
    string public wordToGuess;

    bool public youWon = false;

    /* this function set a new word to guess should be called by the owner
    of the contract, the word should be a string of 5 characters 
    @param _wordToGuess the new word to guess
    */
    function setWordToGuess(string memory _wordToGuess) external onlyOwner {
        // check if the word is 5 characters
        require(bytes(_wordToGuess).length == 5, "The word should be 5 characters");
        wordToGuess = _wordToGuess;
    }

    /* this function is called by the user to guess the word
    @param _wordToGuess the word to guess
    */
    function guessWord(string memory _wordToGuess) external nonReentrant {
        // check if the word is 5 characters
        require(bytes(_wordToGuess).length == 5, "The word should be 5 characters");
        // check if the word is the same as the word to guess
        require(keccak256(abi.encodePacked(_wordToGuess)) == keccak256(abi.encodePacked(wordToGuess)), "The word is not correct");
        youWon = true;
    }
}