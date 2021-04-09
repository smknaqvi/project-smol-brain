import { createContext, useContext, ReactElement } from 'react';
import { Socket } from 'socket.io-client';
import useSocket from './useSocket';

interface PartyContextType {
  socket: Socket;
  isInvalidID: boolean;
  isInvalidPassword: boolean;
  partyID: string;
  password: string;
}

interface PartyContextProviderProps {
  partyID: string;
  password: string;
  children: ReactElement;
}

const PartyContext = createContext<PartyContextType>(null!);

export default function PartyContextProvider({
  children,
  partyID,
  password,
}: PartyContextProviderProps) {
  const contextValue = {
    ...useSocket(partyID, password),
    partyID,
    password,
  } as PartyContextType;

  return (
    <PartyContext.Provider value={contextValue}>
      {children}
    </PartyContext.Provider>
  );
}

export function useParty() {
  return useContext(PartyContext);
}
