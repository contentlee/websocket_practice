import { useNavigate } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';

import AddIcon from '@assets/add_circle_icon.svg';

import { modalAtom } from '@atoms/stateAtom';
import { userAtom } from '@atoms/userAtom';
import { palette } from '@utils/palette';
import { Icon, Polygon, Regtangle } from '@components';

const EmptyListContainer = () => {
  const navigate = useNavigate();

  const userInfo = useRecoilValue(userAtom);
  const [_, setModal] = useRecoilState(modalAtom);

  const handleClickCreate = (e: React.MouseEvent) => {
    e.preventDefault();
    if (userInfo.name === '') return navigate('/login');
    setModal({ isOpened: true, type: 'create' });
  };
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '20px',
        border: '1.5px solid' + palette.main.blk,
        boxSizing: 'border-box',
        gap: '10px',
      }}
    >
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Polygon></Polygon>
        <div
          css={{
            color: palette.main.blk,
            fontSize: '14px',
          }}
        >
          <div>채팅방이 존재하지 않습니다.</div>
          <div>새로운 대화를 만들어보세요!</div>
        </div>

        <Regtangle></Regtangle>
      </div>
      <Icon src={AddIcon} onClick={handleClickCreate}></Icon>
    </div>
  );
};

export default EmptyListContainer;
