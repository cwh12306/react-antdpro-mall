import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Image, Switch, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { getGoods, goodsRecommend, goodsOn } from '@/services/ant-design-pro/api';
import EditableModal from './components/EditableModal';

export default function GoodsList() {
  const actionRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [gid, setGid] = useState(undefined);

  const columns = [
    {
      dataIndex: 'cover_url',
      title: '封面图',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <Image
            width={64}
            src={record.cover_url}
            placeholder={<Image preview={false} src={record.cover_url} />}
          />
        );
      },
    },
    { dataIndex: 'title', title: '标题' },
    { dataIndex: 'price', title: '价格', hideInSearch: true },
    { dataIndex: 'stock', title: '库存', hideInSearch: true },
    { dataIndex: 'sales', title: '销量', hideInSearch: true },
    {
      dataIndex: 'is_on',
      title: '是否上架',
      valueType: 'radioButton',
      valueEnum: {
        1: { text: '已上架' },
        0: { text: '已下架' },
      },
      render: (_, record) => {
        return (
          <Switch
            checkedChildren="已上架"
            unCheckedChildren="已下架"
            defaultChecked={record.is_on === 1}
            onChange={() => handleOn(record.id)}
          />
        );
      },
    },
    {
      dataIndex: 'is_recommend',
      title: '是否推荐',
      valueType: 'radioButton',
      valueEnum: {
        1: { text: '已推荐' },
        0: { text: '未推荐' },
      },
      render: (_, record) => {
        return (
          <Switch
            checkedChildren="已推荐"
            unCheckedChildren="未推荐"
            defaultChecked={record.is_recommend === 1}
            onChange={() => handleRecommend(record.id)}
          />
        );
      },
    },
    { dataIndex: 'created_at', title: '创建时间', hideInSearch: true },
    {
      title: '操作',
      hideInSearch: true,
      render: (_, record) => {
        return <a onClick={() => showModal(true, record.id)}>编辑</a>;
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
    const response = await getGoods(params);
    return {
      data: response.data,
      success: true,
      total: response.meta.pagination.total,
    };
  };

  const showModal = (isShow, id = undefined) => {
    setIsModalVisible(isShow);
    setGid(id);
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
        headerTitle="商品列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              showModal(true);
            }}
          >
            新建
          </Button>,
        ]}
      />
      {!isModalVisible ? (
        ''
      ) : (
        <EditableModal
          isModalVisible={isModalVisible}
          actionRef={actionRef}
          showModal={showModal}
          gid={gid}
        />
      )}
    </PageContainer>
  );
}
