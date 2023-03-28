export default function Board() {
  let columns = new Array(3).fill([]).map((item, index) => [index * 3 + 1, index * 3 + 2, index * 3 + 3]);
  return (
    <>
      {
        columns.map((column, colIndex) => {
          return (<div className="board-row" key={colIndex}>
            {column.map((row, rowIndex) => (<button className="square" key={rowIndex}>{row}</button>))}
          </div>)
        })
      }
    </>
  );
}
