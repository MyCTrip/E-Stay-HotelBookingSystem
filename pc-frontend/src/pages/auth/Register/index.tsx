import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../AuthLayout';
import styles from './index.module.scss';
import { authService } from '@/services/auth';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string; confirm?: string }) => {
    try {
      await authService.register(values.email, values.password);
      message.success('注册成功，请登录');
      navigate('/login');
    } catch {
      // 错误提示由 request 拦截器处理
    }
  };

  return (
    <AuthLayout>
      <div className={styles.formContainer}>
        <h2 className={styles.formHeader}>
          <UserAddOutlined className={styles.headerIcon} /> 商户注册
        </h2>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item label="邮箱" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_: unknown, value: string) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Button className={styles.submitButton} htmlType="submit" block>
            注册
          </Button>

          <div style={{ marginTop: 12, textAlign: 'center' }}>
            已有账号？ <Link to="/login">去登录</Link>
          </div>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default Register;
