const Wallet = artifacts.require('Wallet');
const { expectRevert, BN, balance } = require('@openzeppelin/test-helpers');

contract('Wallet', (accounts) => {
  it('should have correct approvers and quorum', async () => {
    const wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
    const approvers = await wallet.getApprovers();
    const quorum = await wallet.quorum();
    assert(approvers.length === 3);
    assert(approvers[0] === accounts[0]);
    assert(approvers[1] === accounts[1]);
    assert(approvers[2] === accounts[2]);
    assert(quorum.toNumber() === 2);
  });

  describe('createTransfer', () => {
    it('should create transfers', async () => {
      const wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
      await web3.eth.sendTransaction({ from: accounts[0], to: wallet.address, value: 1000 });

      await wallet.createTransfer(100, accounts[5], { from: accounts[0] });

      const transfers = await wallet.getTransfers();

      assert(transfers.length === 1);
      assert(transfers[0].id.toString() === '0');
      assert(transfers[0].amount.toString() === '100');
      assert(transfers[0].to === accounts[5]);
      assert(transfers[0].approvals.toString() === '0');
      assert(transfers[0].sent === false);
    });

    it('should NOT create tranfers if sender is not approved', async () => {
      const wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
      await web3.eth.sendTransaction({ from: accounts[0], to: wallet.address, value: 1000 });

      const transfer = wallet.createTransfer(100, accounts[5], { from: accounts[3] });

      await expectRevert(transfer, 'Only approver allowed');
    });
  });

  describe('approveTransfer', () => {
    it('should increment approvals', async () => {
      const wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
      await web3.eth.sendTransaction({ from: accounts[0], to: wallet.address, value: 1000 });

      await wallet.createTransfer(100, accounts[5], { from: accounts[0] });
      await wallet.approveTransfer(0, { from: accounts[0] });
      const transfers = await wallet.getTransfers();
      const currentBalance = new BN(await balance.current(wallet.address));
      assert(transfers[0].approvals.toString() === '1');
      assert(transfers[0].sent === false);
      assert(currentBalance.toNumber() === 1000);
    });

    it('should send transfer if quorum reached', async () => {
      const wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
      await web3.eth.sendTransaction({ from: accounts[0], to: wallet.address, value: 1000 });

      const balanceBefore = new BN(await balance.current(accounts[6]));
      await wallet.createTransfer(100, accounts[6], { from: accounts[0] });
      await wallet.approveTransfer(0, { from: accounts[0] });
      await wallet.approveTransfer(0, { from: accounts[1] });
      const balanceAfter = new BN(await balance.current(accounts[6]));
      assert(balanceAfter.sub(balanceBefore).toNumber() === 100);
    });

    it('should NOT approve transfer if sender is not approved', async () => {
      const wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
      await web3.eth.sendTransaction({ from: accounts[0], to: wallet.address, value: 1000 });

      await wallet.createTransfer(100, accounts[5], { from: accounts[0] });
      await expectRevert(wallet.approveTransfer(0, { from: accounts[3] }), 'Only approver allowed');
    });

    it('should NOT approve transfer if transfer has already been sent', async () => {
      const wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
      await web3.eth.sendTransaction({ from: accounts[0], to: wallet.address, value: 1000 });

      await wallet.createTransfer(100, accounts[5], { from: accounts[0] });
      await wallet.approveTransfer(0, { from: accounts[0] });
      await wallet.approveTransfer(0, { from: accounts[1] });
      await expectRevert(
        wallet.approveTransfer(0, { from: accounts[2] }),
        'Transfer has already been sent'
      );
    });

    it('should NOT approve transfer if approver approves transfer twice', async () => {
      const wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
      await web3.eth.sendTransaction({ from: accounts[0], to: wallet.address, value: 1000 });

      await wallet.createTransfer(100, accounts[5], { from: accounts[0] });
      await wallet.approveTransfer(0, { from: accounts[0] });
      await expectRevert(
        wallet.approveTransfer(0, { from: accounts[0] }),
        'Cannot approve transfer twice'
      );
    });
  });
});
