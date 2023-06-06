import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7048'
});

export default axiosInstance;