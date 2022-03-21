import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import Wallet from 'backend/build/contracts/Wallet.json';

export const connectAccount = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    throw new Error('Web3 not found');
  }

  const web3 = new Web3(ethereum);
  await ethereum.enable();
  const accounts = await web3.eth.getAccounts();

  return { web3, account: accounts[0] || '' };
};

export const getInstance = async (web3: Web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = (Wallet.networks as any)[networkId];
  return new web3.eth.Contract(Wallet.abi as AbiItem[], deployedNetwork?.address);
};
