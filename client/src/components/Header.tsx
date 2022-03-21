import React from 'react';
import { Container, VStack } from '@chakra-ui/react';

const Header = ({ approvers, quorum }: { approvers: string[]; quorum: string }) => {
  return (
    <header>
      <VStack>
        <Container maxW='container.md'>approvers: {approvers.join(', ')}</Container>
        <Container maxW='container.md'>quorum: {quorum}</Container>
      </VStack>
    </header>
  );
};

export default Header;
