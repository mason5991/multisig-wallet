import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, FormControl, FormErrorMessage } from '@chakra-ui/react';
import Home from './containers/Home';
import { useWeb3Context } from './contexts/web3';

const App = () => {
  const { errMessage, isLoading, web3, account, connect } = useWeb3Context();

  return (
    <Box textAlign='center' fontSize='xl'>
      <Grid minH='100vh' p={3}>
        <FormControl isInvalid={!!errMessage}>
          <Button
            colorScheme='blue'
            size='sm'
            onClick={connect}
            isLoading={isLoading}
            loadingText='Connecting'
            disabled={isLoading || !!account}
          >
            {account ? `Connected: ${account}` : 'Connect'}
          </Button>
          {errMessage && <FormErrorMessage>{errMessage}</FormErrorMessage>}
        </FormControl>
        {!web3 ? 'Please connect with metamask' : <Home />}
      </Grid>
    </Box>
  );
};

export default App;
