// 通过字面量方式实现的函数each
const each = function (object, callback) {
    var type = (function () {
      switch (object.constructor) {
        case Object:
          return 'Object';
        case Array:
          return 'Array';
        case NodeList:
          return 'NodeList';
        default:
          return 'null';
      }
    })();
    // 为数组或类数组时, 返回: index, value
    if (type === 'Array' || type === 'NodeList') {
      // 由于存在类数组NodeList, 所以不能直接调用every方法
      [].every.call(object, function (v, i) {
        return callback.call(v, i, v) === false ? false : true;
      });
    }
    // 为对象格式时,返回:key, value
    else if (type === 'Object') {
      for (var i in object) {
        if (callback.call(object[i], i, object[i]) === false) {
          break;
        }
      }
    }
  }
  export default each