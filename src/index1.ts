const searchParams = new URLSearchParams(location.search);
const isClient = searchParams.has("client");

let dataChan;

const server = async () => {
  const peerConn = new RTCPeerConnection();
  dataChan = peerConn.createDataChannel("msg");
  dataChan.onopen = (e) => {
    dataChan.send("aaaaa");
  };
};

const client = () => {
  const peerConn = new RTCPeerConnection();
  peerConn.addEventListener("datachannel", (e) => {
    const dataChan = e.channel;
    dataChan.onmessage = (evt) => {
      console.log(evt.data);
    };
  });
};

isClient ? client() : server();

document.getElementById("send").addEventListener("click", () => {
  const value = document.getElementById("ipt").value.trim();
  switch (dataChan.readyState) {
    case "connecting":
      console.log("Connection not open;");
      break;
    case "open":
      dataChan.send(value);
      break;
    case "closing":
      console.log("Attempted to send message while closing: ");
      break;
    case "closed":
      console.log("Error! Attempt to send while connection closed.");
      break;
  }
});
