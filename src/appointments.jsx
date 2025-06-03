import { useEffect, useState } from "react";
import axios from 'axios';

//define the base url for easy access in functions
const backendUrl='http'

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    date: "",
    patient_id: "",
    doctor_id: "",
  });
  const [searchPatientId, setSearchPatientId] = useState("");
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [editAppointment, setEditAppointment] = useState(null);

  // appointments should load when the component is mounted
  useEffect(() => {
    fetchAllAppointments();
  }, []);

  //define a function to fetch appointments
  const fetchAllAppointments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/appointments`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
      setAppointments([]);
    }
  };

  //handle input changes in the form for new appointments
  const handleNewApppointmentChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  //same for editing appointment form
  const handleEditApppointmentChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new appointment
  const addAppointment = async (e) => {
    e.preventDefault();
    try {
      // Ensure date is in YYYY-MM-DD format
      const formattedAppointment = {
        ...newAppointment,
        date: newAppointment.date,
      };
      await axios.post(`${API_BASE_URL}/appointments`, formattedAppointment);
      alert("Appointment added successfully!");
      setNewAppointment({ date: "", patient_id: "", doctor_id: "" }); // Clear form
      fetchAllAppointments(); // Refresh the list
    } catch (error) {
      console.error("Error adding appointment:", error);
      alert(
        `Failed to add appointment: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

  // Search for appointments by Patient ID
  const searchAppointmentsByPatient = async () => {
    if (!searchPatientId) {
      alert("Please enter a Patient ID to search for appointments.");
      return;
    }
    try {
      // i'll likely need an endpoint like /patients/{id}/appointments to get a patient's appointments
      const response = await axios.get(
        `${API_BASE_URL}/patients/${searchPatientId}/appointments`
      ); // Needs to be added to backend
      setPatientAppointments(response.data);
    } catch (error) {
      console.error("Error searching appointments:", error);
      setPatientAppointments([]);
      alert(
        `No appointments found for patient with ID ${searchPatientId}. (You might need to implement /patients/{id}/appointments endpoint in your backend)`
      );
      // Fallback for demonstration if the specific patient appointments endpoint isn't ready
      const filteredAppointments = appointments.filter(
        (appt) => appt.patient_id === parseInt(searchPatientId)
      );
      setPatientAppointments(filteredAppointments);
      if (filteredAppointments.length === 0) {
        alert(
          `No appointments found for patient with ID ${searchPatientId} in the current fetched list.`
        );
      }
    }
  };

  // Update an existing appointment
  const updateAppointment = async (e) => {
    e.preventDefault();
    if (!editAppointment) return;

    try {
      // Ensure date is in YYYY-MM-DD format
      const formattedAppointment = {
        ...editAppointment,
        date: editAppointment.date,
      };
      await axios.patch(
        `${API_BASE_URL}/appointments/${editAppointment.id}`,
        formattedAppointment
      );
      alert("Appointment updated successfully!");
      setEditAppointment(null); // Clear edit form
      fetchAllAppointments(); // Refresh the list
      setPatientAppointments([]); // Clear patient specific search
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert(
        `Failed to update appointment: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

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
