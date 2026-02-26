const MS_PER_DAY = 24 * 60 * 60 * 1000;
const normalizeDateOnly = (value) => {
    if (!value) {
        return null;
    }
    const timestamp = Date.parse(`${value}T00:00:00`);
    return Number.isNaN(timestamp) ? null : timestamp;
};
export function calculateNightlyPrice(roomSku, checkInDate, checkOutDate) {
    const checkIn = normalizeDateOnly(checkInDate);
    const checkOut = normalizeDateOnly(checkOutDate);
    if (checkIn === null || checkOut === null) {
        return 0;
    }
    const nights = Math.max(1, Math.floor((checkOut - checkIn) / MS_PER_DAY));
    const nightlyPrice = roomSku.priceInfo.nightlyPrice;
    return Math.max(0, nightlyPrice) * nights;
}
//# sourceMappingURL=price.js.map