import { message, Upload, Button, Row, Col, Space } from 'antd';
import { InboxOutlined, PoweroffOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { randomStr } from '@/utils/utils';
import socket from '@/utils/socketClient';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

const { Dragger } = Upload;
const pc = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
});
let channel: RTCDataChannel;
const initCall = () => {
  channel = pc.createDataChannel('msg');
  channel.onopen = () => {
    console.log('msg open');
    channel.send('sb is there?');
  };
  channel.onmessage = (e) => {
    console.log('msg', e.data);
  };
  channel.onerror = () => {
    //TODO 重连
  };
};

export interface SendProps {
  style?: React.CSSProperties;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}
let candidate: RTCIceCandidate;
let lock = true;
export default (props: SendProps) => {
  const { socket } = props;
  const [roomId, setRoomId] = useState<string>('');
  /* useEffect(() => {
    socket.on('connect', () => {
      console.log('连上了');
      socket.emit('getRoomId');
      pc.onicecandidate = (e) => {
        console.log('ice生成');
        if (e.candidate) {
          console.log('candidate', JSON.stringify(e.candidate));
          candidate = e.candidate;
          // canArea.value = JSON.stringify(e.candidate);
          socket.emit('candidate', JSON.stringify(e.candidate));
        }
      };
      pc.onnegotiationneeded = () => {
        console.log('开始协商');
        pc.createOffer().then((offer) => {
          console.log('offer', JSON.stringify(offer));
          socket.emit('offer', JSON.stringify(offer));
          return pc.setLocalDescription(offer);
        });
      };
    });

    socket.on('receiveAnswer', (offer: string) => {
      pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
      pc.addIceCandidate(candidate);
    });
    socket.on('disconnect', () => {
      // setIsConnected(false);
      console.log('断了');
    });
    socket.on('roomId', (roomId: string) => {
      // console.log(roomId);
      setRoomId(roomId);
    });
    socket.on('reciveConnect', () => {
      // setLastMessage(data);
      console.log('对方连上了');
      initCall();
    });

    return () => {
      socket.off('connect');
      socket.off('reciveConnect');
      socket.off('receiveAnswer');
      socket.off('roomId');
      socket.off('disconnect');
    };
  }); */

  const onStart = () => {
    socket.emit('getRoomId');
    socket.on('roomId', (roomId: string) => {
      setRoomId(roomId);
    });
    socket.on('receiveConnect', () => {
      console.log('对方连上了');
      initCall();
    });
    socket.on('answer', (offer: string) => {
      console.log('收到ans');
      pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
      pc.addIceCandidate(candidate);
    });
    pc.onicecandidate = (e) => {
      console.log('ice生成');
      if (e.candidate) {
        console.log('candidate', JSON.stringify(e.candidate));
        candidate = e.candidate;
        // canArea.value = JSON.stringify(e.candidate);
        socket.emit('candidate', JSON.stringify(e.candidate));
      }
    };
    pc.onnegotiationneeded = () => {
      console.log('开始协商');
      pc.createOffer().then((offer) => {
        console.log('offer', JSON.stringify(offer));
        socket.emit('offer', JSON.stringify(offer));
        return pc.setLocalDescription(offer);
      });
    };
  };

  const draggerProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <div style={props.style}>
      {/* <Button onClick={initCall}>开始连接</Button>
      <div>
        我是发送者<span>房间号：</span>
        {roomId}
      </div> */}
      <Row justify="center" align="middle" style={{ height: '40vh' }}>
        <Col style={{ textAlign: 'center' }}>
          {roomId ? (
            <span>请对方输入连接码：{roomId}</span>
          ) : (
            <a onClick={onStart}>
              <Space direction="vertical" size="large">
                <PoweroffOutlined style={{ fontSize: 48 }} />
                <div>我是发送者点击开始</div>
              </Space>
            </a>
          )}
        </Col>
      </Row>
      {/* <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
      </Dragger> */}
    </div>
  );
};
