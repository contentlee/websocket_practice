import { Routes } from "react-router";
import { Route } from "react-router-dom";
import { LoginPage } from "@login";
import { CommonPage } from "@pages";
import { EntryPage } from "@entry";
import { ChatPage, VideoPage } from "@chat";

function App() {
  return (
    <Routes>
      <Route element={<CommonPage></CommonPage>}>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/" element={<EntryPage />}></Route>
        <Route path="/chat/:name" element={<ChatPage />}></Route>
        <Route path="/video/:name" element={<VideoPage />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
