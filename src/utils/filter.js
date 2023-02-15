import moment from "moment";

// 转换时间戳格式,默认格式YYYY-MM-DD HH:mm:ss
const transferTime = function (timestamp, format) {
  if (!timestamp) return "";
  if (!format) return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
  return moment(timestamp).format(format);
};

const transferNum = function (num) {
  if (!num) return;
  num = num.toString();
  if (num.length == 0) return;
  var str = num;
  var len1 = str.substr(0, 1);
  var len2 = str.substr(1, 1);
  //如果第一位是0，第二位不是点，就用数字把点替换掉
  if (str.length > 1 && len1 == 0 && len2 != ".") {
    str = str.substr(1, 1);
  }
  //第一位不能是.
  if (len1 == ".") {
    str = "";
  }
  //限制只能输入一个小数点
  if (str.indexOf(".") != -1) {
    var str_ = str.substr(str.indexOf(".") + 1);
    if (str_.indexOf(".") != -1) {
      str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
    }
  }
  //正则替换
  str = str.replace(/[^\d^\.]+/g, ""); // 保留数字和小数点
  str = str.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/, "$1"); // 小数点后只能输 2 位
  return str;
};

// 格式化数字，xxxx 转 x,xxx
const NumFormat = function (value) {
  if (!value) return "0";
  else value += "";

  let intPart = parseInt(value); //获取整数部分
  let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); //将整数部分逢三一断

  let floatPart = ".00"; //预定义小数部分
  let value2Array = value.split(".");

  //=2表示数据有小数位
  if (value2Array.length == 2) {
    floatPart = value2Array[1].toString(); //拿到小数部分
    return intPartFormat + "." + floatPart;
  } else {
    return intPartFormat + ".00";
  }
};

// 格式化数字，xxxx 转 x,xxx，无小数点
const NumFormatWithoutPoint = function (value) {
  if (!value) return "0";
  else value += "";

  let intPart = parseInt(value); //获取整数部分
  let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); //将整数部分逢三一断

  let floatPart = ".00"; //预定义小数部分
  let value2Array = value.split(".");

  return intPartFormat;
};

// 性别转换
function transferSex(sexCode) {
  switch (sexCode) {
    case 1:
      return "男";
    case 0:
      return "女";
    default:
      return "";
  }
}

export {
  transferTime,
  transferSex,
  transferNum,
  NumFormat,
  NumFormatWithoutPoint,
};
