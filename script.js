window.addEventListener("load", function(e) {
    let header = document.querySelector("h3");
    let peerID = document.querySelector("#peer-id");
    let callBtn = document.querySelector("#call-peer");
    let remoteVideo = document.querySelector("#remote-video");
    let connectBtn = this.document.querySelector("#connect-btn");

    
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

    })

    callBtn.addEventListener("click",function(e) {
            navigator.mediaDevices.getDisplayMedia({
                video: true
            })
            .then(function(screenStream) {
                navigator.mediaDevices.getUserMedia({
                    audio: true
                })
                .then(function(audioStream) {
                    let [videoTrack] = screenStream.getVideoTracks();
                    let [audioTrack] = audioStream.getAudioTracks();
        
                    let combinedStream = new MediaStream([ videoTrack, audioTrack ]);
        
                    let call = peer.call(peerID.value, combinedStream);
                    call.on("stream", function(stream) {
                        addVideoToStream(stream);
                    })
                })
            })         
    })


    function addVideoToStream(stream) {
        remoteVideo.srcObject = stream;

        remoteVideo.load();
        remoteVideo.addEventListener('loadedmetadata', function () {
            if (remoteVideo.duration === Infinity) {
                remoteVideo.currentTime = 1e101;
                remoteVideo.ontimeupdate = function () {
                    remoteVideo.currentTime = 0;
                    remoteVideo.ontimeupdate = function () {
                        delete remoteVideo.ontimeupdate;
                        let isPlaying = (remoteVideo.currentTime > 0) && 
                                        (!remoteVideo.paused) && (!remoteVideo.ended) && (remoteVideo.readyState > 2);
                        if (isPlaying) {
                            remoteVideo.play();
                        }
                    };
                };
            }
        });
    }

})