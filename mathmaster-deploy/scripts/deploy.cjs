const { ethers } = require('hardhat');

async function main() {
  console.log('Deploying MathMasterCelo contract...');

  const MathMasterCelo = await ethers.getContractFactory('MathMasterCelo');
  const mathMasterCelo = await MathMasterCelo.deploy();
  
  await mathMasterCelo.waitForDeployment();
  
  const address = await mathMasterCelo.getAddress();
  console.log('MathMasterCelo deployed to:', address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
