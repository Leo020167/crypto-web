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
};

function addzero(i) {
  let zi = i < 10 ? '0' + i : i;
  return zi;
}
