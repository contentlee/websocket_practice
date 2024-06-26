import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { roomSocket } from '@socket';

import { userAtom } from '@atoms/userAtom';

import { CreateRoomButton, EmptyItem, LoadingItem, RoomItem } from '.';
import { Room } from '@utils/types';

type State = 'loading' | 'empty' | 'filled';

interface Props {
  openModal: () => void;
}

const RoomList = ({ openModal }: Props) => {
  const { name: userName } = useRecoilValue(userAtom);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [state, setState] = useState<State>('loading');

  useEffect(() => {
    const callback = (list: Room[]) => {
      if (list.length) setState('filled');
      else setState('empty');
      setRooms(list);
    };

    roomSocket.getRooms(userName, callback);
    roomSocket.changeRooms(callback).on();

    return () => {
      roomSocket.changeRooms(callback).off();
    };
  }, [roomSocket, userName]);

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
          possible={attendee.length < max_length!}
        />
      ))}

      <CreateRoomButton openModal={openModal} />
    </>
  );
};

export default RoomList;
