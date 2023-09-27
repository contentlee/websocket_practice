// import { useEffect, useState } from "react";
// import { Button, Input } from "./components";
// import SubText from "./components/SubText";
import { Routes } from "react-router";
import { Route } from "react-router-dom";
import { LoginPage } from "@login";
import { CommonPage } from "@pages";

// interface Message {
//   type: "welcome" | "message" | "myMessage";
//   message: string;
//   name: string;
// }

function App() {
  // const [funnel, setFunnel] = useState("room");

  // const [socket, setSocket] = useState<Socket>();

  // const [room, setRoom] = useState("자유로운 채팅방");
  // const [rooms, setRooms] = useState([]);
  // const [name, setName] = useState("익명");
  // const [msg, setMsg] = useState<Message[]>([]);

  // const handleRoomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const input = e.currentTarget[0] as HTMLInputElement;
  //   socket?.emit("create_room", input.value, () => {
  //     setRoom(input.value);
  //     input.value = "";
  //     setFunnel("name");
  //   });
  // };

  // const hadnleRoomeClick = (e: React.MouseEvent<HTMLInputElement>) => {
  //   e.preventDefault();
  //   const clickedRoom = (e.target as HTMLInputElement).value;
  //   socket?.emit("enter_room", clickedRoom, () => {
  //     setRoom(clickedRoom);
  //     setFunnel("name");
  //   });
  // };

  // const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const input = e.currentTarget[0] as HTMLInputElement;
  //   socket?.emit("set_name", input.value, room, () => {
  //     setName(input.value);
  //     input.value = "";
  //     setFunnel("message");
  //   });
  // };

  // const handleMsgSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const input = e.currentTarget[0] as HTMLInputElement;

  //   socket?.emit("new_message", input.value, room, name, () => {
  //     const message = input.value;
  //     setMsg([...msg, { type: "myMessage", name: "me", message }]);
  //     input.value = "";
  //   });
  // };

  // socket?.on("welcome", (name) => {
  //   setMsg([...msg, { type: "welcome", name, message: "이(가) 참여하셨습니다." }]);
  // });

  // socket?.on("new_message", (name, message) => {
  //   setMsg([...msg, { type: "message", name, message }]);
  // });

  // socket?.on("change_rooms", (list) => {
  //   console.log(list);
  //   setRooms(list);
  // });

  // useEffect(() => {
  //   const connected = io("ws://localhost:8080") as Socket;
  //   setSocket(connected);
  // }, []);

  return (
    <Routes>
      <Route element={<CommonPage></CommonPage>}></Route>
      <Route path="/" element={<LoginPage></LoginPage>}></Route>
    </Routes>
    // <div
    //   css={{
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     width: "100%",
    //     height: "100%",
    //   }}
    // >

    //   {funnel === "room" && (
    //     <div>
    //       <form
    //         onSubmit={handleRoomSubmit}
    //         css={{
    //           display: "flex",
    //           flexDirection: "column",
    //           alignItems: "baseline",
    //           gap: "4px",
    //         }}
    //       >
    //         <SubText>생성할 방의 이름을 입력하세요.</SubText>
    //         <div
    //           css={{
    //             display: "flex",
    //             gap: "4px",
    //           }}
    //         >
    //           <Input></Input>
    //           <Button type="submit">등록</Button>
    //         </div>
    //       </form>
    //       <div>
    //         <div>개설된 방 이름</div>
    //         <ul>
    //           {rooms.map((roomName) => {
    //             return (
    //               <li key={roomName}>
    //                 <input type="button" value={roomName} onClick={hadnleRoomeClick}></input>
    //               </li>
    //             );
    //           })}
    //         </ul>
    //       </div>
    //     </div>
    //   )}
    //   {funnel === "name" && (
    //     <form
    //       onSubmit={handleNameSubmit}
    //       css={{
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "baseline",
    //         gap: "4px",
    //       }}
    //     >
    //       <SubText>이름을 입력하세요.</SubText>
    //       <div
    //         css={{
    //           display: "flex",
    //           gap: "4px",
    //         }}
    //       >
    //         <Input></Input>
    //         <Button type="submit">등록</Button>
    //       </div>
    //     </form>
    //   )}
    //   {funnel === "message" && (
    //     <form
    //       onSubmit={handleMsgSubmit}
    //       css={{
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "baseline",
    //         gap: "4px",
    //       }}
    //     >
    //       <div css={{ margin: "4px", fontWeight: 600 }}>ROOM {room}</div>
    //       <ul
    //         css={{
    //           display: "flex",
    //           flexDirection: "column",
    //           justifyContent: "start",
    //           alignItems: "baseline",
    //           width: "100%",
    //           height: "300px",
    //           padding: "0 8px",
    //           margin: 0,
    //           overflow: "auto",
    //           listStyle: "none",
    //           boxSizing: "border-box",
    //           gap: "4px",
    //         }}
    //       >
    //         {msg.map(({ type, name, message }, i) => {
    //           if (type === "welcome") {
    //             return (
    //               <li
    //                 key={i}
    //                 css={{
    //                   display: "flex",
    //                   justifyContent: "center",
    //                   width: "100%",
    //                   fontSize: "11px",
    //                   borderRadius: "8px",
    //                   background: "#c4c4c4",
    //                 }}
    //               >
    //                 <div
    //                   css={{
    //                     flex: 1,
    //                     display: "flex",
    //                     justifyContent: "center",
    //                     width: "100%",
    //                     margin: "4px",
    //                   }}
    //                 >
    //                   {name}
    //                   {message}
    //                 </div>
    //               </li>
    //             );
    //           }

    //           if (type === "myMessage") {
    //             return (
    //               <li key={i} css={{ display: "flex", width: "100%", fontSize: "14px" }}>
    //                 <div
    //                   css={{
    //                     flex: 1,
    //                     display: "flex",
    //                     justifyContent: "flex-end",
    //                     width: "100%",
    //                     margin: "0 16px",
    //                   }}
    //                 >
    //                   {message}
    //                 </div>
    //               </li>
    //             );
    //           }

    //           return (
    //             <li key={i} css={{ display: "flex", width: "100%", fontSize: "14px" }}>
    //               <div
    //                 css={{
    //                   fontWeight: 600,
    //                 }}
    //               >
    //                 {name}
    //               </div>
    //               <div
    //                 css={{
    //                   flex: 1,
    //                   display: "flex",
    //                   justifyContent: "start",
    //                   width: "100%",
    //                   margin: "0 16px",
    //                 }}
    //               >
    //                 {message}
    //               </div>
    //             </li>
    //           );
    //         })}
    //       </ul>
    //       <div
    //         css={{
    //           display: "flex",
    //           gap: "4px",
    //         }}
    //       >
    //         <Input></Input>
    //         <Button type="submit">보내기</Button>
    //       </div>
    //     </form>
    //   )}
    // </div>
  );
}

export default App;
