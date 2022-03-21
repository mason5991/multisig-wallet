import React, { createContext, useContext, useReducer } from 'react';
import Web3 from 'web3';

export type Web3State = {
  web3?: Web3;
  account: string;
  networkId: number;
};

const initialState: Web3State = {
  web3: undefined,
  account: '',
  networkId: 0,
};

const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
const UPDATE_NETWORK_ID = 'UPDATE_NETWORK_ID';

interface UpdateAccount {
  type: 'UPDATE_ACCOUNT';
  account: string;
  web3?: Web3;
}

interface UpdateNetworkId {
  type: 'UPDATE_NETWORK_ID';
  networkId: number;
}

type Action = UpdateAccount | UpdateNetworkId;

function reducer(state: Web3State = initialState, action: Action) {
  switch (action.type) {
    case UPDATE_ACCOUNT: {
      const web3 = action.web3 || state.web3;
      const { account } = action;

      return {
        ...state,
        web3,
        account,
      };
    }
    case UPDATE_NETWORK_ID: {
      const { networkId } = action;

      return {
        ...state,
        networkId,
      };
    }
    default:
      return state;
  }
}

const Web3Context = createContext({
  ...initialState,
  updateAccount: (_data: { account: string; web3?: Web3 }) => {},
  updateNetworkId: (_data: { networkId: number }) => {},
});

export const useWeb3Context = () => useContext(Web3Context);

export interface Web3ProviderProps {}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  function updateAccount(data: { account: string; web3?: Web3 }) {
    dispatch({
      type: UPDATE_ACCOUNT,
      ...data,
    });
  }

  function updateNetworkId(data: { networkId: number }) {
    dispatch({
      type: UPDATE_NETWORK_ID,
      ...data,
    });
  }
  return (
    <Web3Context.Provider
      value={{
        ...state,
        updateAccount,
        updateNetworkId,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
