window.addEventListener("load", function(e) {
    let peer = new Peer();
    let header = document.querySelector("h3");
    let peerID = document.querySelector("#peer-id");
    let callBtn = document.querySelector("#call-peer");
    let remoteVideo = document.querySelector("#remote-video");

    peer.on("open", function(id) {  // Each gets unique ID whoever open the application
        header.textContent = id;
    })

    callBtn.addEventListener("click", function(e) {  // Call peer by click on the call button
        let remotePeerID = peerID.value
        header.textContent = `Connecting...${remotePeerID}`;
        callPeer(remotePeerID);
    })

    function callPeer(remotePeerID) {   // OPeration to call and connect with peer
        navigator.mediaDevices.getDisplayMedia({
            video: true,
            echoCancellation: true,
            noiseSuppression: true
        })
        .then(async function(screenStream) {   // Get the caller's media stream
            let audioStream = await navigator.mediaDevices.getUserMedia({
                audio: true
            })
            
            let [videoTrack] = screenStream.getVideoTracks();
            let [audioTrack] = audioStream.getAudioTracks();

            let combinedStream = new MediaStream([videoTrack, audioTrack]);  // Combine audio from usermedia and video from displayMedia(Screenshare)
            let call = peer.call(remotePeerID, combinedStream);  // Call the peer with his ID, passing caller's(local) mediastream
            call.on("stream", function(remoteStream) {  // When connection succesful with stream, adding peer's stream(callee) in remoteVideo of caller
                addRemoteVideoStream(remoteStream);
            })
        })
        .catch(function(err) {
            console.log(err, "..media connection failed!!");
        })
    }

    function addRemoteVideoStream(remoteStream) {  // Adding stream to remote video container
        remoteVideo.srcObject = remoteStream;
    }

    peer.on("call", function(call) {  // Peer receiving the call (callee)
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        .then(function(localStream) {  // Get callee's stream
            call.answer(localStream);  // Answering call from caller and sending callee's(self) stream to the caller
            call.on("stream", function(remoteStream) {  // Adding the caller's stream in the remoteVideo of callee
                addRemoteVideoStream(remoteStream);
            })
        })
        .catch(function(err) {
            console.log(err, "..media connection failed!!");
        })
    })


})