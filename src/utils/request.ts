import { extend } from 'umi-request';
import { message } from 'antd';

const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '处理成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '发生验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 *  异常处理程序
 */
const errorHandler = async (error: { response: Response }): Promise<Response> => {
  let { response } = error;
  // 如果有返回值和http状态码
  if (response && response.status) {
    let errorText = codeMessage[response.status] || response.statusText;
    const { status } = response;
    // 等待返回值，转换为json
    const result = await response.json();
    console.log(result);
    //处理422验证未通过的状态
    if (status === 422) {
      for (let key in result.errors) {
        errorText += result.errors[key][0];
      }
    }
    //处理401情况(token过期或没登录)
    if (status === 401) {
      errorText += result.message;
      localStorage.removeItem('access_token');
      message.error(`请求错误 ${status}:  【${errorText}】`);
      history.replace('/user/login');
    }
    //处理400情况
    if (status === 400) {
      errorText += result.message;
    }
    message.error(`请求错误 ${status}:  【${errorText}】`);
  } else if (!response) {
    // 没有返回值
    message.error('无法连接到服务器，请检查您的网络连接是否正常');
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler,
  credentials: 'include',
  // 对request设置统一的前辍
  prefix: '/api',
});

/**
 * 请求拦截器，在向服务器发送请求前会进入该拦截器
 * 用户认证
 * 使用 JWT 认证， 需要认证的 Api， 需要添加指定格式的请求头
 */
request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('access_token') || '';
  const headers = { Authorization: `Bearer ${token}` };
  return {
    url,
    options: { ...options, headers },
  };
});

export default request;
