import { useEffect, useState } from "react";

export default function Visits() {
  const[visits, setVisits]=useState([])

  useEffect(() => {
    fetch("http://localhost:8000/visits")
      .then((res) => res.json())
      .then((data) => {
        setVisits(data);
      });
  }, []);

    return (
        <>
            <h3>Visits</h3>
            {visits.map((visit) => (
                <div key={visit.id}></div>
            ))}
        </>
    );
}