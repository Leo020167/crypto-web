export const transforTime = {
  //时间戳--》时:分 日/月
  defaultTime(time) {
    let now = new Date(time * 1000); //(秒--毫秒)
    let year = now.getFullYear();
    let m = now.getMonth() + 1;
    let month = addzero(m);
    let d = now.getDate();
    let date = addzero(d);
    return year + '-' + month + '-' + date;
  },
  defaultDetail(time) {
    let now = new Date(time * 1000); //(秒--毫秒)
    let h = now.getHours();
    let hour = addzero(h);
    let mn = now.getMinutes();
    let minute = addzero(mn);
    let ss = now.getSeconds();
    let seconds = addzero(ss);
    return hour + ':' + minute + ':' + seconds;
  },
  returnAllTime(time) {
    let now = new Date(time * 1000); //(秒--毫秒)
    let year = now.getFullYear();
    let m = now.getMonth() + 1;
    let month = addzero(m);
    let d = now.getDate();
    let date = addzero(d);
    let h = now.getHours();
    let hour = addzero(h);
    let mn = now.getMinutes();
    let minute = addzero(mn);
    let ss = now.getSeconds();
    let seconds = addzero(ss);
    return (
      year +
      '-' +
      month +
      '-' +
      date +
      ' ' +
      hour +
      ':' +
      minute +
      ':' +
      seconds
    );
  },
  returnYMD(time) {
    let now = new Date(time * 1000); //(秒--毫秒)
    let year = now.getFullYear();
    let m = now.getMonth() + 1;
    let month = addzero(m);
    let d = now.getDate();
    let date = addzero(d);
    let h = now.getHours();
    return year + '-' + month + '-' + date;
  },
  parseTime(time, cFormat) {
    if (arguments.length === 0) {
      return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
      date = time;
    } else {
      if (('' + time).length === 10) time = parseInt(time) * 1000;
      date = new Date(time);
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
    };
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key];
      if (key === 'a')
        return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
      if (result.length > 0 && value < 10) {
        value = '0' + value;
      }
      return value || 0;
    });
    return timeStr;
  },
};

function addzero(i) {
  let zi = i < 10 ? '0' + i : i;
  return zi;
}
