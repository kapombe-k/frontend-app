import { useEffect, useState } from "react";

export default function Doctors() {
  const[doctors, setDoctors]=useState([])

  useEffect(() => {
    fetch("http://localhost:8000/doctors")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
      });
  }, []);

    return (
        <>
            <h3>Doctors</h3>
            {doctors.map((doctor) => (
                <div key={doctor.id}>{doctors.name}</div>
            ))}
        </>
  );
}