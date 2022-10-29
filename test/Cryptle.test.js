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
            await this.cryptle.setWordToFind("space");
            const wordToFind = await this.cryptle.wordToFind();
            wordToFind.should.equal("space");
        });
        it("has to revert if the word length is not 5, (6 letter)", async function() {
            await expectRevert(
                this.cryptle.setWordToFind("prova1"),
                "The word should be 5 characters"
            );
        });
        it("has to revert if the word length is not 5, (4 letter)", async function() {
            await expectRevert(
                this.cryptle.setWordToFind("prov"),
                "The word should be 5 characters"
            );
        });
        it("has to revert if the word length is not 5, (empty string)", async function() {
            await expectRevert(
                this.cryptle.setWordToFind(""),
                "The word should be 5 characters"
            );
        });
    });
    describe("Check winning status", async function() {
        it("has to return false if the word is not guessed", async function() {
            await this.cryptle.setWordToFind("space");
            await this.cryptle.guessWord("spacx");
            const youWon = await this.cryptle.youWon();
            youWon.should.equal(false);
        });
        it("has to return true if the word is guessed", async function() {
            await this.cryptle.setWordToFind("space");
            await this.cryptle.guessWord("space");
            const youWon = await this.cryptle.youWon();
            youWon.should.equal(true);
        });
        it("has to return this array [2, 2, 2, 2, 0] for the word 'spacx' because only last char is wrong and not present in the word", async function() {
            await this.cryptle.setWordToFind("space");
            await this.cryptle.guessWord("spacx");
            const guessedWord = await this.cryptle.getGuessedWord();

            guessedWord[0].should.be.bignumber.equal("2");
            guessedWord[1].should.be.bignumber.equal("2");
            guessedWord[2].should.be.bignumber.equal("2");
            guessedWord[3].should.be.bignumber.equal("2");
            guessedWord[4].should.be.bignumber.equal("0");
        });
        it("has to return this array [1, 1, 2, 1, 1] for the reverse word 'ecaps'", async function() {
            await this.cryptle.setWordToFind("space");
            await this.cryptle.guessWord("ecaps");
            const guessedWord = await this.cryptle.getGuessedWord();

            guessedWord[0].should.be.bignumber.equal("1");
            guessedWord[1].should.be.bignumber.equal("1");
            guessedWord[2].should.be.bignumber.equal("2");
            guessedWord[3].should.be.bignumber.equal("1");
            guessedWord[4].should.be.bignumber.equal("1");
        });
        it("has to return this array [0, 0, 2, 0, 0] for the word 'aaaaa'", async function() {
            await this.cryptle.setWordToFind("space");
            await this.cryptle.guessWord("aaaaa");
            const guessedWord = await this.cryptle.getGuessedWord();

            guessedWord[0].should.be.bignumber.equal("0");
            guessedWord[1].should.be.bignumber.equal("0");
            guessedWord[2].should.be.bignumber.equal("2");
            guessedWord[3].should.be.bignumber.equal("0");
            guessedWord[4].should.be.bignumber.equal("0");
        });
    });
    describe("Game restrictions", async function() {
        it("has to revert if an user try to guess more than 5 times", async function() {
            await this.cryptle.setWordToFind("space");
            await this.cryptle.guessWord("aaaaa", {from: accounts[1]});
            await this.cryptle.guessWord("bbbbb", {from: accounts[1]});
            await this.cryptle.guessWord("ccccc", {from: accounts[1]});
            await this.cryptle.guessWord("ddddd", {from: accounts[1]});
            await this.cryptle.guessWord("eeeee", {from: accounts[1]});

            await expectRevert(
                this.cryptle.guessWord("fffff", {from: accounts[1]}),
                "You have already made 5 attempts"
            )
        });
    });
});