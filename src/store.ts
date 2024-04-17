import { atom, map } from 'nanostores';

export type CurrentSearch = {
  latitude: number;
  longitude: number;
  radiusKM: number;
  city: string;
}

export const currentSearch = map<CurrentSearch>({latitude: 0, longitude: 0, radiusKM: 0, city: ''});
export const currentSearchInput = atom<string>('');