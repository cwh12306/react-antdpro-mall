import React, { useEffect, useState } from 'react';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Modal, message, Skeleton } from 'antd';
import { getCategory } from '@/services/ant-design-pro/api';
import { addCategory, getCategoryById, updateCategory } from '@/services/ant-design-pro/new';

export default function EditableModal(props) {
  const { isModalVisible, showModal, actionRef, cid } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  const [options, setOptions] = useState([]);
  let type = cid === undefined ? '添加' : '编辑';

  useEffect(async () => {
    //获取商品分类信息
    const response = await getCategory();
    if (response.status === undefined)
      setOptions(response.map((item) => ({ ...item, label: item.name, value: item.id })));

    //如果是编辑，就发送请求获取指定商品分类信息
    if (cid !== undefined) {
      const response = await getCategoryById(cid);
      if (response.pid === 0) {
        response.pid = '无父级';
      }
      setInitialValues(response);
    }
  }, []);

  const submitCategory = async (params) => {
    let response = {};
    if (cid === undefined) {
      response = await addCategory(params);
    } else {
      response = await updateCategory(cid, params);
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
      title={`${type}分类`}
      visible={isModalVisible}
      onCancel={() => {
        showModal(false);
      }}
      centered={true}
      destroyOnClose={true}
    >
      {initialValues === undefined && cid !== undefined ? (
        <Skeleton title={false} paragraph={{ rows: 3 }} active={true} />
      ) : (
        <ProForm onFinish={async (values) => submitCategory(values)} initialValues={initialValues}>
          <ProFormSelect
            name="pid"
            label="父级分类"
            options={options}
            placeholder="可选择父级分类，不选择则默认创建顶级分类"
          />
          <ProFormText
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '分类名称是必须的' }]}
          />
        </ProForm>
      )}
    </Modal>
  );
}
