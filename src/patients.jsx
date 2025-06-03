import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "http://localhost:8000"; // this makes the backend url easily accessible

export default function PatientComponent() {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    phone_number: "",
    address: "",
    account_type: "",
  });
  const [searchId, setSearchId] = useState("");
  const [foundPatient, setFoundPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null); // State to hold patient being edited

  // Fetch all patients when the component mounts
  useEffect(() => {
    fetchAllPatients();
  }, []);

  // Function to fetch all patients from the backend
  const fetchAllPatients = async () => {
    try {
      const response = await axios.get(`${backendUrl}/patients`);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      alert("Failed to fetch patients.");
    }
  };

  // Handle input changes for new patient form
  const handleNewPatientChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for editing patient form
  const handleEditPatientChange = (e) => {
    const { name, value } = e.target;
    setEditPatient((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new patient
  const addPatient = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/patients`, newPatient);
      alert("Patient added successfully!");
      setNewPatient({
        name: "",
        age: "",
        phone_number: "",
        address: "",
        account_type: "",
      }); // Clear form
      fetchAllPatients(); // Refresh the list
    } catch (error) {
      console.error("Error adding patient:", error);
      alert(
        `Failed to add patient`
      );
    }
  };

  // Search for a patient by ID
  const searchPatient = async () => {
    if (!searchId) {
      alert("Please enter a patient ID to search.");
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/pateints/${searchId}`); // Note: Your backend has 'pateints'
      setFoundPatient(response.data);
    } catch (error) {
      console.error("Error searching patient:", error);
      setFoundPatient(null);
      alert(`Patient with ID ${searchId} not found.`);
    }
  };

  // Set a patient for editing
  const initiateEdit = (patient) => {
    setEditPatient({ ...patient }); // Copy patient data to edit state
  };

  // Update an existing patient
  const updatePatient = async (e) => {
    e.preventDefault();
    if (!editPatient) return;

    try {
      await axios.patch(
        `${backendUrl}/patients/${editPatient.id}`,
        editPatient
      );
      alert("Patient updated successfully!");
      setEditPatient(null); // Clear edit form
      fetchAllPatients(); // Refresh the list
    } catch (error) {
      console.error("Error updating patient:", error);
      alert(
        `Failed to update patient`
      );
    }
  };

  // Delete a patient
  const deletePatient = async (id) => {
    if (
      window.confirm(`Are you sure you want to delete patient with ID: ${id}?`)
    ) {
      try {
        await axios.delete(`${backendUrl}/patients/${id}`);
        alert("Patient deleted successfully!");
        fetchAllPatients(); // Refresh the list
        setFoundPatient(null); // Clear search result if deleted
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert(
          `Failed to delete patient`
        );
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Patient Management</h2>
      <p>
        Here you can add new patients, search for existing ones, update their
        details, or delete them.
      </p>

      {/* Add New Patient */}
      <div style={styles.section}>
        <h3>Add New Patient</h3>
        <form onSubmit={addPatient} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newPatient.name}
            onChange={handleNewPatientChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={newPatient.age}
            onChange={handleNewPatientChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="phone_number"
            placeholder="Phone Number"
            value={newPatient.phone_number}
            onChange={handleNewPatientChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newPatient.address}
            onChange={handleNewPatientChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="account_type"
            placeholder="Account Type"
            value={newPatient.account_type}
            onChange={handleNewPatientChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Add Patient
          </button>
        </form>
      </div>

      {/* Search Patient */}
      <div style={styles.section}>
        <h3>Search Patient by ID</h3>
        <input
          type="number"
          placeholder="Patient ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={styles.input}
        />
        <button onClick={searchPatient} style={styles.button}>
          Search
        </button>
        {foundPatient && (
          <div style={styles.searchResult}>
            <h4>Patient Found:</h4>
            <p>
              <strong>ID:</strong> {foundPatient.id}
            </p>
            <p>
              <strong>Name:</strong> {foundPatient.name}
            </p>
            <p>
              <strong>Age:</strong> {foundPatient.age}
            </p>
            <p>
              <strong>Phone:</strong> {foundPatient.phone_number}
            </p>
            <p>
              <strong>Address:</strong> {foundPatient.address}
            </p>
            <p>
              <strong>Account Type:</strong> {foundPatient.account_type}
            </p>
            <button
              onClick={() => initiateEdit(foundPatient)}
              style={styles.editButton}
            >
              Edit
            </button>
            <button
              onClick={() => deletePatient(foundPatient.id)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Edit Patient Form */}
      {editPatient && (
        <div style={styles.section}>
          <h3>Edit Patient (ID: {editPatient.id})</h3>
          <form onSubmit={updatePatient} style={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={editPatient.name}
              onChange={handleEditPatientChange}
              required
              style={styles.input}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={editPatient.age}
              onChange={handleEditPatientChange}
              required
              style={styles.input}
            />
            <input
              type="number"
              name="phone_number"
              placeholder="Phone Number"
              value={editPatient.phone_number}
              onChange={handleEditPatientChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={editPatient.address}
              onChange={handleEditPatientChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="account_type"
              placeholder="Account Type"
              value={editPatient.account_type}
              onChange={handleEditPatientChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Update Patient
            </button>
            <button
              type="button"
              onClick={() => setEditPatient(null)}
              style={{ ...styles.button, backgroundColor: "#6c757d" }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* All Patients List */}
      <div style={styles.section}>
        <h3>All Patients</h3>
        {patients.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Age</th>
                <th style={styles.th}>Phone Number</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Account Type</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td style={styles.td}>{patient.id}</td>
                  <td style={styles.td}>{patient.name}</td>
                  <td style={styles.td}>{patient.age}</td>
                  <td style={styles.td}>{patient.phone_number}</td>
                  <td style={styles.td}>{patient.address}</td>
                  <td style={styles.td}>{patient.account_type}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => initiateEdit(patient)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePatient(patient.id)}
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
          <p>No patients found.</p>
        )}
      </div>
    </div>
  );
}

// Basic inline styles for demonstration
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
    width: "calc(100% - 22px)", // Adjust for padding and border
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


