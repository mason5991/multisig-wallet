import React from 'react';
import { Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

const TransferList = ({
  transfers,
  approveTransfer,
}: {
  transfers: any[];
  approveTransfer: (id: number) => void;
}) => {
  return (
    <Table variant='striped' colorScheme='teal'>
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Amount</Th>
          <Th>To</Th>
          <Th>Approvals</Th>
          <Th>Sent</Th>
          <Th>Approve transfer?</Th>
        </Tr>
      </Thead>
      <Tbody>
        {transfers.map((transfer) => (
          <Tr key={transfer.id}>
            <Td>{transfer.id}</Td>
            <Td>{transfer.amount}</Td>
            <Td>{transfer.to}</Td>
            <Td>{transfer.approvals}</Td>
            <Td>{transfer.sent ? 'Yes' : 'No'}</Td>
            <Td>
              <Button
                colorScheme='blue'
                size='sm'
                disabled={transfer.sent}
                onClick={() => approveTransfer(transfer.id)}
              >
                Approve
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default TransferList;
