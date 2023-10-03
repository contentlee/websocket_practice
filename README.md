# WEB_SOCKET

## Description

가볍게 사용할 수 있는 채팅앱입니다. Socket.io와 WebRTC 학습을 위해 진행 중인 프로젝트입니다.

## Enviroment

- Node.js 18.12.1
- Yarn 1.22.19

```jsx
$ yarn install
$ yarn start
```

## Stack (FE)

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

## Folder Structure

- Main Design Pattern : Container-Presenter Pattern
- Folder Description
    - 비지니스 로직을 중심으로, 페이지별 폴더 구조를 잡았습니다.
    - assets : 아이콘, 이미지 등과 같은 정적 파일을 담고 있습니다.
    - atoms : recoil을 통해 전역변수를 관리합니다. (현재 UI 상태값과 사용자 정보만을 관리하고 있습니다.)
    - chat : 채팅의 핵심적인 기능들인 메세지를 보내고 받는 기능을 담당하는 폴더입니다.
    - common : 모든 페이지들에서 공통적으로 사용될 수 있는 요소들을 담았습니다.
    - entry : 채팅방 리스트를 보고, 선택하거나 만들 수 있는 기능을 담당하고 있는 폴더입니다.
    - login : 사용자가 서비스에 입장할 수 있도록 도와주는 폴더입니다.
    - utils : 색상 관리 유틸을 담고 있습니다.
    - App.tsx : 현재 React Router를 통해 SPA Routing을 관리합니다.
    - main.tsx : 앱 사용을 위한 모든 Provider를 설정합니다.

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

## Current Progress

- 일반적인 채팅의 기능을 모두 담고 있습니다.
- MongoDB와의 연결을 통해 일회성이 아닌 다회성으로 채팅방을 이용할 수 있도록 하였습니다.
- 로그인 기능보다는, 현재는 간편하게 사용될 수 있도록, 사용자 이름 입력 페이지를 추가했습니다.

## Next Progress

- 기능 추가
    - 1:1 통화와 1:1 영상통화 기능 추가 (WebRTC)