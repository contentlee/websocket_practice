import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useOutletContext } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

import { userAtom } from '@atoms/userAtom';
import { useAnimate, useModal } from '@hooks';

import { AddItem, RoomItem, RoomListLayout } from '../components';
import { CreateRoomModal, EmptyListContainer } from '.';
import { useGetRooms } from '@api/room';
import { modalAtom } from '@atoms/stateAtom';

interface Room {
  name: string;
  attendee: string[];
  max_length: number;
}

const RoomListContainer = () => {
  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name: myName } = useRecoilValue(userAtom);
  const [_, setModal] = useRecoilState(modalAtom);

  const [rooms, setRooms] = useState<Room[]>([]);

  const handleClickRoom = (e: React.MouseEvent, yourName: string) => {
    e.preventDefault();
    const callback = () => navigate(`/chat/${yourName}`);
    socket.emit('enter_room', yourName, myName, callback);
  };

  const handleClickCreate = (e: React.MouseEvent) => {
    e.preventDefault();
    setModal({ isOpened: true, type: 'create' });
  };

  useEffect(() => {
    const changeRoomList = (roomList: Room[]) => setRooms(roomList);
    socket.emit('get_rooms', myName, changeRoomList);

    const changeRoom = (list: Room[]) => setRooms(list);
    socket.on('change_rooms', changeRoom);

    return () => {
      socket.off('change_rooms', changeRoom);
    };
  }, [socket, myName]);

  return (
    <RoomListLayout>
      {rooms.length === 0 ? (
        <EmptyListContainer />
      ) : (
        rooms.map(({ name, attendee, max_length }) => {
          return (
            <RoomItem
              key={name}
              name={name}
              value={attendee.length}
              possible={attendee.length < max_length}
              onClick={attendee.length < max_length ? (e) => handleClickRoom(e, name) : () => {}}
            />
          );
        })
      )}
      <AddItem onClick={handleClickCreate} />
    </RoomListLayout>
  );
};

export default RoomListContainer;
