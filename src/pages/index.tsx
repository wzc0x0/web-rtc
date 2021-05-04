import { useEffect, useState } from 'react';
import { Card, Space, Button, Badge } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

import Receive from '@/components/Receive';
import Send from '@/components/Send';
import socket from '@/utils/socketClient';

export default () => {
  const [switchStatus, setSwitchStaus] = useState(true);
  const [isConnectStatus, setConnectStatus] = useState(socket.connected);
  useEffect(() => {
    socket.on('connect', () => {
      setConnectStatus(true);
    });
    socket.on('disconnect', () => {
      setConnectStatus(false);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  });
  return (
    <Card
      title={
        <div>
          <Badge status={isConnectStatus ? 'success' : 'error'} />
          {isConnectStatus ? '已连接' : '未连接'}
        </div>
      }
      extra={
        <Space>
          <Button
            type="link"
            icon={<SwapOutlined />}
            onClick={() => setSwitchStaus((state: boolean) => !state)}
          >
            {switchStatus ? '切换接收者' : '切换发送者'}
          </Button>
        </Space>
      }
    >
      {switchStatus ? <Send socket={socket} /> : <Receive socket={socket} />}
    </Card>
  );
};
