import React, { useEffect, useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Modal, message, Skeleton } from 'antd';
import { getUserById, updateUser, addUser } from '@/services/ant-design-pro/api';

export default function EditableModal(props) {
  const { isModalVisible, showModal, actionRef, uid } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  let type = uid === undefined ? '添加' : '编辑';

  useEffect(async () => {
    //如果是编辑，就发送请求获取指定用户信息
    if (uid !== undefined) {
      const response = await getUserById(uid);
      setInitialValues({ name: response.name, email: response.email });
    }
  }, []);

  /**
   * 修改或添加用户
   * @param params
   * @returns
   */
  const submitUser = async (params) => {
    let response = {};
    if (uid === undefined) {
      response = await addUser(params);
    } else {
      response = await updateUser(uid, params);
    }
    if (response.status === undefined) {
      message.success(`${type}成功!`);
      showModal(false);
      actionRef.current.reload();
    }
  };

  return (
    <Modal
      footer={null}
      title={`${type}用户`}
      visible={isModalVisible}
      onCancel={() => {
        showModal(false);
      }}
      centered={true}
      destroyOnClose={true}
    >
      {initialValues === undefined && uid !== undefined ? (
        <Skeleton title={false} paragraph={{ rows: 3 }} active={true} />
      ) : (
        <ProForm
          //自定义提交按钮
          //   submitter={{
          //     render: (props, doms) => {
          //       return [
          //         ...doms,
          //         <Button htmlType="button" onClick={onFill}>
          //           一键填写
          //         </Button>,
          //         <Button htmlType="button" onClick={getCompanyName}>
          //           读取公司
          //         </Button>,
          //       ];
          //     },
          //   }}
          onFinish={async (values) => submitUser(values)}
          initialValues={initialValues}
        >
          <ProFormText
            name="name"
            label="昵称"
            tooltip="最长为 12 个字符"
            placeholder="请输入昵称"
            rules={[
              { required: true, message: '昵称是必须的' },
              { max: 12, type: 'string', message: '昵称最长为12个字符' },
            ]}
          />
          <ProFormText
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            rules={[
              { required: true, message: '邮箱是必须的' },
              { type: 'email', message: '邮箱格式不对' },
            ]}
          />
          {uid === undefined ? (
            <ProFormText.Password
              name="password"
              label="密码"
              tooltip="最少为 6 位"
              placeholder="请输入密码"
              rules={[
                { required: true, message: '密码是必须的' },
                { min: 6, type: 'string', message: '密码至少6位' },
              ]}
            />
          ) : (
            ''
          )}
        </ProForm>
      )}
    </Modal>
  );
}
