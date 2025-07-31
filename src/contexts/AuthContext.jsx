import React, { createContext, useState, useEffect } from 'react';


const AuthContext = createContext();
const API_URL = process.env.VITE_API_URL;
=======
import { v4 as uuidv4 } from 'uuid';
import { API_URL, DB_URL, JWT_SECRET } from '@/config';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState({});

  useEffect(() => {
    console.debug('Loaded env vars', { API_URL, DB_URL, JWT_SECRET });
    const storedUser = localStorage.getItem('alyaUser');
    const storedOnboardingData = localStorage.getItem('alyaOnboardingData');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedOnboardingData) {
      setOnboardingData(JSON.parse(storedOnboardingData));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storedUsers = JSON.parse(localStorage.getItem('alyaRegisteredUsers') || '[]');
        const foundUser = storedUsers.find(u => u.email === email && u.password === password);

        if (foundUser) {
          const userData = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name || 'Utilisateur Alya',
            avatarUrl: foundUser.avatarUrl || `https://avatar.vercel.sh/${foundUser.email}.png?size=128`,
            onboardingCompleted: foundUser.onboardingCompleted || false,
            preferences: foundUser.preferences || {}
          };
          setUser(userData);
          localStorage.setItem('alyaUser', JSON.stringify(userData));

          const userOnboardingKey = `alyaOnboardingData_${foundUser.id}`;
          const storedUserOnboardingData = localStorage.getItem(userOnboardingKey);
          if (storedUserOnboardingData) {
            setOnboardingData(JSON.parse(storedUserOnboardingData));
          } else {
            setOnboardingData(userData.preferences || {});
          }

          setLoading(false);
          resolve(userData);
        } else {
          setLoading(false);
          reject(new Error('Email ou mot de passe incorrect.'));
        }
      }, 1000);
    });
  };

  const signup = (name, email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let storedUsers = JSON.parse(localStorage.getItem('alyaRegisteredUsers') || '[]');
        if (storedUsers.find(u => u.email === email)) {
          setLoading(false);
          reject(new Error('Un compte avec cet email existe déjà.'));
          return;
        }

        const newUser = {
          id: uuidv4(),
          name,
          email,
          password,
          avatarUrl: `https://avatar.vercel.sh/${email}.png?size=128`,
          onboardingCompleted: false,
          preferences: {}
        };
        storedUsers.push(newUser);
        localStorage.setItem('alyaRegisteredUsers', JSON.stringify(storedUsers));

        const userData = { ...newUser };
        delete userData.password;

        setUser(userData);
        localStorage.setItem('alyaUser', JSON.stringify(userData));
        setOnboardingData({});
        const userOnboardingKey = `alyaOnboardingData_${newUser.id}`;
        localStorage.setItem(userOnboardingKey, JSON.stringify({}));

        setLoading(false);
        resolve(userData);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setOnboardingData({});
    localStorage.removeItem('alyaUser');
  };


=======
  const updateUserProfile = (profileData) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!user) {
          setLoading(false);
          reject(new Error('Aucun utilisateur connecté.'));
          return;
        }
        const updatedUser = { ...user, ...profileData };

        if (profileData.onboardingCompleted === true && !user.onboardingCompleted) {
          const finalPreferences = { ...user.preferences, ...onboardingData };
          updatedUser.preferences = finalPreferences;
          let storedUsers = JSON.parse(localStorage.getItem('alyaRegisteredUsers') || '[]');
          storedUsers = storedUsers.map(u => u.id === user.id ? { ...u, ...updatedUser, preferences: finalPreferences, password: u.password } : u);
          localStorage.setItem('alyaRegisteredUsers', JSON.stringify(storedUsers));
        }

        setUser(updatedUser);
        localStorage.setItem('alyaUser', JSON.stringify(updatedUser));

        let storedUsers = JSON.parse(localStorage.getItem('alyaRegisteredUsers') || '[]');
        storedUsers = storedUsers.map(u => {
          if (u.id === user.id) {
            const { password, ...restOfUser } = u;
            return { ...restOfUser, ...updatedUser, password };
          }
          return u;
        });
        localStorage.setItem('alyaRegisteredUsers', JSON.stringify(storedUsers));

        setLoading(false);
        resolve(updatedUser);
      }, 500);
    });
  };

  const updateOnboardingData = (newDataStep) => {
    setOnboardingData(prevData => {
      const updatedData = { ...prevData, ...newDataStep };
      if (user) {
        const userOnboardingKey = `alyaOnboardingData_${user.id}`;
        localStorage.setItem(userOnboardingKey, JSON.stringify(updatedData));
      }
      return updatedData;
    });
  };


  const isOnboardingCompleted = () => {
    return user ? user.onboardingCompleted : false;
  };

  return (

    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, onboardingData, isOnboardingCompleted }}>
=======
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserProfile, onboardingData, updateOnboardingData, isOnboardingCompleted }}>

      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;
=======


export default AuthContext;
