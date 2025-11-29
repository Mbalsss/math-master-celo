const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=== Debugging Deployment ===");
  
  // Check if artifact file exists
  const artifactPath = path.join(__dirname, "../artifacts/contracts/MathTournament.sol/MathTournament.json");
  console.log("1. Artifact path:", artifactPath);
  console.log("2. Artifact exists:", fs.existsSync(artifactPath));
  
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    console.log("3. Contract name in artifact:", artifact.contractName);
    console.log("4. ABI length:", artifact.abi.length);
  } else {
    console.log("3. Artifact file not found!");
    
    // Let's see what's in the artifacts directory
    const artifactsDir = path.join(__dirname, "../artifacts/contracts");
    console.log("4. Checking artifacts directory...");
    
    if (fs.existsSync(artifactsDir)) {
      const files = fs.readdirSync(artifactsDir, { recursive: true });
      console.log("5. Files in artifacts/contracts:", files);
    } else {
      console.log("5. artifacts/contracts directory doesn't exist!");
    }
  }

  // Try to get available contract names
  try {
    console.log("6. Getting available contract names...");
    const contractNames = await ethers.getContractFactory.getContractNames();
    console.log("7. Available contracts:", contractNames);
  } catch (error) {
    console.log("7. Error getting contract names:", error.message);
  }

  // Try deployment
  try {
    console.log("8. Attempting to get contract factory...");
    const MathTournament = await ethers.getContractFactory("MathTournament");
    console.log("9. Contract factory created successfully");
    
    console.log("10. Deploying...");
    const mathTournament = await MathTournament.deploy();
    await mathTournament.waitForDeployment();
    
    const address = await mathTournament.getAddress();
    console.log("11. SUCCESS! MathTournament deployed to:", address);
  } catch (error) {
    console.log("11. Deployment failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Main error:", error);
    process.exit(1);
  });