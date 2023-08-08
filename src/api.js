// api.js

import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const getTimestamp = async (address) => {
  try {
  
    const response = await axios.get(`${BASE_URL}/timestamps/${address}`);
  
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTimestamp = async (address) => {
  try {
    const response = await axios.post(`${BASE_URL}/timestamps`, { address });
    return response.data;
  } catch (error) {
    throw error;
  }
};