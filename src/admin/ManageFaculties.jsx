import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ManageFaculties() {
  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/faculties.php`);
      setFaculties(response.data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${backendUrl}/api/faculties.php?id=${editId}`, formData);
      } else {
        await axios.post(`${backendUrl}/api/faculties.php`, formData);
      }
      setFormData({ name: '' });
      setEditId(null);
      fetchFaculties();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving faculty:", error);
    }
  };

  const handleEdit = (faculty) => {
    setEditId(faculty.faculty_id);
    setFormData({ name: faculty.name });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/faculties.php?id=${id}`);
      fetchFaculties();
    } catch (error) {
      console.error("Error deleting faculty:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Manage Faculties</h1>

      {/* Button to open modal */}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        {editId ? "Edit Faculty" : "Add Faculty"}
      </button>

      {/* Faculties Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border px-4 py-2">Faculty ID</th>
              <th className="border px-4 py-2">Faculty Name</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map((faculty) => (
              <tr key={faculty.faculty_id} className="hover:bg-gray-100 overflow-x-scroll">
                <td className="border px-4 py-2">{faculty.faculty_id}</td>
                <td className="border px-4 py-2">{faculty.faculty_name}</td>
                <td className="border px-4 py-2 space-x-2 flex gap-3">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => handleEdit(faculty)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(faculty.faculty_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editId ? "Edit Faculty" : "Add Faculty"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Faculty Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter faculty name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editId ? "Update Faculty" : "Add Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageFaculties;
