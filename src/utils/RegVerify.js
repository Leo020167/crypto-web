/** 
 * 常用正则表达式
 */
// 验证多个手机号码(逗号隔开)
export function checkMobile(rule, value, callback) {
  var phoneNumbers = value.split("，");
  var rePhone = /^((\+?86)|(\(\+86\)))?1\d{10}$/;
  var ifOk = true;
  if (value == '' || value == undefined || value == null) {
    callback(new Error(this.$t('regVerify.checkMobile.error1')));
  }
  for (let i = 0; i < phoneNumbers.length; i++) {
    if (phoneNumbers[i] === "") {
      callback(new Error(this.$t('regVerify.checkMobile.error2')));
    } else if (!rePhone.test(phoneNumbers[i])) {
      ifOk = false;
      callback(new Error(this.$t('regVerify.checkMobile.error3')));
    }
  }
  if (ifOk) callback();
};
// 是否邮箱
export function validateEMail(rule, value, callback) {
  const reg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (value == '' || value == undefined || value == null) {
    callback(new Error("请输入邮箱"));
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱'));
    } else {
      callback();
    }
  }
}
// 验证多个邮箱(用逗号隔开)
export function validateManyEMail(rule, value, callback) {
  const emails = value.split(",");
  let ifOk = true;
  const reg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (value == '' || value == undefined || value == null) {
    callback();
  } else {
    for (let i = 0; i < emails.length; i++) {
      if (emails[i] === "") {
        callback(new Error("请输入正确的邮箱"));
      } else if (!reg.test(emails[i])) {
        ifOk = false;
        callback(new Error("请输入正确的邮箱"));
      }
    }
    if (ifOk) callback();
  }
}
// 验证身份证号码，支持1/2代，15位/18位数字
export function validateIdNo(rule, value, callback) {
  const reg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
  if (value == '' || value == undefined || value == null) {
    callback();
  } else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的身份证号码'));
    } else {
      callback();
    }
  }
}
// 是否合法IP地址
export function validateIP(rule, value, callback) {
  if (value == '' || value == undefined || value == null) {
    callback();
  } else {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的IP地址'));
    } else {
      callback();
    }
  }
}

// 是否手机号码或者固话
export function validatePhoneTwo(rule, value, callback) {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;;
  if (value == '' || value == undefined || value == null) {
    callback(new Error('请输入手机号码'));
  } else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的手机号码'));
    } else {
      callback();
    }
  }
}

// 是否固话
export function validateTelphone(rule, value, callback) {
  const reg = /0\d{2,3}-\d{7,8}/;
  if (value == '' || value == undefined || value == null) {
    callback();
  } else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的固定电话）'));
    } else {
      callback();
    }
  }
}

// 是否手机号码
export const validatePhone = function (rule, value, callback) {
  const reg = /^[1][3-9][0-9]{9}$/;
  if (value == '' || value == undefined || value == null) {
    callback(new Error(this.$t('regVerify.checkMobile.error1')));
  } else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error(this.$t('regVerify.checkMobile.error2')));
    } else {
      callback();
    }
  }
}

// 合法url
export function validateURL(url) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(url);
}

// 验证内容是否包含英文数字以及下划线
export function isPassword(rule, value, callback) {
  const reg = /^[_a-zA-Z0-9]+$/;
  if (value == '' || value == undefined || value == null) {
    callback();
  } else {
    if (!reg.test(value)) {
      callback(new Error('仅由英文字母，数字以及下划线组成'));
    } else {
      callback();
    }
  }
}

// 自动检验数值的范围
export function checkMax20000(rule, value, callback) {
  if (value == '' || value == undefined || value == null) {
    callback();
  } else if (!Number(value)) {
    callback(new Error('请输入[1,20000]之间的数字'));
  } else if (value < 1 || value > 20000) {
    callback(new Error('请输入[1,20000]之间的数字'));
  } else {
    callback();
  }
}

// 验证数字输入框最大数值
export function checkMaxVal(rule, value, callback) {
  if (value < 0 || value > 最大值) {
    callback(new Error('请输入[0,最大值]之间的数字'));
  } else {
    callback();
  }
}

// 验证是否1-99之间
export function isOneToNinetyNine(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[1-9][0-9]{0,1}$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数，值为【1,99】'));
      } else {
        callback();
      }
    }
  }, 0);
}

// 密码校验
export const validatePsdReg = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  if (!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/.test(value)) {
    callback(new Error('请输入6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种'))
  } else {
    callback()
  }
}

// 账号校验
export const validateCode = function(rule, value, callback) {
  if (!value) {
    return callback(new Error(this.$t('regVerify.validateCode.error1')))
  }
  if (!/^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]{8,16}$/.test(value)) {
    callback(new Error(this.$t('regVerify.validateCode.error2')))
  } else {
    callback()
  }
}

// 纯数字校验
export const validateNumber = (rule, value, callback) => {
  let numberReg = /^\d+$|^\d+[.]?\d+$/
  if (value !== '') {
    if (!numberReg.test(value)) {
      callback(new Error('请输入数字'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入值'))
  }
}

// 最多一位小数
export const onePoint = (rule, value, callback) => {
    if (!/^[0-9]+([.]{1}[0-9]{1})?$/.test(value)) {
      callback(new Error('最多一位小数！！！'));
    } else {
      callback();
    }
  };
  
