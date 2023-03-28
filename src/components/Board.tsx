import Square from "./Square";

export default function Board() {
  let columns = new Array(3).fill([]).map(() => new Array(3).fill(''));
  return (
    <>
      {
        columns.map((column, colIndex) => {
          return (<div className="board-row" key={colIndex}>
            {column.map((row,rowIndex) => (<Square rowIndex={rowIndex} colIndex={colIndex}/>))}
          </div>)
        })
      }
    </>
  );
}
