import { useEffect, useState } from "react"
import { Card } from "./Card";
import style from './ListCard.module.css';
import { useStore } from "@nanostores/react";
import { currentSearch } from "../../store";

export const ListCards = () => {
  const [items, setItems] = useState<any[]>([]);
  const [encodeNextPage, setEncodeNextPage] = useState('');
  const currentSearcher = useStore(currentSearch);
  console.log({currentSearcher});

  const fetchData = async (encodeNextPage = '') => {
    try {
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
    }
      
  }
  useEffect(() => {
    if(!currentSearcher?.city) return;
    fetchData('');
  }, [currentSearcher?.city]);

  return (
    <>
      <div className={style.listCards}>
        {items.map((item: any) => (
          <div key={item.id}>
            <Card href='' title={item.title} price={item.price.formatted_amount} image={item.image} />
          </div>
        ))}
      </div>
      {encodeNextPage && (
        <button onClick={() => fetchData(encodeNextPage)}>Load more</button>
      )}
    </>
  )
}
