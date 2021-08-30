import { Upload, message } from 'antd';
import React from 'react';
import { getOssToken } from '@/services/ant-design-pro/api';

export default class AliyunOSSUpload extends React.Component {
  state = {
    OSSData: {},
  };

  async componentDidMount() {
    await this.init();
  }

  init = async () => {
    try {
      const OSSData = await getOssToken();

      this.setState({
        OSSData,
      });
    } catch (error) {
      message.error(error);
    }
  };
  /**
   * 实时监控上传过程，每次上传状态更新回调该函数
   * @param param
   */
  onChange = ({ file }) => {
    console.log('Aliyun OSS:', file);
    const { setImageState, setUploadKey } = this.props;
    //当文件上传完毕
    if (file.status === 'done') {
      message.success('上传成功！');
      if (setUploadKey) setUploadKey(file.key);
      if (setImageState) setImageState(file.url);
    }
  };
  //当用户点击撤回图片上传
  // onRemove = (file) => {
  //   const { value, onChange } = this.props;

  //   const files = value.filter((v) => v.url !== file.url);

  //   if (onChange) {
  //     onChange(files);
  //   }
  // };

  getExtraData = (file) => {
    const { OSSData } = this.state;

    return {
      key: file.key,
      OSSAccessKeyId: OSSData.accessid,
      policy: OSSData.policy,
      Signature: OSSData.signature,
    };
  };

  beforeUpload = async (file) => {
    const { OSSData } = this.state;
    const expire = OSSData.expire * 1000;
    //如果签名过期了，重新获取
    if (expire < Date.now()) {
      await this.init();
    }
    const dir = 'cwh/';
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    //上传时需要用到的key（会根据该key在OSS服务器生成对应的目录）
    file.key = OSSData.dir + dir + filename;
    //上传完成后的回显
    file.url = OSSData.host + OSSData.dir + dir + filename;
    return file;
  };

  render() {
    const { value, accept, showUploadList } = this.props;
    const props = {
      accept: accept || '',
      name: 'file',
      fileList: value,
      action: this.state.OSSData.host,
      onChange: this.onChange,
      onRemove: this.onRemove,
      data: this.getExtraData,
      beforeUpload: this.beforeUpload,
      maxCount: 1,
      listType: 'picture',
      showUploadList,
    };
    return <Upload {...props}>{this.props.children}</Upload>;
  }
}
