import axios from "axios"
import getConfig from 'next/config';

const { publicRuntimeConfig  } = getConfig();

export const ajax = axios.create({
  baseURL: publicRuntimeConfig.APP_ENV === 'development' ? 'http://localhost:3000' : 'https://velasquez-gym.herokuapp.com',
  withCredentials: true,
});
