import { useEffect, useState } from 'react';
import { Box, VStack, Grid, theme, Spinner, Container, Text } from '@chakra-ui/react';
import Header from '../components/Header';
import TransferForm, { OnSubmitFunc as CreateTransferFunc } from '../components/TransferForm';
import TransferList from '../components/TransferList';
import Wallet from '../utils/wallet.util';
import { Wallet as WalletContract } from '../../../backend/types/web3-v1-contracts/Wallet';
import { useWeb3Context } from '../contexts/web3';
import { getInstance } from '../utils';

const Home = () => {
  const { web3, account } = useWeb3Context();
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<string[] | undefined>(undefined);
  const [approvers, setApprovers] = useState<string[]>([]);
  const [quorum, setQuorum] = useState<string | undefined>(undefined);
  const [transfers, setTransfers] = useState<Awaited<ReturnType<Wallet['getTransfers']>>>([]);

  const createTransfer: CreateTransferFunc = async (transfer) => {
    wallet!.createTransfer(transfer, accounts![0]);
  };

  const approveTransfer = async (transferId: number) => {
    wallet!.approveTransfer(transferId, accounts![0]);
  };

  useEffect(() => {
    const init = async () => {
      if (web3) {
        setIsLoading(true);
        const instance = await getInstance(web3);
        console.log('instance===', instance);
        if (instance) {
          setWallet(new Wallet(instance as unknown as WalletContract));
        }

        setIsLoading(false);
      }
    };
    init();
  }, [web3]);

  useEffect(() => {
    const init = async () => {
      if (wallet) {
        setIsLoading(true);
        const chainId = await web3!.eth.getChainId();
        console.log(chainId);
        const accounts = await web3!.eth.getAccounts();
        console.log(accounts);
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.getQuorum();
        const transfers = await wallet.getTransfers();
        setAccounts(accounts);
        setQuorum(quorum);
        setApprovers(approvers);
        setTransfers(transfers);
        setIsLoading(false);
      }
    };
    init();
  }, [web3, account, wallet]);

  return (
    <VStack spacing={8}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {!wallet ? (
            <Text>Deployed address not found</Text>
          ) : (
            <>
              {approvers.length > 0 && quorum && <Header approvers={approvers} quorum={quorum} />}
              <Container>
                <TransferForm onSubmit={createTransfer} />
              </Container>
              <Container>
                <TransferList transfers={transfers} approveTransfer={approveTransfer} />
              </Container>
            </>
          )}
        </>
      )}
    </VStack>
  );
};

export default Home;
