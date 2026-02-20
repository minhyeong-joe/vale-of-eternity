import api from './api';

export const signIn = async (username: string, password: string) => {
    const response = await api.post('/users/signin', { username, password });
    if (response.status == 400) {
        throw new Error(response?.data?.message || 'Failed to sign in');
    } else if (response.status != 200) {
        throw new Error('Unexpected error during sign in');
    }
    return response.data.data;
};

export const signUp = async (username: string, password: string, email: string) => {
    const response = await api.post('/users/signup', { email, username, password });
    if (response.status == 400) {
        throw new Error(response?.data?.message || 'Failed to sign up');
    } else if (response.status != 201) {
        throw new Error('Unexpected error during sign up');
    }
    return response.data.data;
};