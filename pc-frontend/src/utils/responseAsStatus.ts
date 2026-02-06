export const roomStatusAsResponse = (status?: string) => {
  if (status === 'draft' || status === 'available') return { color: '#87d068', level: 'AVAILABLE' }
  if (status === 'offline' || status === 'unavailable') return { color: '#f55000', level: 'UNAVAILABLE' }
  if (status === 'booked') return { color: '#2db7f5', level: 'BOOKED' }
  if (status === 'pending') return { color: 'blue', level: 'PENDING' }
  if (status === 'approved') return { color: 'green', level: 'APPROVED' }
  if (status === 'rejected') return { color: 'red', level: 'REJECTED' }
  return { color: 'default', level: 'UNKNOWN' }
}

export const roomTypeAsColor = (type?: string) => {
  if (type === 'single') return 'purple'
  if (type === 'couple') return 'magenta'
  if (type === 'family') return 'volcano'
  if (type === 'presidential') return 'geekblue'
  return 'default'
}