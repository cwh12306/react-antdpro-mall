import React, { useEffect, useState } from 'react';
import { Modal, List, Skeleton, Image, message } from 'antd';
import { getOrderById, postOrder } from '@/services/ant-design-pro/new';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';

export default function MyModal(props) {
  const { isModalVisible, showModal, oid, status, actionRef } = props;
  const [data, setData] = useState(undefined);
  let type = status === undefined ? '详情' : '发货';

  const options = [
    { label: '韵达', value: 'YD' },
    { label: '顺丰', value: 'SF' },
    { label: '圆通', value: 'YTO' },
  ];

  useEffect(async () => {
    //说明是查看详情
    if (oid !== undefined) {
      const response = await getOrderById(oid);
      const goods = response.goods.data.map((item, index) => {
        item.num = response.orderDetails.data[index].num;
        return item;
      });
      setData(goods);
    }
  }, []);

  //订单发货
  const submitOrder = async (values) => {
    if (status === 2) {
      //如果支付了，再发货
      await postOrder(oid, values);
      message.success('发货成功!');
      actionRef.current.reload();
      showModal(false);
    } else if (status === 3) {
      message.error('订单已发货!');
    } else if (status === 4) {
      message.error('订单已收货!');
    } else if (status === 5) {
      message.error('订单已过期!');
    } else {
      message.error('订单未支付!');
    }
  };

  return (
    <Modal
      footer={null}
      title={`订单${type}`}
      visible={isModalVisible}
      onCancel={() => {
        showModal(false);
      }}
    >
      {data === undefined && status === undefined ? (
        <Skeleton title={false} paragraph={{ rows: 3 }} active={true} />
      ) : status === undefined ? (
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Image width={100} src={item['cover_url']} />}
                title={<p>{item.title}</p>}
                description={`单价:${item.price} - 数量:${item.num} - 总价:${
                  item.price * item.num
                }`}
              />
            </List.Item>
          )}
        />
      ) : (
        <ProForm onFinish={async (values) => submitOrder(values)}>
          <ProFormSelect
            name="express_type"
            label="快递类型"
            placeholder="请选择快递类型"
            rules={[{ required: true, message: '快递类型是必须的' }]}
            options={options}
          />
          <ProFormText
            name="express_no"
            label="快递单号"
            tooltip="快递单号一般为20位"
            placeholder="请输入快递单号"
            rules={[
              { required: true, message: '快递单号是必须的' },
              { max: 20, min: 20, type: 'string', message: '快递单号20位' },
            ]}
          />
        </ProForm>
      )}
    </Modal>
  );
}
