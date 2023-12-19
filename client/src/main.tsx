import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from 'react-query';

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={client}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </QueryClientProvider>
  </BrowserRouter>,
  // </React.StrictMode>
);
