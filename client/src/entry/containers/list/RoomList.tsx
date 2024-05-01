import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';

import { userAtom } from '@atoms/userAtom';

import { CreateRoomButton, EmptyItem, LoadingItem, RoomItem } from '.';

type State = 'loading' | 'empty' | 'filled';

interface Room {
  name: string;
  attendee: string[];
  max_length: number;
}

interface Props {
  openModal: () => void;
}

const RoomList = ({ openModal }: Props) => {
  const { socket } = useOutletContext<{ socket: Socket }>();

  const { name: myName } = useRecoilValue(userAtom);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [state, setState] = useState<State>('loading');

  useEffect(() => {
    const changeRoomList = (list: Room[]) => {
      if (list.length) setState('filled');
      else setState('empty');
      setRooms(list);
    };
    socket.emit('get_rooms', myName, changeRoomList);
    socket.on('change_rooms', changeRoomList);

    return () => {
      socket.off('change_rooms', changeRoomList);
    };
  }, [socket, myName]);

  if (state === 'loading') return <LoadingItem />;
  if (state === 'empty') return <EmptyItem openModal={openModal} />;

  return (
    <>
      {rooms.map(({ name, attendee, max_length }) => (
        <RoomItem
          key={name}
          name={name}
          attendee={attendee}
          value={attendee.length}
          possible={attendee.length < max_length}
        />
      ))}

      <CreateRoomButton openModal={openModal} />
    </>
  );
};

export default RoomList;
