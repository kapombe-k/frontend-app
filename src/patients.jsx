import { useEffect, useState } from "react";

export default function Patients() {
  const[patients, setPatients]=useState([])

  useEffect(() => {
    fetch("http://localhost:8000/patients")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
      });
  }, []);

    return (
        <>
            <h3>Patients</h3>
            {patients.map((patient) => (
                <div key={patient.id}>
                    <h3>{patients.name}</h3>
                </div>
            ))}
        </>
  );
}