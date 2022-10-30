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
    string public wordToFind;

    /* the attempts of an user */
    mapping(address => uint256) attempts;

    /* the last result of a guess by an user */
    mapping(address => uint256[5]) lastResult;
    
    // TODO set the boolean with map for msg.sender
    mapping(address => bool) public youWon;

    /* this function set a new word to guess should be called by the owner
    of the contract, the word should be a string of 5 characters 
    @param _wordToGuess the new word to guess
    */
    function setWordToFind(string memory _wordToGuess) external onlyOwner {
        // check if the word is 5 characters
        require(bytes(_wordToGuess).length == 5, "The word should be 5 characters");
        wordToFind = _wordToGuess;
    }

    /* this function is called by the user to guess the word
    @param _wordToGuess the word to guess
    */
    function guessWord(string memory _attempt) external nonReentrant {
        bytes memory wordToGuessBytes = bytes(wordToFind);

        // check if the msg.sender has already guessed for 5 times
        require(attempts[msg.sender] < 5, "You have already made 5 attempts");

        // check if the word is 5 characters
        require(wordToGuessBytes.length == 5, "The word should be 5 characters");
        
                // check if the word is the same as the word to guess
        if (keccak256(abi.encodePacked(_attempt)) == keccak256(abi.encodePacked(wordToFind))) {
            youWon[msg.sender] = true;
        } else {        

            // if the characters is in the word but not in the correct position set to 1 the number in the array
            for (uint256 i = 0; i < wordToGuessBytes.length; i++) {
                if (wordToGuessBytes[i] == bytes(_attempt)[i]) {
                    lastResult[msg.sender][i] = 2;
                } else {
                    for (uint256 j = 0; j < wordToGuessBytes.length; j++) {
                        if (wordToGuessBytes[i] == bytes(_attempt)[j]) {
                            lastResult[msg.sender][i] = 1;
                        }
                    }
                }                  
            }
            youWon[msg.sender] = false;
        }

        attempts[msg.sender] = attempts[msg.sender].add(1);
    }

    function getResultByAddress() external view returns (uint256[5] memory) {
        return lastResult[msg.sender];
    }
}