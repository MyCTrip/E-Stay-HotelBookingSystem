import React from 'react';
import { Link } from 'react-router-dom';

export default function HotelCard({ hotel }: any) {
  return (
    <Link
      to={`/hotel/${hotel.id}`}
      className="block bg-white rounded-lg overflow-hidden shadow hover:shadow-md"
    >
      <div className="h-36 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">图片</span>
      </div>
      <div className="p-3">
        <h4 className="font-semibold">{hotel.name}</h4>
        <p className="text-sm text-gray-600">{hotel.address}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm text-gray-500">评分 4.8</div>
          <div className="text-lg font-bold text-red-500">¥{hotel.minPrice}</div>
        </div>
      </div>
    </Link>
  );
}
