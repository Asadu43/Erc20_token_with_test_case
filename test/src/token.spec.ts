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


// Testing ERC20 Smart Contracts in Typescript & Hardhat


// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { LinkToken__factory, LinkToken } from "../typechain";

// describe("Token contract", function () {

// 	let linkToken: LinkToken;
// 	let owner: SignerWithAddress;
// 	let addr1: SignerWithAddress;
// 	let addr2: SignerWithAddress
// 	let addrs: SignerWithAddress[];

// 	beforeEach(async function () {

// 		[owner, addr1, addr2, ...addrs] = await ethers.getSigners();

// 		const linkTokenFactory = (await ethers.getContractFactory(
// 			"LinkToken", owner
// 		)) as LinkToken__factory;
// 		const totalSupply = (10 ** 9).toString()
// 		linkToken = await linkTokenFactory.deploy(
// 			ethers.utils.parseEther(totalSupply),
// 		)

// 	});

// 	describe("Deployment", function () {

// 		it("Should assign the total supply of tokens to the owner", async function () {
// 			const ownerBalance = await linkToken.balanceOf(owner.address);
// 			expect(await linkToken.totalSupply()).to.equal(ownerBalance);
// 		});
// 	});

// 	describe("Transactions", function () {
// 		it("Should transfer tokens between accounts", async function () {
// 			// Transfer 50 tokens from owner to addr1
// 			await linkToken.transfer(addr1.address, 50);
// 			const addr1Balance = await linkToken.balanceOf(addr1.address);
// 			expect(addr1Balance).to.equal(50);

// 			// Transfer 50 tokens from addr1 to addr2
// 			// We use .connect(signer) to send a transaction from another account
// 			await linkToken.connect(addr1).transfer(addr2.address, 50);
// 			const addr2Balance = await linkToken.balanceOf(addr2.address);
// 			expect(addr2Balance).to.equal(50);
// 		});

// 		it("Should fail if sender doesn’t have enough tokens", async function () {
// 			const initialOwnerBalance = await linkToken.balanceOf(owner.address);

// 			// Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
// 			// `require` will evaluate false and revert the transaction.
// 			await expect(
// 				linkToken.connect(addr1).transfer(owner.address, 1)
// 			).to.be.revertedWith("ERC20: transfer amount exceeds balance");

// 			// Owner balance shouldn't have changed.
// 			expect(await linkToken.balanceOf(owner.address)).to.equal(
// 				initialOwnerBalance
// 			);
// 		});

// 		it("Should update balances after transfers", async function () {
// 			const initialOwnerBalance = await linkToken.balanceOf(owner.address);

// 			// Transfer 100 tokens from owner to addr1.
// 			await linkToken.transfer(addr1.address, 100);

// 			// Transfer another 50 tokens from owner to addr2.
// 			await linkToken.transfer(addr2.address, 50);

// 			// Check balances.
// 			const finalOwnerBalance = await linkToken.balanceOf(owner.address);
// 			expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

// 			const addr1Balance = await linkToken.balanceOf(addr1.address);
// 			expect(addr1Balance).to.equal(100);

// 			const addr2Balance = await linkToken.balanceOf(addr2.address);
// 			expect(addr2Balance).to.equal(50);
// 		});
// 	});
// });



// Testing Smart Contracts with Ownable Inheritance in Typescript & Hardhat


// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { Base__factory, Base } from "../typechain";

// describe("Base", () => {

// 	let base: Base;
// 	let owner: SignerWithAddress;
// 	let addr1: SignerWithAddress;
// 	let addr2: SignerWithAddress;
// 	let addrs: SignerWithAddress[];

// 	beforeEach(async () => {
// 		[owner, addr1, addr2, ...addrs] = await ethers.getSigners();

// 		const baseFactory = (await ethers.getContractFactory(
// 			"Base", owner
// 		)) as Base__factory;
// 		base = await baseFactory.deploy();
// 		await base.deployed();

// 	})

// 	it("Should increase the balance of the contract", async () => {

// 		expect((await base.getBalance())).to.equal(ethers.BigNumber.from(0));

// 		const transactionHash = await owner.sendTransaction({
// 			to: base.address,
// 			value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
// 		});

// 		expect((await base.getBalance())).to.equal(ethers.utils.parseEther("1.0"));

// 	})

// 	it("Should be reverted because it is not called by the owner", async () => {

// 		expect(await base.owner()).to.equal(owner.address);

// 		const transactionHash = await owner.sendTransaction({
// 			to: base.address,
// 			value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
// 		});

// 		await expect(base.connect(addr1).withdraw(owner.address, ethers.utils.parseEther("1.0")))
// 			.to.be.reverted;

// 	});


// 	it("Should decrease the balance of the contract", async () => {

// 		const transactionHash = await owner.sendTransaction({
// 			to: base.address,
// 			value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
// 		});

// 		await base.withdraw(owner.address, ethers.utils.parseEther("1.0"));

// 		expect((await base.getBalance())).to.equal(ethers.BigNumber.from(0));

// 	});

// }