import axiosClass, { CreateAxiosDefaults } from 'axios';

// Common axios configurations
const config: CreateAxiosDefaults = {
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
};

// Client accessible instance
export const axios = axiosClass.create(config);

// For backend to request resources with system privileges
export const client = axiosClass.create({
    ...config,
    headers: {
        ...config.headers,
        Authorization: `Bearer ${process.env.SYSTEM_API_TOKEN}`,
    },
});
