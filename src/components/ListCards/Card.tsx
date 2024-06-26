import { type FC } from 'react'
import style from './Card.module.css';

interface CardProps {
  href: string;
  title: string;
  price: string;
  image: string;
}

export const Card:FC<CardProps> = ({title, price, image}) => {
  return (
    <div className={style.card}>
      <img src={image} alt={title} />
      <div className={style.cardInfo}>
        <h5>{title}</h5>
        <p>{price}</p>
      </div>
    </div>
  )
}
