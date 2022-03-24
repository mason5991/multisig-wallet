import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import config from '../configs/prod.json';

interface Config {
  networks: {
    [key: string]: {
      address: string;
    };
  };
  abi: AbiItem[];
}

export const getInstance = async (web3: Web3) => {
  const networkId = await web3.eth.net.getId();
  console.log('networkId===', networkId);
  const { networks, abi } = config as unknown as Config;
  const deployedNetwork = networks[networkId];
  if (!deployedNetwork) {
    return false;
  }
  console.log('deployedNetwork====', deployedNetwork);
  return new web3.eth.Contract(abi, deployedNetwork?.address);
};
