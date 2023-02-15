import each from "./each";
import md5 from "js-md5";
// 数据加密

const apiSecret = "C2AE585AB6814937960DF0E0A22DF3FD";
const apiKey = "2CE2BA19C7CA4937AD18BC1AFEE034E8";

export function signParameters(json) {
  var array = [];
  if (!json.platform) {
    json["platform"] = "web";
  }
  json["apiKey"] = apiKey;
  json["timestamp"] = Date.parse(new Date());
  let userJson = {};
  try {
    userJson = JSON.parse(sessionStorage.getItem("userInfos"));
  } catch (error) {}
  if (userJson && userJson.token) {
    json["token"] = userJson.token ? userJson.token : "";
    json["userId"] = userJson.user.userId ? userJson.user.userId : "";
  } else {
    json["token"] = "";
    json["userId"] = "";
  }
  each(json, function (key, value) {
    array[array.length] = key;
  });
  array.sort();
  var sign = "";
  var value;
  each(array, function (i, key) {
    value = json[key];
    if (value !== "" && value !== null) {
      sign = sign + value;
    }
  });
  sign = sign + apiSecret;
  json["sign"] = md5(sign).toUpperCase();
  return json;
}
export function signParametersToURL(json) {
  var array = [];
  if (!json.platform) {
    json["platform"] = "web";
  }
  json["apiKey"] = apiKey;
  let userJson = {};
  try {
    userJson = JSON.parse(sessionStorage.getItem("userInfos"));
  } catch (error) {}
  if (userJson.token) {
    json["token"] = userJson.token ? userJson.token : "";
    json["userId"] = userJson.user.userId ? userJson.user.userId : "";
  } else {
    json["token"] = "";
    json["userId"] = "";
  }
  each(json, function (key, value) {
    array[array.length] = key;
  });
  array.sort();
  var sign = "";
  var value;
  each(array, function (i, key) {
    value = json[key];
    if (value !== "" && value !== null) {
      sign = sign + value;
    }
  });
  sign = sign + apiSecret;
  json["sign"] = md5(sign).toUpperCase();
  return json;
}
