const Cryptle = artifacts.require("./Cryptle.sol");

const {
    expectRevert,
} = require("@openzeppelin/test-helpers");

require("chai").should();

contract("Cryptle", accounts => {
    beforeEach(async function() {
        this.cryptle = await Cryptle.new();
    });

    describe("Testing word initialization", async function() {
        it("has to set the correct word to guess", async function() {
            await this.cryptle.setWordToGuess("prova");
            const wordToGuess = await this.cryptle.wordToGuess();
            wordToGuess.should.equal("prova");
        });
        it("has to revert if the word length is not 5, (6 letter)", async function() {
            await expectRevert(
                this.cryptle.setWordToGuess("prova1"),
                "The word should be 5 characters"
            );
        });
        it("has to revert if the word length is not 5, (4 letter)", async function() {
            await expectRevert(
                this.cryptle.setWordToGuess("prov"),
                "The word should be 5 characters"
            );
        });
        it("has to revert if the word length is not 5, (empty string)", async function() {
            await expectRevert(
                this.cryptle.setWordToGuess(""),
                "The word should be 5 characters"
            );
        });
    });
    describe.only("Check winning status", async function() {
        it("has to revert if the word is not guessed", async function() {
            await this.cryptle.setWordToGuess("prova");
            
            await expectRevert(
                this.cryptle.guessWord("pippo"),
                "The word is not correct"
            );
        });
        it("has to return true if the word is guessed", async function() {
            await this.cryptle.setWordToGuess("prova");
            await this.cryptle.guessWord("prova");
            const youWon = await this.cryptle.youWon();
            youWon.should.equal(true);
        });
    });
});