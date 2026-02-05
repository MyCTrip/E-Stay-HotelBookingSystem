import React from 'react';
import { Card, Avatar } from 'antd';

export const WelcomeCard: React.FC = () => {
  // 这里暂时写死，后续可以从全局 UserContext 或 Redux 中获取用户信息
  return (
    <Card variant="borderless" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar 
          size={64} 
          src="https://ui-avatars.com/api/?name=Admin&background=1890ff&color=fff" 
        />
        <div style={{ marginLeft: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
            早安，商户管理员，祝你开心每一天！
          </h2>
          <p style={{ color: '#888', margin: 0 }}>
            交互专家 | 易宿精选酒店集团－产品部
          </p>
        </div>
      </div>
    </Card>
  );
};