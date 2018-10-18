import axios from 'axios';
import { throttleAdapterEnhancer } from 'axios-extensions';

export default
  axios.create({
    baseURL: 'http://localhost:3001/api/',
    timeout: 2000,
    headers: { 'Cache-Control': 'no-cache' },
	  adapter: throttleAdapterEnhancer(axios.defaults.adapter, 2 * 1000)
  });
