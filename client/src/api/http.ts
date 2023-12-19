import axios from 'axios';

const http = axios.create({
  url: 'http://localhost:8080',
  timeout: 5000,
});

export default http;
