import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../AuthLayout';
import styles from './index.module.scss';
import { authService } from '@/services/auth';
import { setToken, removeToken } from '@/utils/storage';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { token } = await authService.login(values.email, values.password);
      setToken(token);
      // 请求当前用户信息以判断角色
      const me = await authService.me();
      localStorage.setItem('user', JSON.stringify(me));
      const role = (me as Record<string, unknown>).role as string | undefined;
      message.success('登录成功');
      if (role === 'admin') {
        navigate('/admin/audit', { replace: true });
      } else {
        navigate('/merchant/entry', { replace: true });
      }
    } catch {
      removeToken();
      // 错误提示由 request 拦截器处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.formContainer}>
        <h2 className={styles.formHeader}>
          <UserOutlined className={styles.headerIcon} /> 登录
        </h2>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item label="邮箱" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Button className={styles.submitButton} htmlType="submit" block loading={loading}>
            登录
          </Button>

          <div style={{ marginTop: 12, textAlign: 'center' }}>
            还没有账号？ <Link to="/register">注册商户账号</Link>
          </div>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default Login;
