import PatientComponent from "./patients";
import VisitsComponent from "./visits";
import AppointmentComponent from "./appointments";
import DoctorComponent from "./doctors";

function App() {

  return (
    <>
      <PatientComponent />
      <DoctorComponent />
      <VisitsComponent />
      <AppointmentComponent />
    </>
  );
}

export default App;
