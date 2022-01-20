import axios, { Axios } from 'axios';

export function storeAccessToken(data: Record<string, any>) {
  const { access_token, token_type, expires_in, permission } = data;
  localStorage.setItem('auth', JSON.stringify({
    access_token,
    token_type,
    expires_at: new Date().getTime() + (data.expires_in * 1000),
    permission,
  }));
}

export function refresh(axiosInstance: Axios) {
  return async function (config: any) {
    const auth = localStorage.getItem('auth');
    if (auth !== null && JSON.parse(auth).expires_at <= (new Date()).getTime()) {
      const { data, status } = await axiosInstance.post('/auth');
      if (status !== 200) { return config; }
      storeAccessToken(data);
      axios.defaults.headers.common['Authorization'] = data.access_token;
    }
    return config;
  }
}
