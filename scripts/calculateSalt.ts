import { bytecode } from "../artifacts/contracts/AttributesRepository.sol/AttributesRepository.json";
import { ethers } from "hardhat";
import { create2Address } from "../utils/utils";
import { Wallet, Signer } from "ethers";

async function main() {
    console.log("Deploying DeployProxy...");

    const prefundedAddress = await ethers.getSigners();
    const deployer = new Wallet(process.env.REPOSITORY_DEPLOYER, prefundedAddress[0].provider);
    // const accounts: Signer[] = await ethers.getSigners();
    // const deployer = accounts[0];
    console.log(`Deployer Address: ${await deployer.getAddress()}`);

    // This is a utility to get the deployer to have some ETH to deploy the contract in the Hardhat's emualted network
    const [fundedAddress] = await ethers.getSigners();
    await fundedAddress.sendTransaction({ to: deployer.address, value: ethers.utils.parseEther("1.0") });

    const DeployProxy = await ethers.getContractFactory("DeployProxy");
    const deployProxy = await DeployProxy.connect(deployer).deploy(); // Used for the networks where the deploy proxy is not deployed to
    // const deployProxy = DeployProxy.attach('0x91C3e47998f91929a0ADCA8A7301abc18C24d6B5'); // Used for the networks where the deploy proxy is already deployed to

    await deployProxy.deployed();
    console.log(`DeployProxy deployed to: ${deployProxy.address}`);

    const initCode = bytecode;

    console.log('Calculating salt...');

    // // This is used to find the saltHex that will generate the create2 address that starts with 0xA77B75
    let saltHex = ethers.utils.id("0");
    // // i used to generate the saltHex resulting in 0xA77b75D5fDEC6E6e8E00e05c707a7CA81a3F9f4a is 220555452
    // // The saltHex is generated using ethers.utils.id(i.toString())
    // // The saltHex is 0xed6d22acfc436487ae9db9412ff6ba59f7dfc778f647f18c9cbfa5f71ab85718
    for(let i = 200000000; i < 1000000000; i++) {
        // console.log(`Salt: ${saltHex}`);
        const create2Addr = await create2Address(deployProxy.address, saltHex, initCode);
        // console.log(`Precomputed create2 Address: ${create2Addr}`);
        console.log(`i is: ${i}`);
        console.log(create2Addr.slice(2, 8));
        if(create2Addr.slice(2, 8).toUpperCase() === "A77B75"){
            console.log("Found!");
            console.log(`Salt: ${saltHex}`);
            console.log(`Precomputed create2 Address: ${create2Addr}`);
            console.log(`i is: ${i}`);
            break;
        }
        saltHex = ethers.utils.id((i + 1).toString());
    }

    // const saltHex = ethers.utils.id("220555452");

    const repositoryDeploy = await deployProxy.connect(deployer).deployContract(initCode, saltHex);
    const transactionReceipt = await repositoryDeploy.wait();

    const repositoryAddress = transactionReceipt.events[0].args[0];

    console.log(`Deployed AttributesRepository to: ${repositoryAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});