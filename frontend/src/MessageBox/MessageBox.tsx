import { useState } from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useAppState from '../state/useAuth';

interface ChatBoxPropsInterface {
  handleSendMessage: (message: string, username: string | null) => void;
}
const useStyles = makeStyles(() => ({
  messagebox: {
    position: 'absolute',
    bottom: '0',
    width: '95%',
  },
}));
function MessageBox({ handleSendMessage }: ChatBoxPropsInterface) {
  const [message, setMessage] = useState('');
  const classes = useStyles();
  const { username } = useAppState();
  return (
    <form
      className={classes.messagebox}
      onSubmit={(e) => {
        e.preventDefault();
        if (message.trim()) {
          handleSendMessage(message, username);
          setMessage('');
        }
      }}
    >
      <TextField
        fullWidth
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message in chat"
      />
    </form>
  );
}
export default MessageBox;
