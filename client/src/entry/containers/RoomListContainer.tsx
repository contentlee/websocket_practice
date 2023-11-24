import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useOutletContext } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

import { alertAtom, modalAtom } from '@atoms/stateAtom';
import { userAtom } from '@atoms/userAtom';
import { useAlert, useAnimate } from '@hooks';

import { AddItem, RoomItem, RoomListLayout } from '../components';
import { EmptyListContainer } from '.';

interface Room {
  name: string;
  attendee: string[];
  max_length: number;
}

const RoomListContainer = () => {
  const navigate = useNavigate();

  const [ref, setAnimation] = useAnimate<HTMLDivElement>();
  const [_, setModal] = useRecoilState(modalAtom);
  const [__, setAlert] = useAlert();

  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name: myName } = useRecoilValue(userAtom);

  const [rooms, setRooms] = useState<Room[]>([]);

  const handleClickRoom = (e: React.MouseEvent, yourName: string) => {
    e.preventDefault();
    const callback = () => setAnimation('fadeOut', () => navigate(`/chat/${name}`));
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

    const needLogin = () => {
      setAlert('error', '로그인이 필요합니다.');
      navigate('/login');
    };
    socket.on('need_login', needLogin);

    return () => {
      socket.off('change_rooms', changeRoom);
      socket.off('need_login', needLogin);
    };
  }, [navigate, setAlert, setAnimation, socket, myName]);

  if (rooms.length === 0)
    return (
      <RoomListLayout>
        <EmptyListContainer />
      </RoomListLayout>
    );

  return (
    <RoomListLayout ref={ref}>
      {rooms.map(({ name, attendee, max_length }) => {
        return (
          <RoomItem
            key={name}
            name={name}
            value={attendee.length}
            possible={attendee.length < max_length}
            onClick={attendee.length < max_length ? (e) => handleClickRoom(e, name) : () => {}}
          />
        );
      })}
      <AddItem onClick={handleClickCreate} />
    </RoomListLayout>
  );
};

export default RoomListContainer;
