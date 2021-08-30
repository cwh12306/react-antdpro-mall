import request from '@/utils/request';

/** 添加分类 */
export async function addCategory(data) {
  return request.post('/admin/category', { data });
}

/** 获取指定分类信息 */
export async function getCategoryById(cid) {
  return request(`/admin/category/${cid}`);
}

/** 更新分类信息 */
export async function updateCategory(cid, data) {
  return request.put(`/admin/category/${cid}`, { data });
}

/** 启用与禁用 */
export async function categoryStatus(cid) {
  return request.patch(`/admin/category/${cid}/status`);
}

/**获取所有订单数据 */
export async function getOrders() {
  return request(`/admin/orders?include=goods,user,orderDetails`);
}

/** 获取指定订单信息 */
export async function getOrderById(oid) {
  return request(`/admin/orders/${oid}?include=goods,user,orderDetails`);
}

/**订单发货 */
export async function postOrder(oid, data) {
  return request.patch(`/admin/orders/${oid}/post`, { data });
}
