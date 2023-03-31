import {useState} from 'react';

export default function Square() {
  const [value, setValue] = useState(null);
  const handleSquareClick = () => {
    setValue('X')
  }
  return <button className="square" onClick={handleSquareClick}>{value}</button>;
}
