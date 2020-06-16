const container = document.querySelector('#App');

function App (props) {
  const [contagem, setContagem] = React.useState(0);

  function increment () {
    setContagem((anterior) => { return anterior + 1 });
  }

  function decrement () {
    setContagem((anterior) => { return anterior - 1 });
  }
  
  return (
    <div className="contador">
      <h2>{props.title}</h2>
      <h3>{contagem}</h3>
      <div>
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );

}

ReactDOM.render(<App title="Contador"></App>, container);