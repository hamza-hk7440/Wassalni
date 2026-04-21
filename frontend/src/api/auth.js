import api from './axios';

// Passenger Mobile Login
export const loginMobile = async (credentials) => {
    const response = await api.post('/users/loginmobile', credentials);
    return response.data;
};

// Admin Web Login - Step 1
export const loginWebFirstStep = async (credentials) => {
    console.log("credentials", credentials);
    const response = await api.post('/users/loginwebfirststep', credentials);
    return response.data;
};

// Admin Web Login - Step 2
export const loginWebSecondStep = async (data) => {
    const response = await api.post('/users/loginwebsecondstep', data);
    return response.data;
};

// Controller Login
export const controllerLogin = async (credentials) => {
    const response = await api.post('/users/controllerlogin', credentials);
    return response.data;
};

// Create User (Passenger Signup)
export const registerUser = async (userData) => {
    const response = await api.post('/users/createuser', userData);
    return response.data;
};

// Start Google OAuth flow for web login
export const googleLoginStart = async () => {
    const webRedirect = `${window.location.origin}/login`;
    const response = await api.get('/users/auth/google', {
        params: {
            platform: 'web',
            web_redirect: webRedirect,
        },
    });
    return response.data;
};

// Get Context Profile
export const getUserInfo = async (userId) => {
    const response = await api.post('/users/getuseressentialinfo', { user_id: userId });
    return response.data;
};

// Update profile info
export const updateProfile = async (data) => {
    const response = await api.post('/users/updateprofile', data);
    return response.data;
};

// Change password (requires auth token)
export const changePassword = async (newPassword) => {
    const response = await api.post('/users/changepassword', { new_password: newPassword });
    return response.data;
};

// Redeem tokens from user
export const redeemTokens = async (userId, amount) => {
    const response = await api.post('/users/redeemtokensfromuser', { user_id: userId, amount });
    return response.data;
};

// Get current token balance
export const getTokenBalance = async (userId) => {
    const response = await api.post('/token/gettokenbalance', { user_id: userId });
    return response.data;
};
