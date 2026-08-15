import axios from 'axios';

// ✅ Use environment variable or fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

console.log('🔗 API URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// ✅ Request Interceptor
api.interceptors.request.use(
    (config) => {
        console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error.message);
        return Promise.reject(error);
    }
);

// ✅ FIXED: Response Interceptor with Proper Error Handling
api.interceptors.response.use(
    (response) => {
        console.log(`📥 ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        // ✅ Handle different types of errors properly
        let errorMessage = 'Unknown error occurred';
        
        if (error.code === 'ECONNABORTED') {
            errorMessage = 'Request timeout - Server is taking too long to respond';
        } else if (error.response) {
            // Server responded with error status
            errorMessage = error.response.data?.message || error.response.statusText || 'Server error';
            console.error('❌ Server Error:', error.response.status, error.response.data);
        } else if (error.request) {
            // Request was made but no response received
            errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
            console.error('❌ Network Error - No response from server:', error.request);
        } else {
            // Something else happened
            errorMessage = error.message || 'Unknown error';
            console.error('❌ Error:', error.message);
        }
        
        // ✅ Create enhanced error object
        const enhancedError = {
            ...error,
            userMessage: errorMessage,
            isNetworkError: !error.response,
            isTimeout: error.code === 'ECONNABORTED',
            status: error.response?.status,
            data: error.response?.data,
        };
        
        return Promise.reject(enhancedError);
    }
);

export const getTasks = async () => {
    try {
        const response = await api.get('/tasks');
        return response;
    } catch (error) {
        console.error('❌ getTasks failed:', error.userMessage || error.message);
        throw error;
    }
};

export const getTask = async (id) => {
    try {
        const response = await api.get(`/tasks/${id}`);
        return response;
    } catch (error) {
        console.error(`❌ getTask ${id} failed:`, error.userMessage || error.message);
        throw error;
    }
};

export const createTask = async (task) => {
    try {
        const response = await api.post('/tasks', task);
        return response;
    } catch (error) {
        console.error('❌ createTask failed:', error.userMessage || error.message);
        throw error;
    }
};

export const updateTask = async (id, task) => {
    try {
        const response = await api.put(`/tasks/${id}`, task);
        return response;
    } catch (error) {
        console.error(`❌ updateTask ${id} failed:`, error.userMessage || error.message);
        throw error;
    }
};

export const deleteTask = async (id) => {
    try {
        const response = await api.delete(`/tasks/${id}`);
        return response;
    } catch (error) {
        console.error(`❌ deleteTask ${id} failed:`, error.userMessage || error.message);
        throw error;
    }
};

export default api;