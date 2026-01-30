import { Request, Response } from 'express';
import { Hotel } from './hotel.model';

export const createHotel = async (req: Request, res: Response) => {
  const { nameCn, nameEn, address, city, star, rooms, images } = req.body;
  const user = (req as any).user;
  try {
    const hotel = await Hotel.create({
      merchantId: user.id || user.id,
      nameCn,
      nameEn,
      address,
      city,
      star,
      rooms: rooms || [],
      images: images || [],
      status: 'draft'
    });
    res.status(201).json(hotel);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const user = (req as any).user;
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    if (hotel.merchantId.toString() !== user.id && user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    Object.assign(hotel, updates);
    await hotel.save();
    res.json(hotel);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const submitHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    if (hotel.merchantId.toString() !== user.id) return res.status(403).json({ message: 'Forbidden' });
    hotel.status = 'pending';
    await hotel.save();
    res.json(hotel);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listApprovedHotels = async (req: Request, res: Response) => {
  const hotels = await Hotel.find({ status: 'approved' });
  res.json(hotels);
};