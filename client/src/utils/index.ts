import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import Wallet from '../contracts/Wallet.json';

export const getInstance = async (web3: Web3) => {
  const networkId = await web3.eth.net.getId();
  console.log('networkId===', networkId);
  const deployedNetwork = (Wallet.networks as any)[networkId];
  console.log('deployedNetwork====', deployedNetwork);
  return new web3.eth.Contract(Wallet.abi as AbiItem[], deployedNetwork?.address);
};
