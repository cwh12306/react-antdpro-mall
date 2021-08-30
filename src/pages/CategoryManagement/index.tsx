import React, { Fragment, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Switch, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { getCategory } from '@/services/ant-design-pro/api';
import EditableModal from './components/EditableModal';
import { categoryStatus } from '@/services/ant-design-pro/new';

export default function CategoryManagement() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const actionRef = useRef();
  const [cid, setCid] = useState(undefined);

  const columns = [
    {
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
    },
    {
      dataIndex: 'status',
      title: '是否启用',
      valueType: 'radioButton',
      valueEnum: {
        1: { text: '禁用' },
        0: { text: '启用' },
      },
      render: (_, record) => {
        return (
          <Switch
            checkedChildren="已启用"
            unCheckedChildren="禁用中"
            defaultChecked={record.status === 1}
            onChange={() => handleStatus(record.id)}
          />
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="1"
          onClick={() => {
            showModal(true, record.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];
  //启用和禁用分类
  const handleStatus = async (cid) => {
    const response = await categoryStatus(cid);
    if (response.status === undefined) message.success('操作成功!');
  };

  //获取分类信息
  const getData = async () => {
    const response = await getCategory();
    return {
      data: response,
      success: true,
    };
  };

  const showModal = (isShow, id = undefined) => {
    setIsModalVisible(isShow);
    setCid(id);
  };

  return (
    <Fragment>
      <PageContainer>
        <ProTable
          actionRef={actionRef}
          columns={columns}
          request={(params, sorter, filter) =>
            // 表单搜索项会从 params 传入，传递给后端接口。
            getData()
          }
          rowKey={(record) => record.id}
          pagination={{
            showQuickJumper: true,
          }}
          search={false}
          dateFormatter="string"
          options={false}
          toolBarRender={() => [
            <Button
              key="primary"
              type="primary"
              onClick={() => {
                showModal(true);
              }}
            >
              新建分类
            </Button>,
          ]}
        />
      </PageContainer>
      {!isModalVisible ? (
        ''
      ) : (
        <EditableModal
          isModalVisible={isModalVisible}
          showModal={showModal}
          actionRef={actionRef}
          cid={cid}
        />
      )}
    </Fragment>
  );
}
