"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireHotelApproved = void 0;
const hotel_model_1 = require("../modules/hotel/hotel.model");
const requireHotelApproved = async (req, res, next) => {
    const hotelId = req.params.hotelId || req.body.hotelId || req.params.id;
    if (!hotelId)
        return res.status(400).json({ message: 'hotelId is required' });
    try {
        const hotel = await hotel_model_1.Hotel.findById(hotelId);
        if (!hotel)
            return res.status(404).json({ message: 'Hotel not found' });
        // debug: print auditInfo for investigation
        // eslint-disable-next-line no-console
        console.log('requireHotelApproved check:', hotelId, JSON.stringify(hotel.auditInfo));
        if (hotel.auditInfo?.status !== 'approved')
            return res.status(403).json({ message: 'Hotel not approved' });
        next();
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.requireHotelApproved = requireHotelApproved;
//# sourceMappingURL=hotel.middleware.js.map