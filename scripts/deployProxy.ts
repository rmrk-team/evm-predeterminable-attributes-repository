import { bytecode } from "../artifacts/contracts/AttributesRepository.sol/AttributesRepository.json";
import { ethers, run } from "hardhat";
import { create2Address } from "../utils/utils";
import { Wallet, Signer } from "ethers";
import { delay } from '@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService';

async function main() {
    console.log("Deploying DeployProxy...");

    // const prefundedAddress = await ethers.getSigners();
    // const deployer = new Wallet(process.env.REPOSITORY_DEPLOYER, prefundedAddress[0].provider);
    const accounts: Signer[] = await ethers.getSigners();
    const deployer = accounts[0];
    console.log(`Deployer Address: ${await deployer.getAddress()}`);

    const DeployProxy = await ethers.getContractFactory("DeployProxy");
    const deployProxy = await DeployProxy.connect(deployer).deploy(); // Used for the networks where the deploy proxy is not deployed to
    // const deployProxy = DeployProxy.attach('0x91C3e47998f91929a0ADCA8A7301abc18C24d6B5'); // Used for the networks where the deploy proxy is already deployed to

    await deployProxy.deployed();
    console.log(`DeployProxy deployed to: ${deployProxy.address}`);

    const initCode = bytecode;

    const saltHex = ethers.utils.id("220555452");

    const repositoryDeploy = await deployProxy.connect(deployer).deployContract(initCode, saltHex);
    const transactionReceipt = await repositoryDeploy.wait();

    const repositoryAddress = transactionReceipt.events[0].args[0];

    console.log(`Deployed AttributesRepository to: ${repositoryAddress}`);

    await delay(60000);

    try {
        await run('verify:verify', {
          address: repositoryAddress,
          constructorArguments: [],
        });
      } catch (error) {
        console.log(error);
      }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});