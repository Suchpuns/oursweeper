import { atom } from 'recoil';

const boardState = atom({
  key: 'boardState',
  default: [[{ hidden: true, value: -1 }]],
});

export type RoomInfo = {
  roomName: string;
  username: string;
};

const defaultRoomInfo: RoomInfo = {
  roomName: '',
  username: '',
};

const roomInfoState = atom({
  key: 'roomInfoState',
  default: defaultRoomInfo,
});

export { boardState, roomInfoState };
