import React, { useState } from 'react';
import dayjs from 'dayjs';
import styles from './index.module.scss';

// 引入你首页的日期选择组件
import DateDurationSelector from '../../home/DateDurationSelector';
// 引入刚刚新建的人数选择组件
import GuestSelectionDrawer from '../GuestSelectionDrawer';

interface HourlyTimePickerProps {
  date: string; // YYYY-MM-DD
  roomCount: number;
  adultCount: number;
  childCount: number;
  // 更新父组件数据的回调
  onDateChange?: (newDate: string) => void;
  onGuestChange: (rooms: number, adults: number, children: number) => void;
}

const HourlyTimePicker: React.FC<HourlyTimePickerProps> = ({
  date = dayjs().format('YYYY-MM-DD'),
  roomCount = 1,
  adultCount = 1,
  childCount = 0,
  onDateChange,
  onGuestChange,
}) => {
  // 控制两个弹窗的显示与隐藏
  const [isDateSelectorVisible, setIsDateSelectorVisible] = useState(false);
  const [isGuestDrawerVisible, setIsGuestDrawerVisible] = useState(false);

  // 格式化星期
  const formatDayOfWeek = (dateStr: string) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[dayjs(dateStr).day()];
  };

  return (
    <>
      {/* 外部触发条 */}
      <div className={styles.filterBar}>
        {/* 左侧：点击呼出日期组件 */}
        <div className={styles.leftSection} onClick={() => setIsDateSelectorVisible(true)}>
          <span className={styles.mainText}>{dayjs(date).format('MM月DD日')}</span>
          <span className={styles.subText}>{formatDayOfWeek(date)}入住</span>
          <span className={styles.arrow}>&gt;</span>
        </div>

        <div className={styles.divider}></div>

        {/* 右侧：点击呼出人数组件 */}
        <div className={styles.rightSection} onClick={() => setIsGuestDrawerVisible(true)}>
          <span className={styles.mainText}>
            {roomCount}间 {adultCount + childCount}人
          </span>
          <span className={styles.arrow}>&gt;</span>
        </div>
      </div>

      {/* 1. 首页的日期组件 */}
      <DateDurationSelector
        isPopupOnly={true} // 🌟 隐藏自带的触发UI，只用弹窗
        date={date ? dayjs(date).toDate() : dayjs().toDate()} // 🌟 将 string 转换为 Date 对象传入
        visible={isDateSelectorVisible}
        onClose={() => setIsDateSelectorVisible(false)}
        onChange={(selectedDate: Date, duration: number) => {
          // 🌟 接收 Date 对象，将其格式化为 YYYY-MM-DD 字符串后再传给父组件
          if (onDateChange) {
            onDateChange(dayjs(selectedDate).format('YYYY-MM-DD'));
          }
          setIsDateSelectorVisible(false);
        }}
      />

      {/* 2. 人数选择抽屉 */}
      <GuestSelectionDrawer
        isOpen={isGuestDrawerVisible}
        onClose={() => setIsGuestDrawerVisible(false)}
        roomCount={roomCount}
        adultCount={adultCount}
        childCount={childCount}
        onChange={onGuestChange}
      />
    </>
  );
};

export default HourlyTimePicker;