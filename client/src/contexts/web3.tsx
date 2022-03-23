import detectEthereumProvider from '@metamask/detect-provider';
import React, { createContext, useContext, useReducer, useState } from 'react';
import Web3 from 'web3';
import { EthereumProviderError } from 'eth-rpc-errors';

export interface Web3State {
  isLoading: boolean;
  errMessage: string;
  web3?: Web3;
  account: string;
  connect: () => void;
  disconnect: () => void;
}

const initialState: Web3State = {
  isLoading: false,
  errMessage: '',
  web3: undefined,
  account: '',
  connect: () => {},
  disconnect: () => {},
};

const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
const SET_CONNECTING = 'SET_CONNECTING';
const SET_CONNECTED = 'SET_CONNECTED';
const SET_CONNECTION_FAILED = 'SET_CONNECTION_FAILED';
interface UpdateAccountAction {
  type: 'UPDATE_ACCOUNT';
  payload: {
    account: string;
    web3?: Web3;
  };
}

interface SetConnectingAction {
  type: 'SET_CONNECTING';
}

interface SetConnectedAction {
  type: 'SET_CONNECTED';
  payload: {
    account: string;
    web3: Web3;
  };
}

interface SetConnectionFailedAction {
  type: 'SET_CONNECTION_FAILED';
  payload: {
    errMessage: string;
  };
}

type Action =
  | UpdateAccountAction
  | SetConnectingAction
  | SetConnectedAction
  | SetConnectionFailedAction;

function reducer(state: Web3State = initialState, action: Action) {
  switch (action.type) {
    case UPDATE_ACCOUNT: {
      const { payload } = action;
      const web3 = payload.web3 || state.web3;
      const { account } = payload;

      return {
        ...state,
        web3,
        account,
      };
    }
    case SET_CONNECTING: {
      return {
        ...state,
        isLoading: true,
        errMessage: '',
      };
    }
    case SET_CONNECTED: {
      const { payload } = action;
      return {
        ...state,
        ...payload,
        isLoading: false,
        errMessage: '',
      };
    }
    case SET_CONNECTION_FAILED: {
      const {
        payload: { errMessage },
      } = action;

      return {
        ...state,
        isLoading: false,
        errMessage,
      };
    }
    default:
      return state;
  }
}

const Web3Context = createContext({
  ...initialState,
  connect: () => {},
  disconnect: () => {},
});

export const useWeb3Context = () => useContext(Web3Context);

export interface Web3ProviderProps {}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const connect = async () => {
    dispatch({ type: 'SET_CONNECTING' });
    const provider = await detectEthereumProvider();
    if (provider === window.ethereum) {
      const { ethereum } = window;
      const web3 = new Web3(ethereum);
      await ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => {
          const handleAccountsChanged = (accounts: string[]) => {
            console.log('handleAccountsChanged');
            updateAccount({ account: accounts[0] || '' });
          };
          const handleChainChanged = () => {
            console.log('handleChainChanged');
            window.location.reload();
          };
          dispatch({ type: 'SET_CONNECTED', payload: { web3, account: accounts[0] || '' } });
          ethereum.on('chainChanged', handleChainChanged);
          ethereum.on('accountsChanged', handleAccountsChanged);
          ethereum.on('disconnect', () => {
            ethereum.removeListener('chainChanged', handleChainChanged);
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
            disconnect();
          });
        })
        .catch((err: EthereumProviderError<unknown>) => {
          let errMessage = '';
          if (err) {
            errMessage = err.message;
          } else {
            console.error(err);
            errMessage = 'Unexpected error';
          }
          dispatch({
            type: SET_CONNECTION_FAILED,
            payload: {
              errMessage,
            },
          });
        });
    }
  };

  const disconnect = async () => {
    updateAccount({ web3: undefined, account: '' });
  };

  function updateAccount(data: { account: string; web3?: Web3 }) {
    dispatch({
      type: UPDATE_ACCOUNT,
      payload: data,
    });
  }

  return (
    <Web3Context.Provider
      value={{
        ...state,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
