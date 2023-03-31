import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ContractFactory, ethers, providers } from "ethers";
import MembershipToken from "../../contracts/artifacts/DataDaoToken.json";
import dataDaoInstace from "../../contracts/artifacts/dataDaoInstace.json";
import dataDaoFactory from "../../contracts/artifacts/dataDaoFactory.json";
// import { useAccount } from "wagmi";
import { gaslessOnboarding } from "../../components/onboard";

const dataDaoFactoryContract = "0x0caC8C986452628Ed38483bcEE0D1cF85816946D";

function ReviewInfo({
  handleNext,
  handleBack,
  dataDaoDetails,
  setDataDaoDetails,
}) {
  // const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState("");
  const [gaslessWallet, setGaslessWallet] = useState({});
  const [web3AuthProvider, setWeb3AuthProvider] = useState(null);
  const getContract = async () => {
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

    try {
      if (true) {
        const provider = new providers.Web3Provider(web3AuthProvider);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        // const { chainId } = await provider.getNetwork();
        const chainId = 3141;
        console.log("switch case for this case is: " + chainId);
        if (chainId === 3141) {
          const contract = new ethers.Contract(
            dataDaoFactoryContract,
            dataDaoFactory.abi,
            signer
          );
          return contract;
        } else {
          alert("Please connect to the Filecoin Hyperspace Network!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // ///to Deploy a smart contract
  // const deployContract = async (contractAbi, contractByteCode, deployArgs) => {
  //   const factory = new ContractFactory(contractAbi, contractByteCode);
  //   const contract = await factory.deploy(deployArgs);
  //   console.log(contract.address);
  //   return contract.address;
  // };

  // const deployToken = async (deployArgs) => {
  //   const address = deployContract(
  //     MembershipToken.abi,
  //     MembershipToken.data.bytecode,
  //     deployArgs
  //   );
  //   return address;
  // };

  // const deployDataDao = async (deployArgs) => {
  //   const address = deployContract(
  //     dataDaoInstace.abi,
  //     dataDaoInstace.data.bytecode,
  //     deployArgs
  //   );
  //   return address;
  // };

  const votingPeriodEpoch =
    Math.floor(dataDaoDetails.vote_period_day) * 86400 +
    Math.floor(dataDaoDetails.vote_period_hour) * 3600 +
    Math.floor(dataDaoDetails.vote_period_minutes) * 60;
  const { ethereum } = window;

  // const provider = new ethers.providers.Web3Provider(ethereum);
  // const signer = provider.getSigner();
  const provider = new providers.Web3Provider(web3AuthProvider);
  const signer = provider.getSigner();

  const luanchDataDao = async () => {
    const contract = await getContract();
    const tokecFactory = new ContractFactory(
      MembershipToken.abi,
      MembershipToken.data.bytecode,
      signer
    );
    // const tokenContract = await tokecFactory.deploy(
    //   dataDaoDetails.token_name,
    //   dataDaoDetails.token_symbol,
    //   10000
    // );

    const { data } = await tokecFactory.deploy(
      dataDaoDetails.token_name,
      dataDaoDetails.token_symbol,
      10000
    );
    const { taskId } = await gaslessWallet.sponsorTransaction(
      tokecFactory.address,
      data
    );

    const tokenAddress = taskId.address;

    console.log(tokenAddress);
    const daoFactory = new ContractFactory(
      dataDaoInstace.abi,
      dataDaoInstace.data.bytecode,
      signer
    );
    const { data2 } = await daoFactory.deploy(
      walletAddress,
      tokenAddress,
      dataDaoDetails.vote_condition,
      dataDaoDetails.vote_minapproval,
      votingPeriodEpoch,
      0
    );

    const { taskId1 } = await gaslessWallet.sponsorTransaction(
      daoFactory.address,
      data2
    );

    const dataDaoAddress = taskId1.address;

    const { data3 } = await contract.createDataDao(
      dataDaoAddress,
      dataDaoDetails.name,
      dataDaoDetails.description,
      tokenAddress,
      0,
      dataDaoDetails.token_holders[0].tokenHolderBalance
    );

    const { taskId3 } = await gaslessWallet.sponsorTransaction(
      contract.address,
      data3
    );
    const tx =
      // await tx.wait(); //dataDaoAddress,name, description, token, tokenPrice, totalSupply
      console.log(taskId3);
  };

  console.log(dataDaoDetails);

  return (
    <div className="create-dao-info-main">
      <h1>Review Information</h1>
      <div className="review-main">
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          sx={{ borderRadius: "10px", background: "#fefcfc" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            sx={{
              backgroundColor: "#1976d2",
              color: "#ffffff",
            }}
          >
            <Typography sx={{ width: "100%", flexShrink: 0 }}>
              DataDao Information
            </Typography>
            {/* <Typography sx={{ color: "text.secondary" }}>
              I am an accordion
            </Typography> */}
          </AccordionSummary>
          <AccordionDetails sx={{ padding: "30px" }}>
            <Typography sx={{ textAlign: "left", fontWeight: 700 }}>
              NAME
            </Typography>
            <Typography sx={{ textAlign: "left", margin: "10px 0px" }}>
              {dataDaoDetails.name}
            </Typography>
            <Typography
              sx={{
                textAlign: "left",
                fontWeight: 700,
              }}
            >
              DESCRIPTION
            </Typography>
            <Typography
              sx={{
                textAlign: "left",
                maxWidth: "100%",
                wordBreak: "break-all",
                margin: "10px 0px",
              }}
            >
              {dataDaoDetails.description}
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
          sx={{ borderRadius: "10px", background: "#fefcfc" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
            sx={{
              backgroundColor: "#1976d2",
              color: "#ffffff",
            }}
          >
            <Typography sx={{ width: "100%", flexShrink: 0 }}>
              Votting Settings
            </Typography>
            {/* <Typography sx={{ color: "text.secondary" }}>
              You are currently not an owner
            </Typography> */}
          </AccordionSummary>
          <AccordionDetails sx={{ padding: "30px" }}>
            <Typography sx={{ textAlign: "left", fontWeight: 700 }}>
              SUPPORT %
            </Typography>
            <Typography sx={{ textAlign: "left", margin: "10px 0px" }}>
              {dataDaoDetails.vote_condition} %
            </Typography>
            <Typography
              sx={{
                textAlign: "left",
                fontWeight: 700,
              }}
            >
              MINIMAL APPROVAL %
            </Typography>
            <Typography
              sx={{
                textAlign: "left",
                maxWidth: "100%",
                wordBreak: "break-all",
                margin: "10px 0px",
              }}
            >
              {dataDaoDetails.vote_minapproval} %
            </Typography>
            <Typography
              sx={{
                textAlign: "left",
                fontWeight: 700,
              }}
            >
              Voting Period
            </Typography>

            <Typography
              sx={{
                textAlign: "left",
                maxWidth: "100%",
                wordBreak: "break-all",
                margin: "10px 0px",
              }}
            >
              {dataDaoDetails.vote_period_day +
                " day, " +
                dataDaoDetails.vote_period_hour +
                " hours, " +
                dataDaoDetails.vote_period_minutes +
                " minutes. "}
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
          sx={{ borderRadius: "10px", background: "#fefcfc" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
            sx={{
              backgroundColor: "#1976d2",
              color: "#ffffff",
            }}
          >
            <Typography sx={{ width: "100%", flexShrink: 0 }}>
              Token Configuration
            </Typography>
            {/* <Typography sx={{ color: "text.secondary" }}>
              Filtering has been entirely disabled for whole web server
            </Typography> */}
          </AccordionSummary>
          <AccordionDetails sx={{ padding: "30px" }}>
            <Typography sx={{ textAlign: "left", fontWeight: 700 }}>
              TOKEN NAME & SYMBOL
            </Typography>
            <Typography sx={{ textAlign: "left", margin: "10px 0px" }}>
              {dataDaoDetails.token_name +
                " (" +
                dataDaoDetails.token_symbol +
                ")"}
            </Typography>
            <Typography
              sx={{
                textAlign: "left",
                fontWeight: 700,
              }}
            >
              TOKEN HOLDERS
            </Typography>
            <Typography
              sx={{
                textAlign: "left",
                margin: "10px 0px",
              }}
            >
              {dataDaoDetails.token_holders[0].tokenHolders +
                " - " +
                dataDaoDetails.token_holders[0].tokenHolderBalance}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="create-dao-back-next-parent">
        <button className="create-dao-back" onClick={handleBack}>
          Back
        </button>
        <button
          className="create-dao-next launch-dao"
          onClick={() => {
            luanchDataDao();
          }}
        >
          Launch DataDao
        </button>
      </div>
    </div>
  );
}

export default ReviewInfo;
