import { ethers } from "hardhat";
import chai from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { solidity } from "ethereum-waffle";

import { Implementation, Vulnerable } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe(" Exploit Spearbit Task", () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  let implementation: Implementation;
  let vulnerable: Vulnerable;

  beforeEach(async () => {
    [deployer, attacker] = await ethers.getSigners();

    const Implementation = await ethers.getContractFactory(
      "Implementation",
      deployer,
    );

    implementation = await Implementation.deploy();

    const VulnerableContract = await ethers.getContractFactory(
      "Vulnerable",
      attacker,
    );

    vulnerable = await VulnerableContract.deploy();
  });

  it("should destroy the implementation contract", async () => {
    await vulnerable.exploit(implementation.address);
    expect(await ethers.provider.getCode(implementation.address)).to.equal(
      "0x",
    );
  });
});
