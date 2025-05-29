import { useEffect } from "react";

function App() {

  useEffect(() => {
    fetch("http://localhost:9000/patients")
      .then((res) => res.json)
      .then((data) => {
        console.log(data);
      });
  }, []);

  return (
    <>
      
    </>
  );
}

export default App;
