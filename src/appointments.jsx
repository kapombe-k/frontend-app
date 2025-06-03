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

  // Delete an appointment
  const deleteAppointment = async (id) => {
    if (
      window.confirm(
        `Are you sure you want to delete appointment with ID: ${id}?`
      )
    ) {
      try {
        await axios.delete(`${API_BASE_URL}/appointments/${id}`);
        alert("Appointment deleted successfully!");
        fetchAllAppointments(); // Refresh the list
        setPatientAppointments([]); // Clear patient specific search
      } catch (error) {
        console.error("Error deleting appointment:", error);
        alert(
          `Failed to delete appointment: ${
            error.response?.data?.detail || error.message
          }`
        );
      }
    }
  };

  return (
    <>
      <h3>Appointments</h3>
      <div style={styles.container}>
        <h2>Appointment Management</h2>
        <p>
          Schedule, view, update, and cancel patient appointments with doctors.
        </p>

        {/* Add New Appointment */}
        <div style={styles.section}>
          <h3>Add New Appointment</h3>
          <form onSubmit={addAppointment} style={styles.form}>
            <input
              type="date"
              name="date"
              value={newAppointment.date}
              onChange={handleNewAppointmentChange}
              required
              style={styles.input}
            />
            <input
              type="number"
              name="patient_id"
              placeholder="Patient ID"
              value={newAppointment.patient_id}
              onChange={handleNewAppointmentChange}
              required
              style={styles.input}
            />
            <input
              type="number"
              name="doctor_id"
              placeholder="Doctor ID"
              value={newAppointment.doctor_id}
              onChange={handleNewAppointmentChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Add Appointment
            </button>
          </form>
        </div>

        {/* Search Appointments by Patient ID */}
        <div style={styles.section}>
          <h3>Search Appointments by Patient ID</h3>
          <input
            type="number"
            placeholder="Patient ID"
            value={searchPatientId}
            onChange={(e) => setSearchPatientId(e.target.value)}
            style={styles.input}
          />
          <button onClick={searchAppointmentsByPatient} style={styles.button}>
            Search Appointments
          </button>

          {patientAppointments.length > 0 && (
            <div style={styles.searchResult}>
              <h4>Appointments for Patient ID: {searchPatientId}</h4>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Appointment ID</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Doctor ID</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patientAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td style={styles.td}>{appointment.id}</td>
                      <td style={styles.td}>
                        {new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>{appointment.doctor_id}</td>
                      <td style={styles.td}>
                        <button
                          onClick={() => initiateEdit(appointment)}
                          style={styles.editButton}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAppointment(appointment.id)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Appointment Form */}
        {editAppointment && (
          <div style={styles.section}>
            <h3>Edit Appointment (ID: {editAppointment.id})</h3>
            <form onSubmit={updateAppointment} style={styles.form}>
              <input
                type="date"
                name="date"
                value={editAppointment.date}
                onChange={handleEditAppointmentChange}
                required
                style={styles.input}
              />
              <input
                type="number"
                name="patient_id"
                placeholder="Patient ID"
                value={editAppointment.patient_id}
                onChange={handleEditAppointmentChange}
                required
                style={styles.input}
              />
              <input
                type="number"
                name="doctor_id"
                placeholder="Doctor ID"
                value={editAppointment.doctor_id}
                onChange={handleEditAppointmentChange}
                required
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                Update Appointment
              </button>
              <button
                type="button"
                onClick={() => setEditAppointment(null)}
                style={{ ...styles.button, backgroundColor: "#6c757d" }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* All Appointments List */}
        <div style={styles.section}>
          <h3>All Appointments</h3>
          {appointments.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Patient ID</th>
                  <th style={styles.th}>Doctor ID</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td style={styles.td}>{appointment.id}</td>
                    <td style={styles.td}>
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>{appointment.patient_id}</td>
                    <td style={styles.td}>{appointment.doctor_id}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => initiateEdit(appointment)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>
              No appointments found. Consider adding a GET /appointments
              endpoint in your backend.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
