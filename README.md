# WEB_SOCKET

## Description

- Socket.io와 WebRTC로 만들어진 채팅앱입니다. 채팅, 1:1 음성 통화 및 영상 통화를 지원하고 있습니다.
- 싱글톤 패턴을 사용하여 socket Provider를 만들었고, Provider를 통해 socket 요청을 정형화하였습니다.
- WebRTC 연결을 위한 hook을 만들어 제공하고 있습니다. 외부 의존성을 줄이기 위해 상태와 메서드만을 반환하도록 했고, 실제 실행의 경우는 context에서 이루어지도록 하였습니다.

![img](https://file.notion.so/f/f/1cf345fc-6f24-42f9-af4f-e37913a9d7f1/e2126199-d3dc-40bf-b3ad-dbc2bb1c9799/CallProcess.png?id=97c7bfbe-6830-41b1-a6c7-8048e9c66a41&table=block&spaceId=1cf345fc-6f24-42f9-af4f-e37913a9d7f1&expirationTimestamp=1714996800000&signature=6NJKQFm30u4I7W8puFuXouO2Ayl0Ify8vnKWDK770nM&downloadName=CallProcess.png)
![img](https://file.notion.so/f/f/1cf345fc-6f24-42f9-af4f-e37913a9d7f1/dbb330a8-d3b2-48b6-b304-fa7ed506b076/webRTC.png?id=e4efa5af-5858-447c-b118-a664a874b9d1&table=block&spaceId=1cf345fc-6f24-42f9-af4f-e37913a9d7f1&expirationTimestamp=1714996800000&signature=mO8mrrfuNMq6DpH6L8E_kSs_Hb0z4D0AE-0dm1lQzX0&downloadName=webRTC.png)

![img](https://file.notion.so/f/f/1cf345fc-6f24-42f9-af4f-e37913a9d7f1/c4a8d31e-476b-41ef-95c3-6825385f33a7/chat_practice.png?id=d90f2379-19d2-48e4-bb4a-04fcad36a6df&table=block&spaceId=1cf345fc-6f24-42f9-af4f-e37913a9d7f1&expirationTimestamp=1715004000000&signature=egoXl4Nu-t9ccdcue-QLlCzpJv4PWeujEj7kXeDTi-U&downloadName=chat_practice.png)
[영상으로보기](https://youtu.be/mgTl0C5mP2c)

## Enviroment

- Node.js 18.12.1
- Yarn 1.22.19

```jsx
$ yarn install
$ yarn start
```

## FE Stack

- Bundler : Vite
- Base : Typescript, React
- API : socket.io
- State : recoil
- CSS : emotion

```
"dependencies": {
    "@emotion/react": "^11.11.1",
    "immer": "^10.0.2",
    "pretendard": "^1.3.8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router": "^6.16.0",
    "react-router-dom": "^6.16.0",
    "recoil": "^0.7.7",
    "socket.io-client": "^4.7.2"
  },
  "devDependencies": {
    "@emotion/babel-plugin": "^11.11.0",
    "@emotion/babel-preset-css-prop": "^11.11.0",
    "@types/node": "^20.7.0",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
```

## FE Folder Structure

```jsx
src
  ├─assets
  ├─atoms
  ├─chat
  │  ├─components
  │  ├─containers
  │  ├─contexts
  │  └─pages
  ├─common
  │  ├─components
  │  ├─containers
  │  └─pages
  ├─entry
  │  ├─components
  │  ├─containers
  │  └─pages
  ├─login
  │  ├─containers
  │  └─pages
  ├─utils
  ├─App.tsx
  └─main.tsx
```

## Next Process

- Chat의 이전 채팅 불러오기 기능
- 초기 기기 권한 미활성화시 발생하는 문제 헤결 (중간 세팅 단계를 추가하거나(zoom과 같이) 권한 활성화 후 다시 연결하는 방식)
