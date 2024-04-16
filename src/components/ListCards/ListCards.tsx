import { useEffect, useState } from "react"
import { Card } from "./Card";
import style from './ListCard.module.css';

export const ListCards = () => {
  const [items, setItems] = useState<any[]>([]);
  const [encodeNextPage, setEncodeNextPage] = useState('');

  function fetchData(encodeNextPage: string) {
    fetch('/api/search.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        encodeNextPage
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.error) {
          console.log('ERROR:', data.message);
        } else {
          setItems((prevItems: any[]) => [...prevItems, ...data.data.items]);
          setEncodeNextPage(data.data.encodeNextPage);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  useEffect(() => {
    fetchData('');
  }, []);

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
