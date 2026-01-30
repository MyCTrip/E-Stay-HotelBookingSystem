// src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';


import Login from './pages/auth/Login';
import HotelEntry from './pages/merchant/HotelEntry';
import HotelAudit from './pages/admin/HotelAudit';

function App() {
  return (
    <div>
      {/* 临时导航栏，方便测试 */}
      <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px' }}>
        <strong>临时导航: </strong>
        <Link to="/login" style={{ marginRight: '10px' }}>去登录</Link> | 
        <Link to="/merchant/entry" style={{ margin: '0 10px' }}>去商家端</Link> | 
        <Link to="/admin/audit" style={{ marginLeft: '10px' }}>去管理员端</Link>
      </nav>

     
      <Routes>
        {/* 如果网址是 /login，就显示 Login 组件 */}
        <Route path="/login" element={<Login />} />

        {/* 如果网址是 /merchant/entry，就显示 HotelEntry 组件 */}
        <Route path="/merchant/entry" element={<HotelEntry />} />

        {/* 如果网址是 /admin/audit，就显示 HotelAudit 组件 */}
        <Route path="/admin/audit" element={<HotelAudit />} />
        
        {/* 如果网址是根目录 /，默认跳到登录页 */}
        <Route path="/" element={<div style={{padding: 20}}>欢迎来到易宿后台</div>} />
      </Routes>
    </div>
  );
}

export default App;