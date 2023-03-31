import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GaslessWalletInterface } from "@gelatonetwork/gasless-onboarding";
import { GaslessWallet } from "@gelatonetwork/gasless-wallet";
// import { SafeEventEmitterProvider } from "@web3auth/base";
import { gaslessOnboarding } from "./components/onboard";
// import "@rainbow-me/rainbowkit/styles.css";
// import {
//   getDefaultWallets,
//   RainbowKitProvider,
//   darkTheme,
// } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
// import { polygonMumbai, filecoin, filecoinHyperspace } from "wagmi/chains";
// import { alchemyProvider } from "wagmi/providers/alchemy";
// import { publicProvider } from "wagmi/providers/public";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import SelectTemplate from "./components/SelectTemplate";
import TemplateDetails from "./components/TemplateDetails";
import CreateDao from "./components/stepsform/CreateDao";
import Dashboard from "./pages/Dashboard";
import ExistingDaos from "./pages/ExistingDaos";
import Meet from "./pages/Meet";
import { useState } from "react";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [gaslessWallet, setGaslessWallet] = useState({});
  const [web3AuthProvider, setWeb3AuthProvider] = useState(null);
  // const { chains, provider } = configureChains(
  //   [polygonMumbai, filecoinHyperspace, filecoin],
  //   [
  //     alchemyProvider({ apiKey: "O5NYvtwLMNG0LjAXPQEk0YJT2l3UxTAY" }),
  //     publicProvider(),
  //   ]
  // );
  // const { connectors } = getDefaultWallets({
  //   appName: "My RainbowKit App",
  //   chains,
  // });
  // const wagmiClient = createClient({
  //   autoConnect: true,
  //   connectors,
  //   provider,
  // });
  const login = async () => {
    try {
      await gaslessOnboarding.init();
      const provider = await gaslessOnboarding.login();
      if (provider) {
        setWeb3AuthProvider(provider);
      }

      const gaslessWallet = await gaslessOnboarding.getGaslessWallet();
      if (!gaslessWallet.isInitiated()) await gaslessWallet.init();
      const address = gaslessWallet.getAddress();
      console.log(address);
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
    console.log(gaslessOnboarding);
  };

  return (
    // <WagmiConfig client={wagmiClient}>
    //   <RainbowKitProvider chains={chains} theme={darkTheme()}>
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<LandingPage logout={logout} login={login} />}
          />
          <Route
            path="/create-data-dao/select-template"
            element={<SelectTemplate />}
          />
          <Route
            path="/create-data-dao/select-template/details"
            element={<TemplateDetails />}
          />
          <Route path="/create-data-dao" element={<CreateDao />} />
          <Route path="/open-existing-data-dao" element={<Dashboard />} />
          <Route path="/open-existing-data-dao/meet" element={<Meet />} />
          {/* <Route
                path="/open-existing-data-dao/:id"
                element={<Dashboard />}
              /> */}
        </Routes>
      </Router>
    </div>
    //   </RainbowKitProvider>
    // </WagmiConfig>
  );
}

export default App;
