import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// const baseURL = 'http://localhost:5000';

// console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
// console.log('baseURL configurada:', baseURL);

const api = axios.create({
    baseURL,
    timeout: 5000
});

export{ api, baseURL }; 