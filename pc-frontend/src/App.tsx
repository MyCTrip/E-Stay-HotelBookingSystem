import React from 'react';
import { Link } from 'react-router-dom';
import RouterConfig from './router'; // 引入我们刚才写好的路由配置

const App: React.FC = () => {
  return (
    <div>
      {/* === 1. 临时导航栏 (只在开发阶段用，上线前删掉) ===
      <nav style={{ padding: '15px', background: '#e6f7ff', borderBottom: '1px solid #91d5ff', marginBottom: '20px' }}>
        <strong>🚧 快速通道: </strong>
        <Link to="/login" style={{ margin: '0 10px', fontWeight: 'bold' }}>去登录页</Link> | 
        <Link to="/merchant/entry" style={{ margin: '0 10px', fontWeight: 'bold' }}>去商户录入</Link> | 
        <Link to="/admin/audit" style={{ margin: '0 10px', fontWeight: 'bold' }}>去管理员审核</Link>
      </nav> */}

      {/* === 2. 页面内容显示区 (这里会根据路由自动切换显示 Login/Entry/Audit) === */}
      <RouterConfig />
    </div>
  );
};

export default App;