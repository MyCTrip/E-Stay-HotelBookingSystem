import React from 'react';
import styles from './index.module.scss';
import { HourlyRoomDetail } from '@estay/shared';

interface HourlyRoomSelectionProps {
  data: any;
  onOpenDetail: (room: HourlyRoomDetail) => void;
  onBookClick?: (room: HourlyRoomDetail) => void; // 如果父组件有直接预订的方法
}

const HourlyRoomSelection: React.FC<HourlyRoomSelectionProps> = ({ data, onOpenDetail, onBookClick }) => {
  // 假设从 data 中获取房型列表
  const rooms = data.rooms || [
    {
      id: '1',
      name: '高级大床房 (智能投屏+深睡记忆床垫)',
      timeWindow: '10:00-22:00',
      duration: 4,
      bedType: '1张1.8m大床',
      area: '26-30m²',
      capacity: '2人入住',
      floor: '4-6层',
      breakfast: '无早餐',
      cancelPolicy: '入住当天18:00前可免费取消',
      price: 148,
      originalPrice: 168,
      image: 'https://picsum.photos/400/300?random=1',
      imageCount: 6
    },
    // ... 其他房型
  ];

  return (
    <div className={styles.roomListWrapper}>
      {/* 顶部日期和时间段提示保留 */}

      <div className={styles.list}>
        {rooms.map((room: any) => (
          <div
            key={room.id}
            className={styles.roomCard}
            onClick={() => onOpenDetail(room)} // 🌟 点击整个卡片触发弹窗
          >
            {/* 左侧图片 */}
            <div className={styles.imageWrapper}>
              <img src={room.image} alt={room.name} />
              <div className={styles.imageCount}>{room.imageCount} 图</div>
            </div>

            {/* 右侧信息 */}
            <div className={styles.roomInfo}>
              <h3 className={styles.roomName}>{room.name}</h3>

              <div className={styles.timeTag}>
                可住时段: {room.timeWindow} 连住{room.duration}小时 &gt;
              </div>

              <div className={styles.specs}>
                {room.bedType} {room.area} {room.capacity} {room.floor}
              </div>

              <div className={styles.tags}>
                <span className={styles.tagGrey}>{room.breakfast}</span>
                <span className={styles.tagBlue}>{room.cancelPolicy}</span>
              </div>

              {/* 价格与预订按钮 */}
              <div className={styles.priceRow}>
                <div className={styles.priceInfo}>
                  {room.originalPrice && <span className={styles.originalPrice}>¥{room.originalPrice}</span>}
                  <span className={styles.currentPrice}><span className={styles.currency}>¥</span>{room.price}</span>
                </div>

                <button
                  className={styles.bookBtn}
                  onClick={(e) => {
                    e.stopPropagation(); // 🌟 阻止冒泡，防止触发外层的 onOpenDetail
                    if (onBookClick) {
                      onBookClick(room);
                    } else {
                      // 备用逻辑：如果只想复用弹窗，这里也可以调用 onOpenDetail(room)
                      console.log('直接预订: ', room.name);
                    }
                  }}
                >
                  预订
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyRoomSelection;