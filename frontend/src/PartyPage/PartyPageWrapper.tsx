import { useEffect, useState, ReactElement } from 'react';
import { useHistory } from 'react-router';
import RoomPasswordDialog from '../Dialogs/RoomPasswordDialog';
import API from '../utils/API';
import InvalidPartyDialog from '../Dialogs/InvalidPartyDialog';
import PartyContextProvider from './PartyContextProvider';
import { Box, CircularProgress } from '@material-ui/core';

interface WithPasswordPartyPageProps {
  children: ReactElement;
}

interface LocationState {
  isValidated?: boolean;
  hasPassword?: boolean;
  password?: string;
}

export default function PartyPageWrapper({
  children,
}: WithPasswordPartyPageProps) {
  const history = useHistory();
  const partyID = history.location.pathname.split('/')[2] || '';

  const locationState = history.location.state as LocationState | undefined;
  const [isValidated, setIsValidated] = useState(!!locationState?.isValidated);
  const [password, setPassword] = useState(locationState?.password || '');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isInvalidID, setIsInvalidID] = useState(false);

  useEffect(() => {
    if (!isValidated) {
      API.get(`/party/${partyID}`)
        .then((res) => {
          setIsPasswordDialogOpen(res.data.hasPassword && !password);
        })
        .catch(() => {
          setIsInvalidID(true);
        })
        .finally(() => {
          setIsValidated(true);
        });
    } else if (!isPasswordDialogOpen) {
      setIsPasswordDialogOpen(!!locationState?.hasPassword && !password);
    }
  }, [
    isPasswordDialogOpen,
    isValidated,
    locationState?.hasPassword,
    partyID,
    password,
  ]);

  if (!isValidated) {
    return (
      <Box
        display="flex"
        height="100%"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isInvalidID) {
    return <InvalidPartyDialog isOpen={isInvalidID} />;
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
      {children}
    </PartyContextProvider>
  );
}
