import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';

export type TransferFormInputs = {
  amount: string;
  to: string;
};

export type OnSubmitFunc = (transfer: TransferFormInputs) => void;

const TransferForm = ({ onSubmit }: { onSubmit: OnSubmitFunc }) => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<TransferFormInputs>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.amount}>
        <FormLabel htmlFor='amount'>Amount</FormLabel>
        <Input
          id='amount'
          type='text'
          {...register('amount', { required: 'Amount is required' })}
        />
        <FormErrorMessage>{errors.amount && errors.amount.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor='to'>To</FormLabel>
        <Input
          id='to'
          type='text'
          {...register('to', { required: 'Destination account is required' })}
        />
        <FormErrorMessage>{errors.to && errors.to.message}</FormErrorMessage>
      </FormControl>
      <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
        Submit
      </Button>
    </form>
  );
};

export default TransferForm;
