import { useEffect, useState } from "react"
import { Card } from "./Card";
import styles from './ListCard.module.css';
import { useStore } from "@nanostores/react";
import { currentSearch } from "../../store";

export const ListCards = () => {
  const [items, setItems] = useState<any[]>([]);
  const [encodeNextPage, setEncodeNextPage] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const currentSearcher = useStore(currentSearch);
  console.log({currentSearcher});

  const fetchData = async (encodeNextPage = '') => {
    try {
      setIsFetching(true);
      const res = await fetch('/api/search.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...currentSearcher,
          encodeNextPage
        })
      });
      const data = await res.json();
      
      console.log(data);
      if (data.error) {
        console.log('ERROR:', data.message);
      } else {
        const items = data?.data?.items || [];
        console.log('Items:', items)
        // TODO: refactor paginate with react-query
        if(encodeNextPage) {
          setItems((prevItems: any[]) => [...prevItems, ...items]);
        }else {
          setItems([...items]);
        }
        setEncodeNextPage(data?.data?.encodeNextPage);
      }
    }catch(error:any) {
      console.log('ERROR:', error.message)
    } finally {
      setIsFetching(false);
    }
      
  }
  useEffect(() => {
    if(!currentSearcher?.city) return;
    fetchData('');
  }, [currentSearcher?.city]);

  return (
    <>
      <div className={styles.listCards}>
        {items.length === 0 && isFetching && <p>Fetching items...</p>}
        {items.map((item: any) => (
          <a href={item.url} key={item.id} title={item.title} target="_blank">
            <Card href='' title={item.title} price={item.price.formatted_amount} image={item.image} />
          </a>
        ))}
      </div>
      {(encodeNextPage && !!items.length) && (
        <button 
          className={styles.btnNext} 
          disabled={isFetching} 
          onClick={() => fetchData(encodeNextPage)}
          >
          {isFetching ? 'Loading...' : 'Load more'}
        </button>
      )}
    </>
  )
}
