import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import detectEthereumProvider from '@metamask/detect-provider';
import Wallet from 'backend/build/contracts/Wallet.json';

export const getInstance = async (web3: Web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = (Wallet.networks as any)[networkId];
  return new web3.eth.Contract(Wallet.abi as AbiItem[], deployedNetwork?.address);
};
