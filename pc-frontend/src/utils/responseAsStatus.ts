export function roomStatusAsResponse(status: string | undefined) {
  switch (status) {
    case 'pending':
      return { level: '待审核', color: 'orange' };
    case 'approved':
      return { level: '已通过', color: 'green' };
    case 'rejected':
      return { level: '已驳回', color: 'red' };
    case 'offline':
      return { level: '已下架', color: 'default' };
    case 'draft':
    default:
      return { level: '草稿', color: 'default' };
  }
}
