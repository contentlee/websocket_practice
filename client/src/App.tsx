import { Navigate, Routes } from 'react-router';
import { Route } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { LoginPage } from '@login';
import { CommonPage } from '@pages';
import { EntryPage } from '@entry';
import { ChatPage } from '@chat';
import { CallPage, VideoPage } from '@call';
import { userAtom } from '@atoms/userAtom';

function App() {
  const userInfo = useRecoilValue(userAtom);
  return (
    <Routes>
      <Route element={<CommonPage />}>
        {userInfo.name ? (
          <>
            <Route path="/" element={<EntryPage />}></Route>
            <Route path="/chat/:name" element={<ChatPage />}></Route>
            <Route path="/call/:name" element={<CallPage />}></Route>
            <Route path="/video/:name" element={<VideoPage />}></Route>
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="*" element={<Navigate replace to="/login" />} />
          </>
        )}
      </Route>
    </Routes>
  );
}

export default App;
