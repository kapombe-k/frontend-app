import { useEffect, useState } from "react";

export default function Appointments() {
  const[appointments, setAppointments]=useState([])

  useEffect(() => {
    fetch("http://localhost:8000/appointments")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
      });
  }, []);

    return (
        <>
            <h3>Appointments Page</h3>
        </>
  );
}
