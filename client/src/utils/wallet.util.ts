import { Wallet as WalletContract } from 'backend/types/web3-v1-contracts/Wallet';

export default class Wallet {
  wallet: WalletContract;
  constructor(instance: WalletContract) {
    this.wallet = instance;
  }

  async getQuorum() {
    return this.wallet.methods.quorum().call();
  }

  async getTransfers() {
    return this.wallet.methods.getTransfers().call();
  }

  async getApprovers() {
    return this.wallet.methods.getApprovers().call();
  }

  async createTransfer(transfer: { amount: string; to: string }, from: string) {
    return this.wallet.methods.createTransfer(transfer.amount, transfer.to).send({ from });
  }

  async approveTransfer(transferId: number, from: string) {
    return this.wallet.methods.approveTransfer(transferId).send({ from });
  }
}
