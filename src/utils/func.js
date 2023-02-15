/***重写element-ui $message 解决消息多次弹出的问题**/
import { Message } from 'element-ui';

let messageInstance = null;
const overrideMessage = (options) => {
  if (messageInstance) {
    messageInstance.close();
  }
  messageInstance = Message(options);
};
['error', 'success', 'info', 'warning'].forEach((type) => {
  overrideMessage[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options,
      };
    }
    options.type = type;
    return overrideMessage(options);
  };
});

export default {
  install(Vue) {
    // 重写elementui的弹框
    Vue.prototype.$message = overrideMessage;
    /**
     * 精确保留小数位数
     * @param {要转换的数字} num
     * @param {要保留的位数} keepDigit
     */
    Vue.prototype.round = function (num) {
      // const newNum = parseFloat(num)
      // return round(newNum, keepDigit);
      var result = parseFloat(num);
      if (isNaN(result)) {
        return '';
      }
      result = Math.round(num * 100) / 100;
      var s_x = result.toString();
      var pos_decimal = s_x.indexOf('.');
      if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
      }
      while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
      }
      return s_x;
    };
  },
};
