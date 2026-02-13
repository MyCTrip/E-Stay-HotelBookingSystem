import React, { useMemo } from 'react';
import { Card } from 'antd';
import styles from './AuthLayout.module.scss';

const AuthLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // 使用 useMemo 包装随机数生成，避免在 render 时触发不纯函数警告
  const stars = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.pow(Math.random(), 2.5) * 55,
      size: 0.6 + Math.random() * 1.1,
    }));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {/* 星空容器 */}
        <div className={styles.starfield}>
          {stars.map((star) => (
            <div
              key={star.id}
              className={styles.star}
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animation: `twinkle ${star.duration}s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
        <div className={styles.hero}>
          <h1>易宿酒店管理系统</h1>
          <p>面向商家与管理员的酒店管理与审核平台</p>
        </div>
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
