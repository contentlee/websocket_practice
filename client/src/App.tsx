import { Routes } from "react-router";
import { Route } from "react-router-dom";
import { LoginPage } from "@login";
import { CommonPage } from "@pages";
import { EntryPage } from "@entry";
import { ChatPage } from "@chat";

function App() {
  return (
    <Routes>
      <Route element={<CommonPage></CommonPage>}>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/" element={<EntryPage />}></Route>
        <Route path="/chat/:name" element={<ChatPage />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
