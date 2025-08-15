'use client';
import { createContext, useContext, useState } from 'react';
import { UserObject } from '../types/user';

const CurrentUserContext = createContext<{
  currentUser?: UserObject;
  setCurrentUser?: (currentUser: UserObject | undefined) => void;
}>({
  currentUser: undefined,
  setCurrentUser: () => undefined,
});

const useCurrentUserContext = () => useContext(CurrentUserContext);
const CurrentUserProvider = (input: { children: React.ReactNode }) => {
  const { children } = input;
  const [currentUser, setCurrentUser] = useState<UserObject | undefined>(
    undefined,
  );

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export { CurrentUserProvider, CurrentUserContext, useCurrentUserContext };

