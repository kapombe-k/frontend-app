import { useEffect, useState } from "react";
import Patients from "./patients";
import Doctors from "./doctors";
import Appointments from "./appointments";
import Visits from "./visits";

function App() {

  return (
    <>
      <Appointments />
      <Doctors />
      <Patients />
      <Visits />
    </>
  );
}

export default App;
