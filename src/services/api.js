import axios from 'axios';

const BASE_URL = 'https://dev.bhcjobs.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── GET Endpoints ────────────────────────────────────────────

export const getIndustries = async () => {
  try {
    const response = await api.get('/api/industry/get');
    return { success: true, data: response.data };
  } catch (error) {
    console.log('getIndustries error:', error?.response?.data || error.message);
    return { success: false, error: error?.response?.data || 'Something went wrong' };
  }
};

export const getJobs = async () => {
  try {
    const response = await api.get('/api/job/get');
    return { success: true, data: response.data };
  } catch (error) {
    console.log('getJobs error:', error?.response?.data || error.message);
    return { success: false, error: error?.response?.data || 'Something went wrong' };
  }
};

export const getCompanies = async () => {
  try {
    const response = await api.get('/api/company/get');
    return { success: true, data: response.data };
  } catch (error) {
    console.log('getCompanies error:', error?.response?.data || error.message);
    return { success: false, error: error?.response?.data || 'Something went wrong' };
  }
};

// ─── POST Endpoints ───────────────────────────────────────────

export const loginUser = async (phone, password) => {
  try {
    const response = await api.post('/api/job_seeker/login', { phone, password });
    return { success: true, data: response.data };
  } catch (error) {
    console.log('loginUser error:', error?.response?.data || error.message);
    return { success: false, error: error?.response?.data?.message || 'Login failed' };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/job_seeker/register', userData);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('registerUser error:', error?.response?.data || error.message);
    return { success: false, error: error?.response?.data?.message || 'Registration failed' };
  }
};

export const verifyPhone = async (phone, otp) => {
  try {
    const response = await api.post('/api/job_seeker/phone_verify', { phone, otp });
    return { success: true, data: response.data };
  } catch (error) {
    console.log('verifyPhone error:', error?.response?.data || error.message);
    return { success: false, error: error?.response?.data?.message || 'Verification failed' };
  }
};