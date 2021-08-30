import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import { message, Space, Tag } from 'antd';
import ProTable from '@ant-design/pro-table';
import { goodsRecommend, goodsOn } from '@/services/ant-design-pro/api';
import { getOrders } from '@/services/ant-design-pro/new';
import MyModal from './components/MyModal';

export default function GoodsList() {
  const actionRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [oid, setOid] = useState(undefined);
  const [status, setStatus] = useState(undefined);

  const valueEnum = {
    1: <Tag color="default">下单</Tag>,
    2: <Tag color="success">支付</Tag>,
    3: <Tag color="processing">发货</Tag>,
    4: <Tag color="warning">收获</Tag>,
    5: <Tag color="error">过期</Tag>,
  };

  const columns = [
    { dataIndex: 'id', hideInTable: true, hideInSearch: true },
    { dataIndex: 'order_no', title: '单号' },
    { dataIndex: 'username', title: '用户', hideInSearch: true },
    { dataIndex: 'amount', title: '总价', hideInSearch: true },
    {
      dataIndex: 'status',
      title: '状态',
      valueEnum,
    },
    { dataIndex: 'pay_time', title: '支付时间', hideInSearch: true },
    { dataIndex: 'pay_type', title: '支付类型', hideInSearch: true },
    { dataIndex: 'trade_no', title: '支付单号' },
    {
      title: '操作',
      hideInSearch: true,
      render: (_, record) => {
        return [
          <Space key="fk">
            {' '}
            <a
              key="detail"
              onClick={() => {
                showModal(true, record.id, undefined);
              }}
            >
              详情
            </a>
            <a
              key="send"
              onClick={() => {
                showModal(true, record.id, record.status);
              }}
            >
              发货
            </a>
          </Space>,
        ];
      },
    },
  ];

  /**
   * 处理商品推荐不推荐
   * @param gid
   */
  const handleRecommend = async (gid) => {
    const response = await goodsRecommend(gid);
    if (response.status === undefined) message.success('操作成功!');
  };
  /**
   * 处理商品上架下架
   * @param gid
   */
  const handleOn = async (gid) => {
    const response = await goodsOn(gid);
    if (response.status === undefined) message.success('操作成功!');
  };

  /**
   * 获取用户列表数据
   * @param params
   * @returns
   */
  const getData = async (params) => {
    const response = await getOrders(params);
    const list = response.data.map((item) => {
      item.username = item.user.name;
      return item;
    });
    return {
      data: list,
      success: true,
      total: response.meta.pagination.total,
    };
  };

  const showModal = (isShow, id = undefined, status = undefined) => {
    setIsModalVisible(isShow);
    setOid(id);
    setStatus(status);
  };

  return (
    <PageContainer>
      {' '}
      <ProTable
        columns={columns}
        actionRef={actionRef}
        request={async (params = {}) => getData(params)}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle="订单列表"
      />
      {!isModalVisible ? (
        ''
      ) : (
        <MyModal
          showModal={showModal}
          isModalVisible={isModalVisible}
          oid={oid}
          status={status}
          actionRef={actionRef}
        />
      )}
    </PageContainer>
  );
}
