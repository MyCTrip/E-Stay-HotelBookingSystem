import React from 'react';
import { useParams } from 'react-router-dom';

export default function HotelDetail() {
  const { id } = useParams();
  return (
    <div className="space-y-4">
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold">酒店详情 - {id}</h2>
        <p className="text-sm text-gray-600">这里会显示酒店大图、基础信息、设施与房型列表</p>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h3 className="font-medium">房型</h3>
        <div className="mt-3 space-y-3">
          <div className="p-3 border rounded">
            房型示例 - ¥688 起{' '}
            <button className="ml-3 bg-blue-500 text-white px-3 py-1 rounded">订</button>
          </div>
        </div>
      </div>
    </div>
  );
}
