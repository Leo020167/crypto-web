export default class Tools {
  /**
   * 是否为开发模式
   * @returns {boolean}
   */
  static isDev(){
    return process.env.NODE_ENV === 'development';
  }

  /**
   *
   * 前端获取后台地址
   * @returns {string}
   */
  static getWebURL() {
    return this.isDev() ? 'http://localhost' : '' // api的base_url
  }

  /**
   * 获取url地址，如http://127.0.0.1:8080
   * @returns {string}
   */
  static getBaseURL(){
    let _pro = window.location.protocol;
    return _pro+'//'+this.getBaseURI();
  }

  /**
   * 获取uri地址，如127.0.0.1:8080
   * @returns {*}
   */
  static getBaseURI(){
    if(this.getURIPort()===80)
      return this.getURIHost();
    return this.getURIHost()+':'+this.getURIPort();
  }

  /**
   * 获取IP
   * @returns {string}
   */
  static getURIHost(){
    return window.location.host;
  }

  /**
   * 获取端口号
   * @returns {any}
   */
  static getURIPort(){
    let _port = window.location.port;
    return _port?_port:80;
  }

  /**
   * 获取URL参数
   * @returns {*}
   */
  static getURLParam(key) {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i=0;i<vars.length;i++) {
      let pair = vars[i].split("=");
      if(pair[0] === key){return pair[1];}
    }
    return(false);
  }
}

//输入延迟搜索
export function debounce(func, delay) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}