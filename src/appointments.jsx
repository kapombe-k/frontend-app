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
        <h3>Appointments</h3>
        <div>
          <search></search>
          <button>Search</button>
        </div>
         <br />
        <div>
                {appointments.map((appointment) => (
                    <div key={appointment.id}></div>
                ))}
                    
              
        </div>
      </>
    );
}
