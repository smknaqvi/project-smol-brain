import { useEffect, useState, ReactElement } from 'react';
import { useHistory } from 'react-router';
import RoomPasswordDialog from '../Dialogs/RoomPasswordDialog';
import API from '../utils/API';
import InvalidPartyDialog from '../Dialogs/InvalidPartyDialog';
import PartyContextProvider from './PartyContextProvider';

interface WithPasswordPartyPageProps {
  children: ReactElement;
}

interface LocationState {
  isValidated?: boolean;
  hasPassword?: boolean;
  password?: string;
}

export default function AppStateProvider({
  children,
}: WithPasswordPartyPageProps) {
  const history = useHistory();
  const partyID = history.location.pathname.split('/')[2] || '';

  const locationState = history.location.state as LocationState | undefined;
  const [isValidated, setIsValidated] = useState(!!locationState?.isValidated);
  const [hasPassword, setHasPassword] = useState(!!locationState?.hasPassword);
  const [password, setPassword] = useState(locationState?.password || '');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isInvalidID, setIsInvalidID] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isValidated && !isLoading) {
      setIsLoading(true);
      API.get(`/party/${partyID}`)
        .then((res) => {
          setHasPassword(res.data.hasPassword);
          setIsPasswordDialogOpen(res.data.hasPassword && !password);
        })
        .catch(() => {
          setIsInvalidID(true);
        })
        .finally(() => {
          setIsValidated(true);
          setIsLoading(false);
        });
    } else if (!isPasswordDialogOpen) {
      setIsPasswordDialogOpen(hasPassword && !password);
    }
  }, [
    hasPassword,
    isPasswordDialogOpen,
    isValidated,
    partyID,
    password,
    isLoading,
  ]);

  if (!isValidated) {
    return <p>Loading</p>;
  }

  return isPasswordDialogOpen ? (
    <RoomPasswordDialog
      isOpen={isPasswordDialogOpen}
      password={password}
      onChange={({ target: { value } }) => {
        setPassword(value);
      }}
      closeFunction={() => setIsPasswordDialogOpen(false)}
    />
  ) : (
    <PartyContextProvider partyID={partyID} password={password}>
      {isInvalidID ? <InvalidPartyDialog isOpen={isInvalidID} /> : children}
    </PartyContextProvider>
  );
}
