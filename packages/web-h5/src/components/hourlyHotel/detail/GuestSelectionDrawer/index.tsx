import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';

interface GuestSelectionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    roomCount: number;
    adultCount: number;
    childCount: number;
    onChange: (rooms: number, adults: number, children: number) => void;
}

const GuestSelectionDrawer: React.FC<GuestSelectionDrawerProps> = ({
    isOpen,
    onClose,
    roomCount,
    adultCount,
    childCount,
    onChange,
}) => {
    // 弹窗内的临时状态
    const [localRooms, setLocalRooms] = useState(roomCount);
    const [localAdults, setLocalAdults] = useState(adultCount);
    const [localChildren, setLocalChildren] = useState(childCount);

    // 每次打开弹窗，同步外部最新的真实状态
    useEffect(() => {
        if (isOpen) {
            setLocalRooms(roomCount);
            setLocalAdults(adultCount);
            setLocalChildren(childCount);
        }
    }, [isOpen, roomCount, adultCount, childCount]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onChange(localRooms, localAdults, localChildren);
        onClose();
    };

    // 步进器子组件
    const Stepper = ({ value, min, onMinus, onPlus }: { value: number, min: number, onMinus: () => void, onPlus: () => void }) => {
        const isMinusDisabled = value <= min;
        return (
            <div className={styles.stepper}>
                <button
                    className={`${styles.stepBtn} ${styles.minusBtn} ${isMinusDisabled ? styles.disabled : ''}`}
                    onClick={onMinus}
                    disabled={isMinusDisabled}
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M19 13H5v-2h14v2z" />
                    </svg>
                </button>
                <span className={styles.stepValue}>{value}</span>
                <button className={`${styles.stepBtn} ${styles.plusBtn}`} onClick={onPlus}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                </button>
            </div>
        );
    };

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.drawerContent}>
                <div className={styles.header}>
                    <span className={styles.closeBtn} onClick={onClose}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="#333">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                        </svg>
                    </span>
                    <h3>选择客房和入住人数</h3>
                </div>

                <div className={styles.body}>
                    <div className={styles.tipBox}>
                        <span className={styles.infoIcon}>i</span>
                        入住人数较多时，试试增加间数
                    </div>

                    <div className={styles.rowList}>
                        <div className={styles.row}>
                            <div className={styles.label}>间数</div>
                            <Stepper
                                value={localRooms}
                                min={1}
                                onMinus={() => setLocalRooms((prev) => Math.max(1, prev - 1))}
                                onPlus={() => setLocalRooms((prev) => prev + 1)}
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.label}>成人数</div>
                            <Stepper
                                value={localAdults}
                                min={1}
                                onMinus={() => setLocalAdults((prev) => Math.max(1, prev - 1))}
                                onPlus={() => setLocalAdults((prev) => prev + 1)}
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.label}>
                                儿童数
                                <span className={styles.subLabel}>0-17岁</span>
                            </div>
                            <Stepper
                                value={localChildren}
                                min={0}
                                onMinus={() => setLocalChildren((prev) => Math.max(0, prev - 1))}
                                onPlus={() => setLocalChildren((prev) => prev + 1)}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.confirmBtn} onClick={handleConfirm}>
                        完成
                    </button>
                </div>
            </div>
        </>
    );
};

export default GuestSelectionDrawer;