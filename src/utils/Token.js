import Cookies from 'js-cookie'

const LoginKey = 'token';

export function getToken() {
  let _token = Cookies.get(LoginKey);
  if (typeof(_token) === "undefined")
    return '';
  else
    return Cookies.get(LoginKey);
}

export function setToken(token) {
  return Cookies.set(LoginKey, token)
}

export function removeToken() {
  return Cookies.remove(LoginKey)
}