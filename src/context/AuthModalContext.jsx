import React, { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export const useAuthModal = () => useContext(AuthModalContext);

export const AuthModalProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthModalContext.Provider value={{ isLoginModalOpen, openLoginModal, closeLoginModal }}>
      {children}
    </AuthModalContext.Provider>
  );
};
