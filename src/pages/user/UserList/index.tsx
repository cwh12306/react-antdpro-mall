import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Avatar, Switch, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { getUsers, lockUser } from '@/services/ant-design-pro/api';
import EditableModal from './components/EditableModal';

export default function UserList() {
  const actionRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uid, setUid] = useState(undefined);

  const columns = [
    {
      dataIndex: 'avatar_url',
      title: '头像',
      hideInSearch: true,
      render: (_, record) => {
        return <Avatar size={32} icon={<UserOutlined />} src={record.avatar_url} />;
      },
    },
    { dataIndex: 'name', title: '姓名' },
    { dataIndex: 'email', title: '邮箱' },
    {
      dataIndex: 'is_locked',
      title: '是否禁用',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            defaultChecked={record.is_locked === 0}
            onChange={() => handlerLockUser(record.id)}
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
   * 处理用户启用和禁用
   * @param uid
   */
  const handlerLockUser = async (uid) => {
    const response = await lockUser(uid);
    if (response.status === undefined) message.success('操作成功!');
  };

  /**
   * 获取用户列表数据
   * @param params
   * @returns
   */
  const getData = async (params) => {
    const response = await getUsers(params);
    return {
      data: response.data,
      success: true,
      total: response.meta.pagination.total,
    };
  };

  const showModal = (isShow, id = undefined) => {
    setIsModalVisible(isShow);
    setUid(id);
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
        headerTitle="用户列表"
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
          uid={uid}
        />
      )}
    </PageContainer>
  );
}
