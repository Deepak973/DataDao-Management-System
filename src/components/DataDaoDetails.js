import React, { useState, useEffect, useRef } from "react";
import "../styles/daodetails.css";
import Button from "@mui/material/Button";
import dataDaoFactory from "../contracts/artifacts/dataDaoFactory.json";

import { ContractFactory, ethers } from "ethers";
import { Box, Modal } from "@mui/material";
import uploadfile from "../assets/upload.png";

const dataDaoFactoryContract = "0x0caC8C986452628Ed38483bcEE0D1cF85816946D";

function DataDaoDetails({
  datadaos,
  setDatadaos,
  setSingleDataDao,
  setYourDaos,
  yourDaos,
  daoAddress,
}) {
  const inputRef = useRef();
  const inputRefEnd = useRef();
  const fileInputRef = useRef();
  const [showCreateProposal, setCreateProposal] = useState(false);
  const handleOpen2 = () => setCreateProposal(true);
  const handleClose2 = () => setCreateProposal(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,

    boxShadow: 24,
    p: 4,
  };
  const { ethereum } = window;

  const [dataDaoInfo, setDataDaoInfo] = useState([]);

  const getContract = async () => {
    try {
      console.log("in");
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const { chainId } = await provider.getNetwork();
        console.log("switch case for this case is: " + chainId);
        if (chainId === 3141) {
          const contract = new ethers.Contract(
            dataDaoFactoryContract,
            dataDaoFactory.abi,
            provider
          );
          console.log(contract);
          return contract;
        } else {
          alert("Please connect to the Mumbai Testnet Network!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDataDaos = async () => {
    const contract = await getContract();
    const dataDao = await contract.allDataDaos(daoAddress);
    setDataDaoInfo(dataDao);
    // console.log(dataDao);
  };

  useEffect(() => {
    getDataDaos();
  }, []);

  return (
    <>
      <div className="datadao-details-main-div">
        <div className="datadao-details-div">
          <div className="datadao-details-section1">
            <div className="button-flex">
              <h1 className="datadao-details-title padding-div">
                {dataDaoInfo.dataDaoName}
              </h1>
              <button
                className="datadao-details-btn-close"
                onClick={() => {
                  setDatadaos(true);
                  setSingleDataDao(false);
                }}
              >
                Go Back
              </button>
            </div>
            <p className="datadao-details-desc padding-div width-peragraph">
              {dataDaoInfo.dataDaoDescription}
            </p>
            <div className="dao-details-flext">
              <table className="dao-details-table">
                <thead>
                  <tr>
                    <th>Token Name</th>
                    <th>No of Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Something</td>
                    <td>100</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="datadao-details-button padding-div">
              <button className="datadao-details-btn-close">Buy Token</button>
            </div>
          </div>

          <div className="datadao-details-section2">
            <h1 className="datadao-details-dataset">Available Dataset</h1>
            <div className="dataset-main-flex">
              <table className="dataset-main-table">
                <thead>
                  <tr>
                    <div className="daodetails-proposal-name">
                      <th colSpan={2}>Name of Proposal</th>
                    </div>
                  </tr>
                </thead>
                <div className="padding-div">
                  <tr>
                    <td>
                      <p className=" width-peragraph">
                        "Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex
                        ea commodo consequat.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <h4 className=" width-peragraph">uploaded file</h4>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4 className="width-peragraph">23/10/2022</h4>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button className="datadao-details-extra-btn">
                        Request Dataset
                      </button>
                    </td>
                  </tr>
                </div>
              </table>
            </div>
          </div>
        </div>
        <Modal
          open={showCreateProposal}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="create-proposal-parent-div">
            <div className="create-proposal-main-div">
              <div>
                <h1 className="create-proposal-title">New Proposal</h1>
                <p className="create-proposal-desc">
                  Enter the details of a new proposal and submit them.
                </p>

                <div className="create-proposal-div">
                  <label className="create-proposal-label">Title</label>
                  <div className="textfields-width">
                    <input type="text" />{" "}
                  </div>
                  <label className="create-proposal-label">Description</label>
                  <div className="textfields-width">
                    <textarea rows="70" type="text" className="desc-height" />
                  </div>{" "}
                  <label className="create-proposal-label">Upload File</label>
                  <div
                    className="proposal-margin-div"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {/* <div>
                      <label className="create-proposal-label">
                        Upload File/Folder
                      </label>
                    </div> */}
                    <img src={uploadfile} alt="upload" />
                    <input type="file" hidden ref={fileInputRef} />
                  </div>
                  <label className="create-proposal-label">Proposal Date</label>
                  <div className="start-end-div">
                    <input
                      type="text"
                      className="proposal-date"
                      placeholder="Start-Date"
                      ref={inputRef}
                      onChange={(e) => console.log(e.target.value)}
                      onFocus={() => (inputRef.current.type = "date")}
                      onBlur={() => (inputRef.current.type = "text")}
                    />
                    <input
                      type="text"
                      className="proposal-date  proposal-date1"
                      placeholder="End-Date"
                      ref={inputRefEnd}
                      onChange={(e) => console.log(e.target.value)}
                      onFocus={() => (inputRefEnd.current.type = "date")}
                      onBlur={() => (inputRefEnd.current.type = "text")}
                    />
                  </div>
                  <div className="uploadfile textfields-width">
                    <button className="create-proposal-btn-popup">
                      Create Proposal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
}
export default DataDaoDetails;
