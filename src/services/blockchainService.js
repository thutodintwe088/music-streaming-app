import { ethers } from 'ethers';
import { logger } from './errorHandler.js';
import config from './config.js';

const provider = new ethers.providers.JsonRpcProvider(config.ethereumNodeUrl);
const wallet = new ethers.Wallet(config.ethereumPrivateKey, provider);

const contractABI = [/* ABI for RoyaltyDistribution contract */];
const contractAddress = config.royaltyContractAddress;

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

export const distributeRoyalties = async (artists, amounts) => {
  try {
    const tx = await contract.distributeRoyalties(artists, amounts);
    await tx.wait();
    logger.info(`Royalties distributed on blockchain. Transaction hash: ${tx.hash}`);
    return tx.hash;
  } catch (error) {
    logger.error(`Error distributing royalties on blockchain: ${error.message}`);
    throw error;
  }
};