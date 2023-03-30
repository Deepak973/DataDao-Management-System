import { GaslessWalletInterface } from "@gelatonetwork/gasless-onboarding";
import { GaslessWallet } from "@gelatonetwork/gasless-wallet";
// import { SafeEventEmitterProvider } from "@web3auth/base";
import { gaslessOnboarding } from "./onboard";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
// import { trpc } from "../utils/trpc";

export default function useGaslessOnboarding() {
  const [walletAddress, setWalletAddress] = useState("");
  const [gaslessWallet, setGaslessWallet] = useState({});
  const [web3AuthProvider, setWeb3AuthProvider] = useState(null);
  //   const [contract, setContract] = useState(null);

  const login = async () => {
    try {
      await gaslessOnboarding.init();
      const provider = await gaslessOnboarding.login();
      if (provider) {
        setWeb3AuthProvider(provider);
      }

      const gaslessWallet = gaslessOnboarding.getGaslessWallet();
      if (!gaslessWallet.isInitiated()) await gaslessWallet.init();
      const address = gaslessWallet.getAddress();
      setGaslessWallet(gaslessWallet);
      setWalletAddress(address);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    await gaslessOnboarding?.logout();

    setWeb3AuthProvider(null);
    setGaslessWallet(undefined);
    setWalletAddress(undefined);
  };

  //   const contractAction = async () => {
  //     if (!gaslessWallet) return;
  //     try {
  //       // const CONTRACT_ABI = ['function store(uint256)']
  //       // let IContract = new utils.Interface(CONTRACT_ABI)
  //       // let txData = IContract.encodeFunctionData('store', [BigInt(111)])
  //       // const { taskId } = await gaslessWallet.sponsorTransaction(CONTRACT_ADDRESS, txData)

  //       const txData = await contract?.populateTransaction["store"]?.(100);
  //       if (!txData?.data) return;
  //       let tx = await gaslessWallet?.sponsorTransaction(
  //         CONTRACT_ADDRESS,
  //         txData?.data
  //       );
  //       console.log(`https://relay.gelato.digital/tasks/status/${tx?.taskId}`);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  return {
    login,
    logout,
    walletAddress,
    gaslessWallet,
  };
}
