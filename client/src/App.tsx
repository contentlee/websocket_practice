import { useEffect, useState } from "react";

import "./App.css";
import { Button, Input } from "./components";
import SubText from "./components/SubText";

function App() {
  const [funnel, setFunnel] = useState("name");
  const [msg, setMsg] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket>();

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget[0] as HTMLInputElement;

    socket?.send(JSON.stringify({ type: "nickname", payload: input.value }));
    input.value = "";

    setFunnel("message");
  };

  const handleMsgSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget[0] as HTMLInputElement;

    socket?.send(JSON.stringify({ type: "message", payload: input.value }));
    input.value = "";
  };

  socket?.addEventListener("open", () => {
    console.log("Connected to Server");
  });

  socket?.addEventListener("close", () => {
    console.log("Disconnected to Server");
  });

  socket?.addEventListener("message", (message) => {
    setMsg([...msg, message.data]);
  });

  useEffect(() => {
    const connection = new WebSocket("ws://localhost:8080");
    setSocket(connection);
  }, []);
  return (
    <div
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {funnel === "name" && (
        <form
          onSubmit={handleNameSubmit}
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "baseline",
            gap: "4px",
          }}
        >
          <SubText>이름을 입력하세요.</SubText>
          <div
            css={{
              display: "flex",
              gap: "4px",
            }}
          >
            <Input></Input>
            <Button type="submit">등록</Button>
          </div>
        </form>
      )}
      {funnel === "message" && (
        <form
          onSubmit={handleMsgSubmit}
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "baseline",
            gap: "4px",
          }}
        >
          <ul
            css={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "baseline",
              width: "100%",
              height: "300px",
              padding: "0 8px",
              margin: 0,
              overflow: "auto",
              listStyle: "none",
              boxSizing: "border-box",
              gap: "4px",
            }}
          >
            {msg.map((message, i) => {
              const [name, text] = message.split(":");
              return (
                <li key={i} css={{ display: "flex", width: "100%", fontSize: "14px" }}>
                  <div
                    css={{
                      fontWeight: 600,
                    }}
                  >
                    {name}
                  </div>
                  <div
                    css={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "start",
                      width: "100%",
                      margin: "0 16px",
                    }}
                  >
                    {text}
                  </div>
                </li>
              );
            })}
          </ul>
          <div
            css={{
              display: "flex",
              gap: "4px",
            }}
          >
            <Input></Input>
            <Button type="submit">보내기</Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default App;
