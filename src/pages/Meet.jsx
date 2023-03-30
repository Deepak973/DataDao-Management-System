import "../styles/Huddle.scss";
import {
  HuddleClientProvider,
  getHuddleClient,
} from "@huddle01/huddle01-client";
import { BsFillCameraFill } from "react-icons/bs";
import { BiCameraOff } from "react-icons/bi";
import { BsPersonPlusFill } from "react-icons/bs";
import { BsStopCircle } from "react-icons/bs";
import { BsPlayCircleFill } from "react-icons/bs";
import { TbPhonePlus } from "react-icons/tb";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHuddleStore } from "@huddle01/huddle01-client/store";
import PeerVideoAudioElem from "./PeerVideoAudioElem";
import MeVideoElem from "./MeVideoElem";

function Meet() {
  const [join, setjoin] = useState();

  const toastInfo = () => toast.success("meeting join successful");
  const recording = () => toast.info("Recording in progress");
  const recordingStop = () => toast.info("Recording stopped");
  const huddleClient = getHuddleClient(
    "e08615386cafcb84c1ba2bb8cfde9a66454f50f624b8bde56bd1f5099ca3cf3b"
  );
  const roomId = useHuddleStore((state) => state.roomState.roomId);
  // const isCamPaused = useHuddleStore((state) => state.isCamPaused);

  const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
  const lobbyPeers = useHuddleStore((state) => state.lobbyPeers);
  const roomState = useHuddleStore((state) => state.roomState);
  const recordingState = useHuddleStore((state) => state.recordingState);
  const recordings = useHuddleStore((state) => state.recordings);
  // console.log(roomId)
  const joined = () => toast.warning("already joined");

  const handleJoin = async () => {
    try {
      await huddleClient.join("dev", {
        address: "0x15900c698ee356E6976e5645394F027F0704c8Eb",
        wallet: "",
        ens: "axit.eth",
      });
      console.log("joined");

      if (!roomState.joined) {
        toastInfo();
      } else {
        joined();
      }

      console.log(Response);
    } catch (error) {
      console.log({ error });
    }
  };
  // const useHost = ({peerId}) => {

  return (
    <HuddleClientProvider value={huddleClient}>
      <div className="meet-main">
        <div className="video-control">
          <MeVideoElem />
          <div className="card">
            <button className="button" onClick={handleJoin}>
              <TbPhonePlus />
            </button>
            <button
              className="button"
              onClick={() => huddleClient.enableWebcam()}
            >
              <BsFillCameraFill />
            </button>
            <button
              className="button"
              onClick={() => huddleClient.disableWebcam()}
            >
              <BiCameraOff />
            </button>
            <button
              className="button"
              onClick={() => huddleClient.allowAllLobbyPeersToJoinRoom()}
            >
              <BsPersonPlusFill />
            </button>
            <button
              className="button"
              onClick={() =>
                // will not work in localhost
                huddleClient.startRecording({
                  sourceUrl: window.location.href,
                })
              }
            >
              <BsPlayCircleFill />
            </button>
            <button
              className="button"
              onClick={() => huddleClient.stopRecording({ ipfs: true })}
            >
              <BsStopCircle />
            </button>
          </div>
        </div>
        <div className="peers-screens">
          {lobbyPeers[0] && <h2>Lobby Peers</h2>}
          <div>
            {lobbyPeers.map((peer) => (
              <div>{peer.peerId}</div>
            ))}
          </div>
          <h2 style={{ textAlign: "center" }}>Peers</h2>
          {/* {isCamPaused === peerId ? "Host" : "Not Host"} */}
          {peersKeys[0] ? (
            <div className="peers-grid">
              {peersKeys.map((key) => (
                <PeerVideoAudioElem
                  key={`peerId-${key}`}
                  peerIdAtIndex={key}
                  className="peer-video-screen"
                />
              ))}
            </div>
          ) : (
            <h3
              style={{
                textAlign: "center",
                color: "#fefcfc",
                margin: "40px auto",
              }}
            >
              Create a meeting or joined a meeting
            </h3>
          )}
        </div>
        {/* <h2 className={`text-${!roomState.joined ? "red" : "green"}`}>
            Room Joined:&nbsp;{roomState.joined.toString()}
          </h2>
​
          <div className="text-blue">
            <h2>Recording State</h2>
            <h3>inProgress: {recordingState.inProgress.toString()}</h3>
            <h3>processing: {recordingState.processing.toString()}</h3>
            <h3>started: {recordingState.started.toString()}</h3>
            <h3>recordings: {JSON.stringify(recordings)}</h3>
          
          </div> */}

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </HuddleClientProvider>
  );
}
export default Meet;
