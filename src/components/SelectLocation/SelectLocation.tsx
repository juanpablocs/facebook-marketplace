import { useEffect, useState } from 'react'
import styles from './SelectLocation.module.css';
import { currentSearch } from '../../store';
import slugify from '@sindresorhus/slugify';

export const SelectLocation = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [currentCountry, setCurrentCountry] = useState<any>(null);
  const [currentState, setCurrentState] = useState<any>(null);
  const COUNTRY_DEFAULT = 'PER';
  const STATE_DEFAULT = 'LIM';

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/countries-states.json', {
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      console.log(data);
      if(!data) return;
      setCountries(data);
      setCurrentCountry(data.find((country:any) => country.iso3 === COUNTRY_DEFAULT));
      setCurrentState(data.find((country:any) => country.iso3 === COUNTRY_DEFAULT).states.find((state:any) => state.state_code === STATE_DEFAULT));
    }
    fetchData();
  }, [])

  const handlerCountry = (e: any) => {
    setCurrentCountry(countries.find(country => country.iso3 === e.target.value));
    setCurrentState(countries.find(country => country.iso3 === e.target.value).states[0]);
  }

  useEffect(() => {
    if(currentState?.id) {
      currentSearch.set({
        latitude: currentState.latitude,
        longitude: currentState.longitude,
        radiusKM: 65,
        city: slugify(currentState.name),
      });
    }
  }, [currentState?.id]);

  console.log({currentCountry, currentState});
  return (
    <div className={styles.select}>
      <select value={currentCountry?.iso3} onChange={handlerCountry}>
        {countries.map((country: any) => (
          <option key={country.iso3} value={country.iso3}>{country.name}</option>
        ))}
      </select>
      <select value={currentState?.state_code} onChange={(e) => { setCurrentState(currentCountry?.states.find((state: any) => state.state_code === e.target.value)) }}>
        {currentCountry?.states.map((state: any) => (
          <option key={state.state_code} value={state.state_code}>{state.name}</option>
        ))}
      </select>
    </div>

  )
}
