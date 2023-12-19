import { useQuery } from 'react-query';
import http from './http';

const getRooms = async () => await http.get('/rooms');

export const useGetRooms = () => {
  return useQuery('rooms', () => getRooms());
};
