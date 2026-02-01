import React from 'react';
import { Link } from 'react-router-dom';
import RouterConfig from './router'; // 引入我们刚才写好的路由配置

const App: React.FC = () => {
  return (
    <div>
      {/* === 2. 页面内容显示区 (这里会根据路由自动切换显示 Login/Entry/Audit) === */}
      <RouterConfig />
    </div>
  );
};

export default App;