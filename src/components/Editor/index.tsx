import React from 'react';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import './index.less';
import AliyunOSSUpload from '../AliyunOSSUpload';
import { ContentUtils } from 'braft-editor/node_modules/braft-utils/dist';

export default class Editor extends React.Component {
  state = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(this.props.content ?? null),
  };

  setImageState = (url) =>
    this.setState({
      editorState: ContentUtils.insertMedias(this.state.editorState, [
        {
          type: 'IMAGE',
          url,
        },
      ]),
    });
  //   async componentDidMount() {
  //     // 假设此处从服务端获取html格式的编辑器内容
  //     const htmlContent = await fetchEditorContent();
  //     // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
  //     this.setState({
  //       editorState: BraftEditor.createEditorState(htmlContent),
  //     });
  //   }

  //   submitContent = async () => {
  //     // 在编辑器获得焦点时按下ctrl+s会执行此方法
  //     // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
  //     const htmlContent = this.state.editorState.toHTML();
  //     const result = await saveEditorContent(htmlContent);
  //   };

  handleEditorChange = (editorState) => {
    this.setState({ editorState });
    //当富文本编辑器不为空时，给表单的details字段设置值
    if (!editorState.isEmpty()) {
      this.props.setDetails(editorState.toHTML());
    } else {
      //富文本编辑器中没内容时，记得给表单字段设置空值，以此来让表单非空验证生效。
      //那么为什么要设置成空，因为就算富文本编辑器没内容editorState.toHTML()返回的也是一个空标签。
      //这里需要思维转换一下，以往的表单的字段和表单项的值都是绑定的，值一变化，字段对应的值也跟着变，表单验证也会生效。
      //而此处我们是手动给表单的字段设置值（由于用的不是ProForm自带的表单项组件，而是第三方的组件）
      this.props.setDetails('');
    }
  };

  render() {
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <AliyunOSSUpload
            accept="image/*"
            showUploadList={false}
            setImageState={this.setImageState}
          >
            <button
              type="button"
              className="control-item button upload-button"
              data-title="插入图片"
            >
              插入图片
            </button>
          </AliyunOSSUpload>
        ),
      },
    ];

    const { editorState } = this.state;
    return (
      <div className="my-component">
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
          //onSave={this.submitContent}
          extendControls={extendControls}
        />
      </div>
    );
  }
}
