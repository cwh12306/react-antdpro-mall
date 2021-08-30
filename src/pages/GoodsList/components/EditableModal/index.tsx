import React, { useEffect, useState } from 'react';
import ProForm, { ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Modal, message, Skeleton, Cascader, Button, Image } from 'antd';
import { getGoodsById, updateGoods, addGoods, getCategory } from '@/services/ant-design-pro/api';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import { UploadOutlined } from '@ant-design/icons';
import Editor from '@/components/Editor';

export default function EditableModal(props) {
  const { isModalVisible, showModal, actionRef, gid } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  const [options, setOptions] = useState([]);
  //生成ProForm表单实例
  const [form] = ProForm.useForm();
  let type = gid === undefined ? '添加' : '编辑';

  useEffect(async () => {
    //获取商品分类信息
    const response = await getCategory();
    if (response.status === undefined) setOptions(response);
    //如果是编辑，就发送请求获取指定商品信息
    if (gid !== undefined) {
      const response = await getGoodsById(gid);
      const { pid, id } = response.category;
      setInitialValues({ ...response, category_id: [pid, id] });
    }
  }, []);
  /**
   * 手动给ProForm表单的cover字段设置值
   * @param key
   * @returns
   */
  const setUploadKey = (cover) => form.setFieldsValue({ cover });
  /**
   * 手动给ProForm表单的details字段设置值
   * @param key
   * @returns
   */
  const setDetails = (details) => form.setFieldsValue({ details });
  /**
   * 修改或添加商品
   * @param params
   * @returns
   */
  const submitGoods = async (params) => {
    let response = {};
    if (gid === undefined) {
      response = await addGoods({ ...params, category_id: params.category_id[1] });
    } else {
      response = await updateGoods(gid, { ...params, category_id: params.category_id[1] });
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
      title={`${type}商品`}
      visible={isModalVisible}
      onCancel={() => {
        showModal(false);
      }}
      centered={true}
      destroyOnClose={true}
    >
      {initialValues === undefined && gid !== undefined ? (
        <Skeleton title={false} paragraph={{ rows: 3 }} active={true} />
      ) : (
        <ProForm
          form={form}
          onFinish={async (values) => submitGoods(values)}
          initialValues={initialValues}
        >
          <ProForm.Item
            name="category_id"
            rules={[{ required: true, message: '商品分类是必须的' }]}
            label="商品分类"
          >
            <Cascader
              fieldNames={{ label: 'name', value: 'id' }}
              options={options}
              placeholder="请选择商品分类"
            />
          </ProForm.Item>

          <ProFormText
            name="title"
            label="商品名称"
            placeholder="请输入商品名称"
            rules={[{ required: true, message: '商品名称是必须的' }]}
          />
          <ProFormTextArea
            name="description"
            label="商品描述"
            placeholder="请输入商品描述"
            rules={[{ required: true, message: '商品描述是必须的' }]}
          />
          <ProFormDigit
            name="price"
            label="商品价格"
            max={9999999}
            min={0}
            rules={[{ required: true, message: '商品价格是必须的' }]}
          />
          <ProFormDigit
            name="stock"
            label="商品库存"
            max={9999999}
            min={0}
            rules={[{ required: true, message: '商品库存是必须的' }]}
          />
          <ProFormText hidden={true} name="cover" />
          <ProForm.Item
            name="cover"
            rules={[{ required: true, message: '商品主图是必须的' }]}
            label="商品主图"
          >
            <div>
              <AliyunOSSUpload accept="image/*" setUploadKey={setUploadKey} showUploadList={true}>
                <Button icon={<UploadOutlined />}>单击上传商品图</Button>
              </AliyunOSSUpload>
              {!initialValues?.cover_url ? '' : <Image width={180} src={initialValues.cover_url} />}
            </div>
          </ProForm.Item>

          <ProForm.Item
            name="details"
            rules={[{ required: true, message: '商品详情是必须的' }]}
            label="商品详情"
          >
            <Editor setDetails={setDetails} content={initialValues?.details} />
          </ProForm.Item>
        </ProForm>
      )}
    </Modal>
  );
}
