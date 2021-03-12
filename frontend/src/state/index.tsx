import React, { createContext, useContext, useState } from 'react';
import useAuth from './useAuth';

interface StateContextType {
  isAuthReady: boolean;
  error: Error | null;
  setError(error: Error | null): void;
  username: string;
  signIn(username: string, password: string): Promise<void>;
  signUp(username: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}
const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<Error | null>(null);

  const contextValue = {
    error,
    setError,
    ...useAuth(),
  } as StateContextType;

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  return useContext(StateContext);
}
