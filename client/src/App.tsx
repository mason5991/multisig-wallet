import React, { useState, useEffect } from 'react';
import { Box, VStack, Grid, Spinner, Container, Text, Button } from '@chakra-ui/react';
import { connectAccount, getInstance } from './utils';
import Home from './containers/Home';
import { useWeb3Context } from './contexts/web3';

const App = () => {
  const { web3, updateAccount } = useWeb3Context();

  const onConnect = async () => {
    const { web3, account } = await connectAccount();
    updateAccount({ web3, account });
  };

  // if (!web3) {
  //   return <Spinner />;
  // }

  // if (web3 !== window.ethereum) {
  //   return <Text>You are not using metamask</Text>;
  // }

  return (
    <Box textAlign='center' fontSize='xl'>
      <Grid minH='100vh' p={3}>
        <Button colorScheme='blue' size='sm' onClick={onConnect}>
          Connect
        </Button>
        {!web3 ? 'Please connect with metamask' : <Home />}
      </Grid>
    </Box>
  );
};

export default App;
