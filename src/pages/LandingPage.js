import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.scss";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import heroimg from "../assets/hero_image.jpg";
import heroimg2 from "../assets/hero_image_2.png";

function LandingPage() {
  const navigate = useNavigate();
  const openCreateDaoPage = () => {
    navigate("/create-data-dao/select-template");
  };
  const openExistingDaoPage = () => {
    navigate("/open-existing-data-dao");
  };

  /// lighthouse encrypted upload *************************************************************

  const encryptionSignature = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage,
      publicKey: address,
    };
  };
  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  /* Deploy file along with encryption */
  const deployEncrypted = async (e) => {
    /*
       uploadEncrypted(e, publicKey, accessToken, uploadProgressCallback)
       - e: js event
       - publicKey: wallets public key
       - accessToken: your api key
       - signedMessage: message signed by the owner of publicKey
       - uploadProgressCallback: function to get progress (optional)
    */
    const sig = await encryptionSignature();
    const response = await lighthouse.uploadEncrypted(
      e,
      sig.publicKey,
      "710d524c-69dd-4666-93dc-54d7107d1172",
      sig.signedMessage,
      progressCallback
    );
    console.log(response);
    /*
      output:
        {
          Name: "c04b017b6b9d1c189e15e6559aeb3ca8.png",
          Size: "318557",
          Hash: "QmcuuAtmYqbPYmPx3vhJvPDi61zMxYvJbfENMjBQjq7aM3"
        }
      Note: Hash in response is CID.
    */
  };

  // lighthouse decrypt the file function ********************************************************

  const [fileURL, setFileURL] = React.useState(null);

  const sign_auth_message = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const publicKey = (await signer.getAddress()).toLowerCase();
    const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return { publicKey: publicKey, signedMessage: signedMessage };
  };

  /* Decrypt file */
  const decrypt = async () => {
    // Fetch file encryption key
    const cid = "QmQEaxRkiCPjBmoHy452rgKxLhPaaMmyHoQyVG31Thh4Jp"; //replace with your IPFS CID
    const { publicKey, signedMessage } = await sign_auth_message();
    console.log(signedMessage);
    /*
      fetchEncryptionKey(cid, publicKey, signedMessage)
        Parameters:
          CID: CID of the file to decrypt
          publicKey: public key of the user who has access to file or owner
          signedMessage: message signed by the owner of publicKey
    */
    const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      publicKey,
      signedMessage
    );

    // Decrypt file
    /*
      decryptFile(cid, key, mimeType)
        Parameters:
          CID: CID of the file to decrypt
          key: the key to decrypt the file
          mimeType: default null, mime type of file
    */

    const fileType = "image/jpeg";
    const decrypted = await lighthouse.decryptFile(
      cid,
      keyObject.data.key,
      fileType
    );
    console.log(decrypted);
    /*
      Response: blob
    */

    // View File
    const url = URL.createObjectURL(decrypted);
    console.log(url);
    setFileURL(url);
  };

  /// lighthouse file share to a particular address function code **********************************************

  const shareFile = async () => {
    // file cid which we want to share with others
    const cid = "QmSrwUGc6uqAwZWNEuwy5kBW4fJNRzgyS3WN8qaEvE3skK";

    // Then get auth message and sign
    // Note: message should be signed by owner of file.
    const { publicKey, signedMessage } = await sign_auth_message();

    /// addresses who can use open this file
    const publicKeyUserB = [
      "0x97861976283e6901b407D1e217B72c4007D9F64D",
      "0x054ae6107cAadC187c304de87365bc52F8c2ADB9",
    ];

    const res = await lighthouse.shareFile(
      publicKey,
      publicKeyUserB,
      cid,
      signedMessage
    );

    console.log(res);
    /*
    data: {
      cid: "QmTTa7rm2nMjz6wCj9pvRsadrCKyDXm5Vmd2YyBubCvGPi",
      shareTo: "0x201Bcc3217E5AA8e803B41d1F5B6695fFEbD5CeD"
    }
  */
    /*Visit: 
      https://files.lighthouse.storage/viewFile/<cid>  
    To view encrypted file
  */
  };

  return (
    <>
      <section className="hero">
        <div className="gradient-3"></div>
        <div className="gradient-4"></div>
        <img src={heroimg2} alt="hero" className="hero-image" />
        <div className="hero-img-overlay"></div>
        <h1>Welcome to the DataDao Management System</h1>
        <p>Create your own DataDao in few minutes with ease.</p>

        <div className="hero-btns">
          <button
            className="create-dao-btn"
            onClick={() => openCreateDaoPage()}
          >
            Create DataDao
          </button>
          <button
            className="existing-dao-btn"
            onClick={() => openExistingDaoPage()}
          >
            Open Existing DataDao
          </button>
        </div>
      </section>
      {/* <div className="second-section">
        <h1>Upload file to encrypt</h1>
        <input onChange={(e) => deployEncrypted(e)} type="file" />

        <h1>Decrypt file and view it</h1>
        <button onClick={() => decrypt()}>decrypt</button>
        {fileURL ? (
          <>
            <a href={fileURL} target="_blank" rel="noreferrer">
              viewFile
            </a>
            <img src={fileURL} alt="view" />
          </>
        ) : null}

        <h1> Share file to address</h1>
        <button onClick={() => shareFile()}>share file</button>
      </div> */}
    </>
  );
}

export default LandingPage;
