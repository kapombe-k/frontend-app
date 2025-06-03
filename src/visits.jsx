// src/components/VisitManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Make sure this matches your FastAPI backend URL

export default function VisitManagement() {
  const [visits, setVisits] = useState([]);
  const [newVisit, setNewVisit] = useState({
    date: "",
    summary: "",
    procedure_details: "",
    amount_paid: "",
    balance: "",
    doctor_id: "",
    patient_id: "",
  });
  const [searchPatientId, setSearchPatientId] = useState("");
  const [patientVisits, setPatientVisits] = useState([]);
  const [editVisit, setEditVisit] = useState(null); // State to hold visit being edited

  // Fetch all visits when the component mounts
  useEffect(() => {
    fetchAllVisits();
  }, []);

  // Function to fetch all visits from the backend
  const fetchAllVisits = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/visits`);
      setVisits(response.data);
    } catch (error) {
      console.error("Error fetching visits:", error);
      alert("Failed to fetch visits.");
    }
  };

  // Handle input changes for new visit form
  const handleNewVisitChange = (e) => {
    const { name, value } = e.target;
    setNewVisit((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for editing visit form
  const handleEditVisitChange = (e) => {
    const { name, value } = e.target;
    setEditVisit((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new visit
  const addVisit = async (e) => {
    e.preventDefault();
    try {
      // Ensure date is in YYYY-MM-DD format
      const formattedVisit = { ...newVisit, date: newVisit.date };
      await axios.post(`${API_BASE_URL}/visits`, formattedVisit);
      alert("Visit added successfully!");
      setNewVisit({
        date: "",
        summary: "",
        procedure_details: "",
        amount_paid: "",
        balance: "",
        doctor_id: "",
        patient_id: "",
      }); // Clear form
      fetchAllVisits(); // Refresh the list
    } catch (error) {
      console.error("Error adding visit:", error);
      alert(
        `Failed to add visit: ${error.response?.data?.detail || error.message}`
      );
    }
  };

  // Search for visits by Patient ID
  const searchVisitsByPatient = async () => {
    if (!searchPatientId) {
      alert("Please enter a Patient ID to search for visits.");
      return;
    }
    try {
      const response = await axios.get(
        `${API_BASE_URL}/patients/${searchPatientId}/visits`
      ); // Assuming you'll add this endpoint to your backend
      setPatientVisits(response.data);
    } catch (error) {
      console.error("Error searching visits:", error);
      setPatientVisits([]);
      alert(
        `No visits found for patient with ID ${searchPatientId}, or patient does not exist. (You might need to implement /patients/{id}/visits endpoint in your backend)`
      );
      // Fallback for demonstration if the specific patient visits endpoint isn't ready
      const filteredVisits = visits.filter(
        (visit) => visit.patient_id === parseInt(searchPatientId)
      );
      setPatientVisits(filteredVisits);
      if (filteredVisits.length === 0) {
        alert(
          `No visits found for patient with ID ${searchPatientId} in the current fetched list.`
        );
      }
    }
  };

  // Set a visit for editing
  const initiateEdit = (visit) => {
    setEditVisit({ ...visit, date: visit.date.split("T")[0] }); // Format date for input type="date"
  };

  // Update an existing visit
  const updateVisit = async (e) => {
    e.preventDefault();
    if (!editVisit) return;

    try {
      // Ensure date is in YYYY-MM-DD format
      const formattedVisit = { ...editVisit, date: editVisit.date };
      await axios.patch(
        `${API_BASE_URL}/visits/${editVisit.id}`,
        formattedVisit
      );
      alert("Visit updated successfully!");
      setEditVisit(null); // Clear edit form
      fetchAllVisits(); // Refresh the list
      setPatientVisits([]); // Clear patient specific search
    } catch (error) {
      console.error("Error updating visit:", error);
      alert(
        `Failed to update visit: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

  // Delete a visit
  const deleteVisit = async (id) => {
    if (
      window.confirm(`Are you sure you want to delete visit with ID: ${id}?`)
    ) {
      try {
        await axios.delete(`${API_BASE_URL}/visits/${id}`);
        alert("Visit deleted successfully!");
        fetchAllVisits(); // Refresh the list
        setPatientVisits([]); // Clear patient specific search
      } catch (error) {
        console.error("Error deleting visit:", error);
        alert(
          `Failed to delete visit: ${
            error.response?.data?.detail || error.message
          }`
        );
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Visit Management</h2>
      <p>
        Manage patient visits, including details of their appointments,
        procedures, and payments.
      </p>

      {/* Add New Visit */}
      <div style={styles.section}>
        <h3>Add New Visit</h3>
        <form onSubmit={addVisit} style={styles.form}>
          <input
            type="date"
            name="date"
            value={newVisit.date}
            onChange={handleNewVisitChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="summary"
            placeholder="Summary"
            value={newVisit.summary}
            onChange={handleNewVisitChange}
            required
            style={styles.input}
          />
          <textarea
            name="procedure_details"
            placeholder="Procedure Details"
            value={newVisit.procedure_details}
            onChange={handleNewVisitChange}
            required
            style={styles.textarea}
          ></textarea>
          <input
            type="number"
            name="amount_paid"
            placeholder="Amount Paid"
            value={newVisit.amount_paid}
            onChange={handleNewVisitChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="balance"
            placeholder="Balance"
            value={newVisit.balance}
            onChange={handleNewVisitChange}
            style={styles.input}
          />
          <input
            type="number"
            name="doctor_id"
            placeholder="Doctor ID"
            value={newVisit.doctor_id}
            onChange={handleNewVisitChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="patient_id"
            placeholder="Patient ID"
            value={newVisit.patient_id}
            onChange={handleNewVisitChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Add Visit
          </button>
        </form>
      </div>

      {/* Search Visits by Patient ID */}
      <div style={styles.section}>
        <h3>Search Visits by Patient ID</h3>
        <input
          type="number"
          placeholder="Patient ID"
          value={searchPatientId}
          onChange={(e) => setSearchPatientId(e.target.value)}
          style={styles.input}
        />
        <button onClick={searchVisitsByPatient} style={styles.button}>
          Search Visits
        </button>

        {patientVisits.length > 0 && (
          <div style={styles.searchResult}>
            <h4>Visits for Patient ID: {searchPatientId}</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Visit ID</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Summary</th>
                  <th style={styles.th}>Amount Paid</th>
                  <th style={styles.th}>Balance</th>
                  <th style={styles.th}>Doctor ID</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patientVisits.map((visit) => (
                  <tr key={visit.id}>
                    <td style={styles.td}>{visit.id}</td>
                    <td style={styles.td}>
                      {new Date(visit.date).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>{visit.summary}</td>
                    <td style={styles.td}>{visit.amount_paid}</td>
                    <td style={styles.td}>{visit.balance}</td>
                    <td style={styles.td}>{visit.doctor_id}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => initiateEdit(visit)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteVisit(visit.id)}
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

      {/* Edit Visit Form */}
      {editVisit && (
        <div style={styles.section}>
          <h3>Edit Visit (ID: {editVisit.id})</h3>
          <form onSubmit={updateVisit} style={styles.form}>
            <input
              type="date"
              name="date"
              value={editVisit.date}
              onChange={handleEditVisitChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="summary"
              placeholder="Summary"
              value={editVisit.summary}
              onChange={handleEditVisitChange}
              required
              style={styles.input}
            />
            <textarea
              name="procedure_details"
              placeholder="Procedure Details"
              value={editVisit.procedure_details}
              onChange={handleEditVisitChange}
              required
              style={styles.textarea}
            ></textarea>
            <input
              type="number"
              name="amount_paid"
              placeholder="Amount Paid"
              value={editVisit.amount_paid}
              onChange={handleEditVisitChange}
              required
              style={styles.input}
            />
            <input
              type="number"
              name="balance"
              placeholder="Balance"
              value={editVisit.balance}
              onChange={handleEditVisitChange}
              style={styles.input}
            />
            <input
              type="number"
              name="doctor_id"
              placeholder="Doctor ID"
              value={editVisit.doctor_id}
              onChange={handleEditVisitChange}
              required
              style={styles.input}
            />
            <input
              type="number"
              name="patient_id"
              placeholder="Patient ID"
              value={editVisit.patient_id}
              onChange={handleEditVisitChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Update Visit
            </button>
            <button
              type="button"
              onClick={() => setEditVisit(null)}
              style={{ ...styles.button, backgroundColor: "#6c757d" }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* All Visits List */}
      <div style={styles.section}>
        <h3>All Visits</h3>
        {visits.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Summary</th>
                <th style={styles.th}>Procedure Details</th>
                <th style={styles.th}>Amount Paid</th>
                <th style={styles.th}>Balance</th>
                <th style={styles.th}>Doctor ID</th>
                <th style={styles.th}>Patient ID</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={visit.id}>
                  <td style={styles.td}>{visit.id}</td>
                  <td style={styles.td}>
                    {new Date(visit.date).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>{visit.summary}</td>
                  <td style={styles.td}>{visit.procedure_details}</td>
                  <td style={styles.td}>{visit.amount_paid}</td>
                  <td style={styles.td}>{visit.balance}</td>
                  <td style={styles.td}>{visit.doctor_id}</td>
                  <td style={styles.td}>{visit.patient_id}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => initiateEdit(visit)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteVisit(visit.id)}
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
          <p>No visits found.</p>
        )}
      </div>
    </div>
  );
}

// Basic inline styles (reused from PatientManagement with slight modifications)
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    border: "1px solid #dee2e6",
    borderRadius: "5px",
    backgroundColor: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ced4da",
    width: "calc(100% - 22px)",
  },
  textarea: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ced4da",
    width: "calc(100% - 22px)",
    minHeight: "80px",
    resize: "vertical",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    alignSelf: "flex-start",
    marginTop: "10px",
  },
  editButton: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#ffc107",
    color: "black",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#dc3545",
    color: "white",
    cursor: "pointer",
  },
  searchResult: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #007bff",
    borderRadius: "5px",
    backgroundColor: "#e9f7ff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    border: "1px solid #dee2e6",
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#e9ecef",
  },
  td: {
    border: "1px solid #dee2e6",
    padding: "12px",
    textAlign: "left",
  },
};


