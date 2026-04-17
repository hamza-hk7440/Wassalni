import React, { createContext, useState, useEffect } from 'react';
import { getUserInfo } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserFromToken = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    // Fetch latest info from backend to keep balance/role fresh
                    const userInfo = await getUserInfo(parsedUser.id);
                    setUser({ ...parsedUser, ...userInfo });
                    setRole(userInfo.role);
                } catch (error) {
                    console.error('Failed to restore user session:', error);
                    if (error?.response?.status === 401) {
                        logout();
                    } else {
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
                        setRole(parsedUser?.role || null);
                    }
                }
            }
            setLoading(false);
        };

        loadUserFromToken();
    }, []);

    const loginUser = (tokenData, userData) => {
        console.log("test 5", tokenData, userData);
        
        setToken(tokenData);
        setUser(userData);
        setRole(userData.role || 'passenger'); // defaulting if none
        localStorage.setItem('token', tokenData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, role, loginUser, logout, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
