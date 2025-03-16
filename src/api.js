import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
});

// const handleTokenRefresh = async (error) => {

//   const originalRequest = error.config;

//   if (error.response.status === 401 && !originalRequest._retry) {
//     originalRequest._retry = true;

//     const refreshToken = Cookies.get('refreshToken');

//     try {
//       const response = await axios.post('user/refresh-access-token', { refreshToken });
//       const newAccessToken = response.data.accessToken;

//       Cookies.set('access_token', newAccessToken);

//       originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//       return axios(originalRequest);

//     } catch (refreshError) {
//       console.error('Refresh token failed', refreshError);
//     }
//   }

//   return Promise.reject(error);
// };

instance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('access_token'); 
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    alert('Error in request')
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    // console.log(response)
    return response;  
  },
  // async (error) => {
  //   if (error.response.status === 401) {
  //     return handleTokenRefresh(error);
  //   }
  //   return Promise.reject(error);
  // }
);

export default instance;


