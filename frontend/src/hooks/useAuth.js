// src/hooks/useAuth.js
export const useAuth = () => {
  // For now, we'll just return a dummy user object
  return {
    user: { name: "Test User" },
    isAuthenticated: true,
  };
};
export default useAuth;