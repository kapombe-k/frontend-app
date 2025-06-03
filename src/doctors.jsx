import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "http://localhost:8000"; 

export default function DoctorComponent() {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({ name: "" });
  const [searchId, setSearchId] = useState("");
  const [foundDoctor, setFoundDoctor] = useState(null);
  const [editDoctor, setEditDoctor] = useState(null); // State to hold doctor being edited

  // Fetch all doctors when the component mounts
  useEffect(() => {
    fetchAllDoctors();
  }, []);

  // Function to fetch all doctors from the backend
  const fetchAllDoctors = async () => {
    try {      
      const response = await axios.get(`${backendUrl}/doctors`); // This will likely fail if your backend requires an ID.
      setDoctors(response.data);
    } catch (error) {
      console.error(
        "Error fetching doctors",
        error
      );      
      alert(
        "Failed to fetch all doctors."
      );
      setDoctors([]); // Clear doctors if fetching fails
    }
  };

  // Handle input changes for new doctor form
  const handleNewDoctorChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for editing doctor form
  const handleEditDoctorChange = (e) => {
    const { name, value } = e.target;
    setEditDoctor((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new doctor
  const addDoctor = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/doctors`, newDoctor); // dctors is for adding
      alert("Doctor added successfully!");
      setNewDoctor({ name: "" }); // Clear form
      fetchAllDoctors(); // Refresh the list
    } catch (error) {
      console.error(
        "Error adding doctor (check your backend POST /doctors endpoint):",
        error
      );
      alert(
        `Failed to add doctor`
      );
    }
  };

  // Search for a doctor by ID
  const searchDoctor = async () => {
    if (!searchId) {
      alert("Please enter a doctor ID to search.");
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/doctors/${searchId}`);
      setFoundDoctor(response.data);
    } catch (error) {
      console.error("Error searching doctor:", error);
      setFoundDoctor(null);
      alert(`Doctor with ID ${searchId} not found.`);
    }
  };

  // Set a doctor for editing
  const initiateEdit = (doctor) => {
    setEditDoctor({ ...doctor }); // Copy doctor data to edit state
  };

  // Update an existing doctor
  const updateDoctor = async (e) => {
    e.preventDefault();
    if (!editDoctor) return;

    try {
      await axios.patch(`${backendUrl}/doctors/${editDoctor.id}`, editDoctor);
      alert("Doctor updated successfully!");
      setEditDoctor(null); // Clear edit form
      fetchAllDoctors(); // Refresh the list
    } catch (error) {
      console.error("Error updating doctor:", error);
      alert(
        `Failed to update doctor`
      );
    }
  };

  // Delete a doctor
  const deleteDoctor = async (id) => {
    if (
      window.confirm(`Are you sure you want to delete doctor with ID: ${id}?`)
    ) {
      try {
        await axios.delete(`${backendUrl}/doctors/${id}`);
        alert("Doctor deleted successfully!");
        fetchAllDoctors(); // Refresh the list
        setFoundDoctor(null); // Clear search result if deleted
      } catch (error) {
        console.error("Error deleting doctor:", error);
        alert(
          `Failed to delete doctor`
        );
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Doctor Management</h2>
      <p>
        Add new doctors, search for their profiles, update their information, or
        remove them from the system.
      </p>

      {/* Add New Doctor */}
      <div style={styles.section}>
        <h3>Add New Doctor</h3>
        <form onSubmit={addDoctor} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Doctor Name"
            value={newDoctor.name}
            onChange={handleNewDoctorChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Add Doctor
          </button>
        </form>
      </div>

      {/* Search Doctor */}
      <div style={styles.section}>
        <h3>Search Doctor by ID</h3>
        <input
          type="number"
          placeholder="Doctor ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={styles.input}
        />
        <button onClick={searchDoctor} style={styles.button}>
          Search
        </button>
        {foundDoctor && (
          <div style={styles.searchResult}>
            <h4>Doctor Found:</h4>
            <p>
              <strong>ID:</strong> {foundDoctor.id}
            </p>
            <p>
              <strong>Name:</strong> {foundDoctor.name}
            </p>
            <button
              onClick={() => initiateEdit(foundDoctor)}
              style={styles.editButton}
            >
              Edit
            </button>
            <button
              onClick={() => deleteDoctor(foundDoctor.id)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Edit Doctor Form */}
      {editDoctor && (
        <div style={styles.section}>
          <h3>Edit Doctor (ID: {editDoctor.id})</h3>
          <form onSubmit={updateDoctor} style={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="Doctor Name"
              value={editDoctor.name}
              onChange={handleEditDoctorChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Update Doctor
            </button>
            <button
              type="button"
              onClick={() => setEditDoctor(null)}
              style={{ ...styles.button, backgroundColor: "#6c757d" }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* All Doctors List */}
      <div style={styles.section}>
        <h3>All Doctors</h3>
        {doctors.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td style={styles.td}>{doctor.id}</td>
                  <td style={styles.td}>{doctor.name}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => initiateEdit(doctor)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteDoctor(doctor.id)}
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
          <p>No doctors found.</p>
        )}
      </div>
    </div>
  );
}

// Basic inline styles (reused from PatientManagement)
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "900px",
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
