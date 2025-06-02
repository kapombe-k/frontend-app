import { useEffect, useState } from "react";
import Patients from "./patients";
import Doctors from "./doctors";
import Appointments from "./appointments";
import Visits from "./visits";

function App() {

  return (
    <>
      <Patients />
      <Doctors />
      <Visits />
      <Appointments />
    </>
  );
}

export default App;
