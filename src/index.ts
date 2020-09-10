const connectButton = document.getElementById("connectButton");
const disconnectButton = document.getElementById("disconnectButton");
const sendButton = document.getElementById("sendButton");
const messageInputBox = document.getElementById("message");
const receiveBox = document.getElementById("receivebox");

connectButton.addEventListener("click", connectPeers, false);
disconnectButton.addEventListener("click", disconnectPeers, false);
sendButton.addEventListener("click", sendMessage, false);

// Set event listeners for user interface widgets
let localConn = null,
  remoteConn = null,
  sendChan = null,
  receiveChan = null;

function connectPeers() {
  localConn = new RTCPeerConnection();
  sendChan = localConn.createDataChannel("msg");
  sendChan.onopen = handleSendChannelStatusChange;
  sendChan.onclose = handleSendChannelStatusChange;

  remoteConn = new RTCPeerConnection();
  remoteConn.ondatachannel = receiveChannel;

  localConn.onicecandidate = (e) =>
    !e.candidate ||
    remoteConn.addIceCandidate(e.candidate).catch(handleAddCandidateError);

  remoteConn.onicecandidate = (e) =>
    !e.candidate ||
    localConn.addIceCandidate(e.candidate).catch(handleAddCandidateError);

  localConn
    .createOffer()
    .then((offer) => localConn.setLocalDescription(offer))
    .then(() => remoteConn.setRemoteDescription(localConn.localDescription))
    .then(() => remoteConn.createAnswer())
    .then((answer) => remoteConn.setLocalDescription(answer))
    .then(() => localConn.setRemoteDescription(remoteConn.localDescription))
    .catch((err) => {
      console.log(err);
    });
}

function sendMessage() {
  const message = messageInputBox.value;
  sendChan.send(message);

  // Clear the input box and re-focus it, so that we're
  // ready for the next message.

  messageInputBox.value = "";
  messageInputBox.focus();
}

function receiveChannel(evt) {
  receiveChan = evt.channel;
  receiveChan.onmessage = handleReceiveMessage;
  receiveChan.onopen = handleReceiveChannelStatusChange;
  receiveChan.onclose = handleReceiveChannelStatusChange;
}

function handleSendChannelStatusChange(event) {
  if (sendChan) {
    const state = sendChan.readyState;

    if (state === "open") {
      messageInputBox.disabled = false;
      messageInputBox.focus();
      sendButton.disabled = false;
      disconnectButton.disabled = false;
      connectButton.disabled = true;
    } else {
      messageInputBox.disabled = true;
      sendButton.disabled = true;
      connectButton.disabled = false;
      disconnectButton.disabled = true;
    }
  }
}

function handleAddCandidateError() {
  console.log("error");
}

function handleReceiveMessage(evt) {
  const el = document.createElement("p");
  const txtNode = document.createTextNode(evt.data);

  el.appendChild(txtNode);
  receiveBox.appendChild(el);
}

function handleReceiveChannelStatusChange(event) {
  if (receiveChan) {
    console.log(
      "Receive channel's status has changed to " + receiveChan.readyState
    );
  }

  // Here you would do stuff that needs to be done
  // when the channel's status changes.
}

function disconnectPeers() {
  // Close the RTCDataChannels if they're open.

  sendChan.close();
  receiveChan.close();

  // Close the RTCPeerConnections

  localConn.close();
  remoteConn.close();

  sendChan = null;
  receiveChan = null;
  localConn = null;
  remoteConn = null;

  // Update user interface elements

  connectButton.disabled = false;
  disconnectButton.disabled = true;
  sendButton.disabled = true;

  messageInputBox.value = "";
  messageInputBox.disabled = true;
}
