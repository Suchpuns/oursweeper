import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import './css/Rooms.css';
import Board from './Board';
import io from 'socket.io-client';
import { BoardAttributes, CellAttributes } from './Helpers';

const socket = io(import.meta.env.VITE_BE_URL, { autoConnect: false });

const Rooms = () => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [roomName, setRoomName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [startGame, setStartGame] = useState<boolean>(false);
  const [board, setBoard] = useState<CellAttributes[][]>([]);
  useEffect(() => {
    socket.on('connect', () => {
      console.log('hi');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('bye :(');
      setIsConnected(false);
    });

    socket.on('error', (message) => {
      socket.disconnect();
      console.log('ERROR: ' + message);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const addRoom = async () => {
    socket.auth = { username: username };
    socket.connect();
    socket.emit('room:create', roomName);
    return;
  };

  const joinRoom = () => {
    socket.auth = { username: username };
    socket.connect();
    socket.emit('room:join', roomName);
    return;
  };

  const handleRoomNameField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleUsernameField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return (
    <div>
      {isConnected === false ? (
        <>
          <h4>Oursweeper</h4>
          <p>Connected: {'' + isConnected}</p>
          <TextField
            label={'Room name'}
            value={roomName}
            onChange={handleRoomNameField}
          />
          <TextField
            label={'Username'}
            value={username}
            onChange={handleUsernameField}
            sx={{ marginLeft: '1rem' }}
          />
          {roomName !== '' && username !== '' ? (
            <>
              {' '}
              <Button
                variant="contained"
                sx={{ marginLeft: '1rem' }}
                onClick={addRoom}
              >
                Create Game
              </Button>
              <Button
                variant="contained"
                sx={{ marginLeft: '1rem' }}
                onClick={joinRoom}
              >
                Join Game
              </Button>
            </>
          ) : (
            <>
              {' '}
              <Button disabled variant="contained" sx={{ marginLeft: '1rem' }}>
                Create Game
              </Button>
              <Button disabled variant="contained" sx={{ marginLeft: '1rem' }}>
                Join Game
              </Button>
            </>
          )}
        </>
      ) : (
        <Board difficulty={0} board={board} />
      )}
    </div>
  );
};

export default Rooms;
