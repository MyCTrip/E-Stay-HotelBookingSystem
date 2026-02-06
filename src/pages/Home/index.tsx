import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold">搜索酒店</h2>
        <div className="mt-3">
          <input className="w-full p-3 border rounded" placeholder="输入目的地或酒店名" />
        </div>
        <div className="mt-3 flex gap-2">
          <Link to="/list" className="flex-1 text-center bg-blue-500 text-white p-3 rounded">
            查询
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="font-medium">热门推荐</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="h-28 bg-gray-200 rounded" />
          <div className="h-28 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
