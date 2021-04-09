import { useEffect, useRef } from 'react';
import MessageBox from '../MessageBox/MessageBox';
import { useParty } from '../PartyPage/PartyContextProvider';
import { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { uniqueId } from 'lodash';
import styled from 'styled-components';

const ClearMessageEnd = styled.span`
  float: 'left';
  clear: 'both';
`;

interface MessagePropsInterface {
  message: string;
  username: string;
}

const useStyles = makeStyles(() => ({
  chat: {
    width: '100%',
    height: '54vh',
    position: 'relative',
    backgroundColor: '#303030',
    paddingTop: '8px',
  },
  item: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  messageList: {
    // scrollbar css copy pasted directly from
    //https://stackoverflow.com/a/59066345
    '&::-webkit-scrollbar': {
      width: '0.4em',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'white',
    },
    overflow: 'scroll',
    overflowY: 'auto',
    height: '48vh',
    overflowX: 'hidden',
  },
}));

export interface UserMessageInterface {
  message: string;
  sender: string;
  timestamp: string;
}
function Chat() {
  //https://linguinecode.com/post/how-to-use-react-useref-with-typescript
  //https://stackoverflow.com/a/55679953
  const messagesEndRef = useRef<HTMLDivElement>(document.createElement('div'));
  const { socket } = useParty();
  const [messages, setMessages] = useState([] as UserMessageInterface[]);
  const classes = useStyles();

  const getTimeStamp = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour12: true,
    });
  };
  const handleSendMessage = useCallback(
    (message: string, username: string | null): void => {
      socket.emit('new-message-client', {
        message: message,
        username: username,
      });
    },
    [socket]
  );

  useEffect(() => {
    // https://stackoverflow.com/questions/11039885/scrollintoview-causing-the-whole-page-to-move/11041376
    messagesEndRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [messages]);

  useEffect(() => {
    socket.on('new-message', (messageProps: MessagePropsInterface) => {
      const newMessage: UserMessageInterface = {
        sender: messageProps.username,
        message: messageProps.message,
        timestamp: getTimeStamp(),
      };

      setMessages((messages) => [...messages, newMessage]);
    });

    socket.on('new-user', (message: string) => {
      const newMessage: UserMessageInterface = {
        sender: '',
        message: message,
        timestamp: getTimeStamp(),
      };

      setMessages((messages) => [...messages, newMessage]);
    });
  }, [socket]);

  return (
    <div className={classes.chat}>
      <List className={classes.messageList} disablePadding dense={true}>
        {/* https://reactjs.org/docs/lists-and-keys.html */}
        {messages.map((message: UserMessageInterface, index: number) => (
          <ListItem
            className={classes.item}
            key={uniqueId('message_')}
            dense={true}
          >
            <ListItemText
              primary={`(${message.timestamp}) ${message.sender}: ${message.message}`}
            />
          </ListItem>
        ))}
        {/* https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react */}
        <ClearMessageEnd ref={messagesEndRef} />
      </List>

      <MessageBox handleSendMessage={handleSendMessage} />
    </div>
  );
}
export default Chat;
