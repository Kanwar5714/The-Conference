import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Room.css"; // Import CSS

const socket = io("http://127.0.0.1:5000");

function Room() {
  const [roomId, setRoomId] = useState(null);
  const [status, setStatus] = useState("Searching for a partner...");
  const [inCall, setInCall] = useState(false);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function initMediaAndJoin() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localVideoRef.current.srcObject = stream;
        await joinQueue();
      } catch (error) {
        console.error("Media error: ", error);
        setStatus("Error accessing camera/microphone!");
      }
    }
    initMediaAndJoin();

    socket.on("matched", async (data) => {
      setRoomId(data.room_id);
      setStatus("Connected! Setting up call...");
      setInCall(true);
      createPeerConnection(data.room_id, true);
    });

    socket.on("offer", async (data) => {
      setRoomId(data.room_id);
      createPeerConnection(data.room_id, false);

      await peerConnection.current.setRemoteDescription(data.offer);
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer", { room_id: data.room_id, answer });
      setStatus("Connected!");
      setInCall(true);
    });

    socket.on("answer", async (data) => {
      await peerConnection.current.setRemoteDescription(data.answer);
      setStatus("Connected!");
      setInCall(true);
    });

    socket.on("ice-candidate", async (data) => {
      try {
        await peerConnection.current.addIceCandidate(data.candidate);
      } catch (err) {
        console.error("Error adding ICE candidate", err);
      }
    });

    socket.on("partner_left", () => {
      setStatus("Partner left. Searching again...");
      endCurrentCall();
      joinQueue();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  async function joinQueue() {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();
    socket.emit("join_queue", { token });
    setStatus("Searching for a partner...");
    setInCall(false);
  }

  function createPeerConnection(room_id, isCaller) {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const localStream = localVideoRef.current.srcObject;
    localStream.getTracks().forEach((track) =>
      peerConnection.current.addTrack(track, localStream)
    );

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
      setInCall(true);
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { room_id, candidate: event.candidate });
      }
    };

    if (isCaller) {
      peerConnection.current.createOffer().then((offer) => {
        peerConnection.current.setLocalDescription(offer);
        socket.emit("offer", { room_id, offer });
      });
    }
  }

  function endCurrentCall() {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setRoomId(null);
    setInCall(false);
    remoteVideoRef.current.srcObject = null;
  }

  function handleNext() {
    endCurrentCall();
    joinQueue();
  }

  async function handleLeave() {
    endCurrentCall();
    const auth = getAuth();
    await signOut(auth);
    navigate("/");
  }

  return (
    <div className="room-container">
      <h2>{status}</h2>
      <div className="video-section">
        <video ref={localVideoRef} autoPlay muted />
        <video ref={remoteVideoRef} autoPlay />
      </div>

      <div className="button-section">
        <button className="leave-btn" onClick={handleLeave}>
          Leave
        </button>
        {inCall && (
          <button className="next-btn" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Room;
