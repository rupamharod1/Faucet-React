import { ethers } from "ethers";
import { PRIVATE_KEY, RPC_ENDPOINT } from "./NetworkInfo";


// Replace these with your private key and network configuration

export async function createAndFundWallets(to_address) {
  const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const currentNonce = await provider.getTransactionCount(wallet.address, 'latest');
    
    // Transfer native Ethereum tokens to the newly created wallet
    const valueToSend = ethers.utils.parseEther('0.5'); // Change this value as needed
    const transaction = {
      to: to_address,
      gasLimit: ethers.utils.hexlify(60000),
      value: valueToSend,
      nonce: currentNonce, // Use the updated nonce here
      chainId: 903011,
    };

    const txResponse = await wallet.sendTransaction(transaction);
    const txReceipt = await txResponse.wait(1)
    return(txReceipt)
}

