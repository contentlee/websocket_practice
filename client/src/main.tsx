import { BrowserRouter } from 'react-router-dom';

import { RecoilRoot } from 'recoil';

import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './index.css';
import { HttpProvider } from './http';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <RecoilRoot>
      <HttpProvider>
        <App />
      </HttpProvider>
    </RecoilRoot>
  </BrowserRouter>,
  // </React.StrictMode>,
);
