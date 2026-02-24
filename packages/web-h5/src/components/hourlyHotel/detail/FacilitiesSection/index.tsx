import React from 'react';
import styles from './index.module.scss';

const FacilitiesSection = ({ data }) => {
  return (
    <div className={styles.facilitiesWrapper}>
      <h3 className={styles.sectionTitle}>设施服务</h3>

      {/* 顶部的高分评价金句 */}
      <div className={styles.highlightReview}>
        <span className={styles.badge}>设施 4.9 超棒</span>
        <span>“有健身房，环境舒适服务周到”</span>
      </div>

      {/* 分类列表 */}
      <div className={styles.facilityGroup}>
        <div className={styles.groupHeader}>
          <span>🚌</span> <h4>交通服务</h4>
        </div>
        <div className={styles.groupItems}>
          <div className={styles.item}>班车送机 <span className={styles.free}>免费</span></div>
          <div className={styles.item}>班车接机 <span className={styles.free}>免费</span></div>
          <div className={styles.item}>叫车服务</div>
          <div className={styles.item}>停车场 <span className={styles.free}>免费</span></div>
        </div>
      </div>

      <div className={styles.facilityGroup}>
        <div className={styles.groupHeader}>
          <span>🎠</span> <h4>亲子设施</h4>
        </div>
        <div className={styles.groupItems}>
          <div className={styles.item}>儿童乐园</div>
          <div className={styles.item}>儿童牙刷</div>
          <div className={styles.item}>儿童浴袍</div>
        </div>
      </div>

      <div className={styles.facilityGroup}>
        <div className={styles.groupHeader}>
          <span>🎠</span> <h4>餐饮服务</h4>
        </div>
        <div className={styles.groupItems}>
          <div className={styles.item}>餐厅</div>
          <div className={styles.item}>大堂吧</div>
        </div>
      </div>

      <div className={styles.facilityGroup}>
        <div className={styles.groupHeader}>
          <span>🎠</span> <h4>前台服务</h4>
        </div>
        <div className={styles.groupItems}>
          <div className={styles.item}>行李寄存</div>
          <div className={styles.item}>叫醒服务</div>
          <div className={styles.item}>礼宾服务</div>
          <div className={styles.item}>专职行李员</div>
        </div>
      </div>

      <div className={styles.viewAllBtn}>
        查看全部 37 项设施
      </div>
    </div>
  );
};

export default FacilitiesSection;