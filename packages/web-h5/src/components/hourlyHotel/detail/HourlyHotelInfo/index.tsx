import React from 'react';
import styles from './index.module.scss'; // 你需要新建这个样式文件

const HourlyHotelInfo = ({ data }) => {
  return (
    <div className={styles.overviewContainer}>
      {/* 1. 标题与标签 */}
      <div className={styles.headerTitle}>
        <h2>{data.baseInfo?.nameCn || '云和夜泊酒店(上海浦东国际机场店)'}</h2>
        <div className={styles.tags}>
          <span className={styles.tagGold}>优享会</span>
          <span className={styles.tagGrey}>2018年开业</span>
        </div>
      </div>

      {/* 2. 水平滚动的特色设施 (图3中间那一排圆圈) */}
      <div className={styles.featureScroll}>
        <div className={styles.featureItem}>
          <div className={styles.iconBox}>🐻</div>
          <span>亲子主题房</span>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.iconBox}>🎠</div>
          <span>儿童乐园</span>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.iconBox}>👕</div>
          <span>洗衣房</span>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.iconBox}>🅿️</div>
          <span>免费停车</span>
        </div>
        {/* 设施政策入口 */}
        <div className={styles.policyEntry}>
          设施政策 &gt;
        </div>
      </div>

      {/* 3. 并排的点评与地图卡片 */}
      <div className={styles.cardsRow}>
        <div className={styles.reviewCard}>
          <div className={styles.scoreRow}>
            <span className={styles.score}>4.9</span>
            <span className={styles.desc}>超棒</span>
            <span className={styles.count}>1.3万条 &gt;</span>
          </div>
          <p className={styles.quote}>“早餐种类丰富，班车接送服务很好”</p>
        </div>
        <div className={styles.mapCard}>
          <div className={styles.locationText}>
            <strong>距惠南地铁站驾车5.7公里</strong>
            <p>浦东新区秋亭路128弄</p>
          </div>
          <div className={styles.mapIcon}>
            <span>📍 地图</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyHotelInfo;