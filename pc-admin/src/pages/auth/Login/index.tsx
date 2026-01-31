import React from 'react';
import { Card, Button, Form, Input } from 'antd';
import styles from './index.module.scss'; // 稍后创建这个样式文件

const Login: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('登录信息:', values);
  };

  return (
    <div className={styles.container}>
      <Card title="易宿酒店管理系统" style={{ width: 400 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item label="账号" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>登录</Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;