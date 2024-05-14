import { http } from './http';

export const login = (userName: string) => http.post('/login', { userName });
