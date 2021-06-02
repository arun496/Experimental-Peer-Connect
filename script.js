window.addEventListener("load", function(e) {
    let header = document.querySelector("h3");
    let peerID = document.querySelector("#peer-id");
    let callBtn = document.querySelector("#call-peer");
    let remoteVideo = document.querySelector("#remote-video");
    let connectBtn = this.document.querySelector("#connect-btn");

    // let conn;
    // let peer_ID;
    
    // let peer = new Peer({
    //     config: {
    //         'iceServers': [
    //             { url: 'stun:stun1.l.google.com:19302' },
    //             {
    //                 url: 'turn:numb.viagenie.ca',
    //                 credential: 'muazkh',
    //                 username: 'webrtc@live.com'
    //             }
    //         ]
    //     }
    // });
    let peer = new Peer({
        config: {
            'iceServers': [
                { url: 'stun:stun1.l.google.com:19302' },
                {
                    url: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                }
            ]
        }
    });


    peer.on("open", function(id) {
        header.textContent = id;
    })


    peer.on("connection", function(connection) {
        alert(`Connection success with ${connection.peer}`);
    })

    connectBtn.addEventListener("click", function(e) {
        if (peerID.value) {
            header.textContent = `Connecting to peer...${peerID.value}`;
            peer.connect(peerID.value);
        }
        else {
            alert("Enter ID to connect with peer..");
        }
    })


    peer.on("call", function(call) {
        // let acceptCall = confirm("Receiving call from peer. Want to accept");

        // if (acceptCall) {
            navigator.mediaDevices.getUserMedia({
                video: true,
                auido: true
            })
            .then(function(videoStream) {
                call.answer(videoStream);
                call.on("stream", function(stream) {
                    addVideoToStream(stream);
                })
            })
            .catch(function(err) {
                console.log(err, "..media connection failed!!");
            })
        // }

    })

    callBtn.addEventListener("click", async function(e) {
        // if (peerID.value) {
            let screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            })
            let audioStream = await navigator.mediaDevices.getUserMedia({
                audio: true
            })

            let [videoTrack] = screenStream.getVideoTracks();
            let [audioTrack] = audioStream.getAudioTracks();

            let combinedStream = new MediaStream([ videoTrack, audioTrack ]);

            let call = peer.call(peerID.value, combinedStream);
            call.on("stream", function(stream) {
                addVideoToStream(stream);
            })
        // }
    })


    function addVideoToStream(stream) {
        remoteVideo.srcObject = stream;
    }


    
    
//     peer.on("open", function(id) {  // Each gets unique ID whoever open the application
//         header.textContent = id;
//     })

//     callBtn.addEventListener("click", function(e) {  // Call peer by click on the call button
//         let remotePeerID = peerID.value
//         header.textContent = `Connecting...${remotePeerID}`;
//         callPeer(remotePeerID);
//     })

//     function callPeer(remotePeerID) {   // OPeration to call and connect with peer
//         navigator.mediaDevices.getDisplayMedia({
//             video: true,
//             echoCancellation: true,
//             noiseSuppression: true
//         })
//         .then(async function(screenStream) {   // Get the caller's media stream
//             let audioStream = await navigator.mediaDevices.getUserMedia({
//                 audio: true
//             })
            
//             let [videoTrack] = screenStream.getVideoTracks();
//             let [audioTrack] = audioStream.getAudioTracks();

//             let combinedStream = new MediaStream([videoTrack, audioTrack]);  // Combine audio from usermedia and video from displayMedia(Screenshare)
//             let call = peer.call(remotePeerID, combinedStream);  // Call the peer with his ID, passing caller's(local) mediastream
//             call.on("stream", function(remoteStream) {  // When connection succesful with stream, adding peer's stream(callee) in remoteVideo of caller
//                 addCallerStream(remoteStream);
//             })
//         })
//         .catch(function(err) {
//             console.log(err, "..media connection failed!!");
//         })
//     }

//     function addCallerStream(remoteStream) {  // Adding stream to remote video container
//         remoteVideo.srcObject = remoteStream;
//         // remoteVideo.addEventListener('loadedmetadata', () => {
//             // remoteVideo.play()
//         // })

//         remoteVideo.load();
//         remoteVideo.addEventListener('loadedmetadata', function () {
//             if (remoteVideo.duration === Infinity) {
//                 remoteVideo.currentTime = 1e101;
//                 remoteVideo.ontimeupdate = function () {
//                     remoteVideo.currentTime = 0;
//                     remoteVideo.ontimeupdate = function () {
//                         delete remoteVideo.ontimeupdate;
//                         let isPlaying = (remoteVideo.currentTime > 0) && 
//                                         (!remoteVideo.paused) && (!remoteVideo.ended) && (remoteVideo.readyState > 2);
//                         if (isPlaying) {
//                             remoteVideo.play();
//                         }
//                     };
//                 };
//                }
//               });
//     }

//     function addCalleeStream(remoteStream) {  // Adding stream to remote video container
//         remoteVideo.srcObject = remoteStream;
//         // remoteVideo.addEventListener('loadedmetadata', () => {
//             // remoteVideo.play()
//         // })

//         remoteVideo.load();
//         remoteVideo.addEventListener('loadedmetadata', function () {
//             if (remoteVideo.duration === Infinity) {
//                 remoteVideo.currentTime = 1e101;
//                 remoteVideo.ontimeupdate = function () {
//                     remoteVideo.currentTime = 0;
//                     remoteVideo.ontimeupdate = function () {
//                         delete remoteVideo.ontimeupdate;
//                         let isPlaying = (remoteVideo.currentTime > 0) && 
//                                         (!remoteVideo.paused) && (!remoteVideo.ended) && (remoteVideo.readyState > 2);
//                         if (isPlaying) {
//                             remoteVideo.play();
//                         }
//                     };
//                 };
//                }
//               });
//     }

//     peer.on("call", function(call) {  // Peer receiving the call (callee)
//         navigator.mediaDevices.getUserMedia({
//             video: true,
//             audio: true
//         })
//         .then(function(localStream) {  // Get callee's stream
//             call.answer(localStream);  // Answering call from caller and sending callee's(self) stream to the caller
//             call.on("stream", function(remoteStream) {  // Adding the caller's stream in the remoteVideo of callee
//                 addCalleeStream(remoteStream);
//             })
//         })
//         .catch(function(err) {
//             console.log(err, "..media connection failed!!");
//         })
//     })


})