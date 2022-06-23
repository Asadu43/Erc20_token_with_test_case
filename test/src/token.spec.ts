import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, BigNumber, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import hre, { ethers } from "hardhat";

describe("Asad Token", function async() {

  let signers: Signer[];

  let testTokenInstance: Contract;
  let owner:SignerWithAddress;
  let user:SignerWithAddress;
  let user2:SignerWithAddress;


  before(async () => {
     [owner, user,user2] = await ethers.getSigners();

    hre.tracer.nameTags[owner.address] = "ADMIN";
    hre.tracer.nameTags[user.address] = "USER1";
    hre.tracer.nameTags[user2.address] = "USER2";

    const TestToken = await ethers.getContractFactory("AsadToken", owner);

    testTokenInstance = await TestToken.deploy();
    hre.tracer.nameTags[testTokenInstance.address] = "TEST-TOKEN";
  });


  it("should return TokenName", async function () {
    expect(await testTokenInstance.callStatic.name()).to.be.equal("AsadToken")
  })

  it("should return Symbol", async function () {
    expect(await testTokenInstance.callStatic.symbol()).to.be.equal("ASD")
  })

  it("should return Owner", async function () {
    expect(await testTokenInstance.callStatic.owner()).to.be.equal(owner.address)
  })

  it("should return totalSupply", async function () {
    expect(await testTokenInstance.callStatic.totalSupply()).to.be.equal(BigNumber.from("0"))
  })

  it("should return BalanceOf", async function () {
    expect(await testTokenInstance.callStatic.balanceOf(owner.address)).to.be.equal(BigNumber.from("0"))
  })



  it("should return decimals", async function () {
    expect(await testTokenInstance.callStatic.decimals()).to.be.equal(BigNumber.from("18"))
  })

  it("should return mint", async function () {
    await expect(()=> testTokenInstance.mint(owner.address,parseEther("10000")))
    .changeTokenBalance(testTokenInstance,owner,parseEther("10000"))
  })

  it("should return transfer", async function () {
   await expect(()=> testTokenInstance.transfer(user.address,parseEther("20")))
   .changeTokenBalances(testTokenInstance,[owner,user],[parseEther("-20"),parseEther("20")])
  })

  it("should return Allownce", async function () {
    await testTokenInstance.callStatic.allowance(owner.address,user.address)
  })



  it("should return Approve", async function () {
    await testTokenInstance.approve(user.address,parseEther("50"))
  })

  it("should return BalanceOf", async function () {
    expect(await testTokenInstance.callStatic.balanceOf(owner.address)).to.be.equal(BigNumber.from("9980000000000000000000"))
  })

  it("should return transferOwnership", async function () {
    await testTokenInstance.transferOwnership(user.address)
  })

  it("should return transferFrom", async function () {
    await expect(()=> testTokenInstance.connect(user).transferFrom(owner.address,user2.address,parseEther("2")))
    .changeTokenBalances(testTokenInstance,[owner,user2],[parseEther("-2"),parseEther("2")])
  })

  it("should return allowanceIncrease", async function () {
    expect(await testTokenInstance.increaseAllowance(user.address,1000))
  })
  it("should return allowanceDecrease", async function () {
    await testTokenInstance.connect(owner).decreaseAllowance(user.address,100)
  })

  // it("should return burn", async function () {
  //   expect(await testTokenInstance.burn(0))
  // })

});