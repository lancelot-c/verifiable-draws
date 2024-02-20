
import hardhat from 'hardhat';
import fs from 'fs'
import os from 'os'
const { CONTRACT_NAME, TESTNET_CHAINLINK_VRF_SUBSCRIPTION_ID, MAINNET_CHAINLINK_VRF_SUBSCRIPTION_ID } = process.env;
const network = hardhat.network.name;

async function deployAll() {
    
    let chainlink_vrf_subscription_id = (network == 'mainnet') ? MAINNET_CHAINLINK_VRF_SUBSCRIPTION_ID : TESTNET_CHAINLINK_VRF_SUBSCRIPTION_ID;
    await deployOne(CONTRACT_NAME, chainlink_vrf_subscription_id);
}


async function deployOne(contractName, args) {

    const [deployer] = await ethers.getSigners();
    console.log(`\nDeploying...\nNetwork: ${network}\nAccount: ${deployer.address}\nContract: ${contractName}\nArgs: ${args}\n`);

    const contractFactory = await hardhat.ethers.getContractFactory(contractName);
    const contract = await contractFactory.deploy(args);
    await contract.deployed();
    
    const contractAddress = contract.address;
    console.log(`${contractName} deployed to address ${contractAddress}`)
    updateEnvFile(contractAddress);
    return contractAddress;
}

/**
 *  Sync the ABI of the deployed contracts and set the environment variables to the correct addresses
 */
async function updateEnvFile(contractAddress) {
    const envLocation = './.env';
    let contractAddressVar = (network == 'mainnet') ? 'MAINNET' : 'TESTNET';
    contractAddressVar += '_CONTRACT_ADDRESS';

    // Update environment variables
    await setEnvValue(contractAddressVar, contractAddress, envLocation);
    console.log(`${contractAddressVar} = ${contractAddress}\n.env updated`);
    // updateABI();
}

// async function updateABI() {
//     console.log('Updating abi...');
//     const collectionsDir = path.resolve(
//         "contracts/artifacts/WinkyverseCollections_metadata.json"
//     )
//     const collectionsFile = fs.readFileSync(collectionsDir, "utf8")
//     const collectionsABI = JSON.parse(collectionsFile).output.abi

//     const collectionsPathBackend = `./app/assets/contracts/collections.json`;
//     const collectionsPathFrontend = `../nft-storefront/src/assets/contracts/collections.json`;
//     fs.writeFileSync(collectionsPathBackend, JSON.stringify({ abi: collectionsABI }));
//     fs.writeFileSync(collectionsPathFrontend, JSON.stringify({ abi: collectionsABI }));
//     console.log(`completed updating abi files`)
// }


/**
 *  Function to change the environment variables
 * @param {*} key 
 * @param {*} value 
 * @param {*} envLocation 
 */
async function setEnvValue(key, value, envLocation) {
    const ENV_VARS = fs.readFileSync(envLocation, "utf8").split(os.EOL);
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp(key));
    }));
    ENV_VARS.splice(target, 1, `${key} = '${value}'`);
    fs.writeFileSync(envLocation, ENV_VARS.join(os.EOL));
}

deployAll()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
