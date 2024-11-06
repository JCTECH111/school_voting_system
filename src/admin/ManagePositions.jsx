import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ManagePositions() {
  const [positions, setPositions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);

  // Fetch positions from the server
  const fetchPositions = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/actionnsPosition.php`);
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // Open the modal for editing or new position
  const openModal = (position = { name: '', description: '' }) => {
    setModalData(position);
    setEditId(position.position_id || null);
    setIsModalOpen(true);
  };

  // Handle submit for creating or updating position
  // Handle submit for creating or updating position
  const handleModalSubmit = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save this position?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const url = editId ? `${backendUrl}/api/actionnsPosition.php?id=${editId}` : `${backendUrl}/api/actionnsPosition.php`;
      const method = editId ? 'PUT' : 'POST';

      await axios({
        method: method,
        url: url,
        data: {
          name: modalData.name,
          description: modalData.description, // Include description here
        },
      });

      setIsModalOpen(false);
      fetchPositions();

      Swal.fire("Success!", "Position has been saved.", "success");
    } catch (error) {
      console.error('Error saving position:', error);
      Swal.fire("Error", "There was an error saving the position.", "error");
    }
  };


  // Handle delete action
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this position?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${backendUrl}/api/actionnsPosition.php?id=${id}`);
      fetchPositions();
      Swal.fire("Deleted!", "Position has been deleted.", "success");
    } catch (error) {
      console.error('Error deleting position:', error);
      Swal.fire("Error", "There was an error deleting the position.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Positions</h2>
      <button
        onClick={() => openModal()}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-600"
      >
        Add New Position
      </button>

      {/* Position list */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          <li
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <span className="text-blue-700 font-medium">Name</span>
            <span className="text-blue-700 font-medium">Description</span>
            <div className="text-blue-700 font-medium">
              Actions
            </div>
          </li>
          {positions.map((position) => (
            <li
              key={position.position_id}
              className="flex items-center justify-between p-4 gap-3 hover:bg-gray-50 overflow-x-scroll"
            >
              <span className="text-gray-700 font-medium">{position.position_name}</span>
              <span className="text-gray-700 font-medium">{position.description}</span>
              <div className=' flex gap-3'>
                <button
                  onClick={() => openModal(position)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(position.position_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for creating/editing positions */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {editId ? 'Edit Position' : 'Add Position'}
            </h3>
            <form onSubmit={handleModalSubmit}>
              {/* Position Name Field */}
              <label className="block mb-4">
                <span className="text-gray-700">Position Name:</span>
                <input
                  type="text"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>

              {/* Position Description Field */}
              <label className="block mb-4">
                <span className="text-gray-700">Position Description:</span>
                <textarea
                  value={modalData.description}
                  onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
              </label>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManagePositions;
