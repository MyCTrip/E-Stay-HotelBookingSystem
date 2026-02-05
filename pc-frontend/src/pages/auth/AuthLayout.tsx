import React from 'react';
import { Card } from 'antd';
import styles from './AuthLayout.module.scss';

const AuthLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1>易宿酒店管理系统</h1>
        <p>面向商家与管理员的酒店管理与审核平台</p>
      </div>
      <div className={styles.right}>
        <Card className={styles.card} variant="borderless">
          {children}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
