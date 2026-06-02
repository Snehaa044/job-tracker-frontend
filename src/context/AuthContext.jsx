import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('jt_token');
    const email = localStorage.getItem('jt_email');
    const name = localStorage.getItem('jt_name');
    return token ? { token, email, name } : null;
  });

  const login = (data) => {
    localStorage.setItem('jt_token', data.token);
    localStorage.setItem('jt_email', data.email);
    localStorage.setItem('jt_name', data.fullName);
    setUser({ token: data.token, email: data.email, name: data.fullName });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);