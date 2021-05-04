import { Form, Input, Button } from 'antd';
import socket from '@/utils/socketClient';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

const pc = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
});
let myChannel: RTCDataChannel;

export interface ReceiveProps {
  style?: React.CSSProperties;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}
export default (props: ReceiveProps) => {
  const { socket } = props;
  const [form] = Form.useForm();
  /* useEffect(() => {
    socket.on('connect', () => {
      console.log('连上了');
    });
    socket.on('disconnect', () => {
      console.log('断了');
    });
    socket.on('candidate', (candidate: string) => {
      pc.addIceCandidate(JSON.parse(candidate));
    });
    socket.on('offer', (offer: string) => {
      pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
      pc.createAnswer().then((answer) => {
        pc.setLocalDescription(answer);
        console.log('ans', JSON.stringify(answer));
        socket.emit('receiveAnswer', JSON.stringify(answer));
      });
    });

    return () => {
      socket.off('connect');
      socket.off('candidate');
      socket.off('offer');
      socket.off('disconnect');
    };
  }); */

  const onFinish = (value: any) => {
    const { roomId } = value;
    console.log(roomId);
    socket.emit('join', roomId);
    socket.on('candidate', (candidate: string) => {
      console.log('收到can');
      pc.addIceCandidate(JSON.parse(candidate));
    });
    socket.on('offer', (offer: string) => {
      pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
      pc.createAnswer().then((answer) => {
        pc.setLocalDescription(answer);
        console.log('ans', JSON.stringify(answer));
        socket.emit('answer', JSON.stringify(answer));
      });
    });
    pc.ondatachannel = ({ channel }) => {
      myChannel = channel;
      channel.onmessage = (e) => {
        console.log('data:', e.data);
        alert(e.data);
      };
    };
  };
  return (
    <div style={props.style}>
      <Form onFinish={onFinish} form={form}>
        <Form.Item
          label="我是接收方请输入连接码"
          name="roomId"
          rules={[{ required: true, message: '请输入连接码!' }]}
        >
          <Input placeholder="请输入连接码" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            连接
          </Button>
        </Form.Item>
      </Form>
      <Button onClick={() => myChannel.send("sb i'm here")}>测试</Button>
    </div>
  );
};
