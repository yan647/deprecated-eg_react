export default function Square(props:{rowIndex: number, colIndex: number}){
  const {rowIndex, colIndex} = props
  return <button className="square" >{colIndex*3+rowIndex+1}</button>;
}
