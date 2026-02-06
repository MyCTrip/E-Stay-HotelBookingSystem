import React from 'react';
import HotelCard from '../../components/HotelCard';

const mock = new Array(8).fill(0).map((_, i) => ({
  id: String(i + 1),
  name: `示例酒店 ${i + 1}`,
  address: '上海 市中心',
  minPrice: 268,
  image: '',
}));

export default function HotelList() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-3 rounded shadow">
        <h2 className="font-semibold">上海 · 02-06 至 02-07 · 1 间 1 人</h2>
      </div>

      <div className="grid gap-4">
        {mock.map((h) => (
          <HotelCard key={h.id} hotel={h} />
        ))}
      </div>
    </div>
  );
}
