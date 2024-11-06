import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loader';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [faculty, setFalculty] = useState([]);
  const [department, setDepartment] = useState([]);
  const [position, setPosition] = useState([]);
  const [modalData, setModalData] = useState({ name: '', bio: '', image_url: '', class_level: '', position_id: '', gender: '', faculty: '', department: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/candidates.php`);
      setCandidates(response.data);
      // console.log(response.data)
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }finally {
      setLoading(false);  // Stop loading once departments are fetched
    }
  };
  const fetchFalculty = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/fetchFaculty.php`);
      setFalculty(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };
  const fetchPosition = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/fetchPosition.php`);
      setPosition(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchFalculty()
    fetchPosition()
  }, []);

  const handleFacultyChange = async (e) => {
    const facultyId = e.target.value;
    setModalData({ ...modalData, faculty: facultyId });

    // Fetch departments based on selected faculty
    try {
      const response = await axios.get(`${backendUrl}/api/fetch_Depart_Fac.php?faculty_id=${facultyId}`);
      setDepartment(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  const handleAddNew = () => {
    setEditId(null);
    setModalData({ name: '', position: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (candidate) => {
    setEditId(candidate.candidate_id);
    setModalData({ ...candidate });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`${backendUrl}/api/candidates.php?id=${id}`);
        Swal.fire('Deleted!', 'The candidate has been deleted.', 'success');
        fetchCandidates(); // Refresh the candidates list
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      Swal.fire('Error', 'There was an issue deleting the candidate.', 'error');
    }
  };


  
  const handleModalSubmit = async (e) => {
    e.preventDefault();
  
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save this candidate?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
  
    if (!confirm) return;
  
    try {
      const formData = new FormData();
  
      // Append form fields to formData
      formData.append('name', modalData.name);
      formData.append('bio', modalData.bio);
      formData.append('class_level', modalData.class_level);
      formData.append('position_id', modalData.position_id);
      formData.append('gender', modalData.gender);
      formData.append('faculty', modalData.faculty);
      formData.append('department', modalData.department);
  
      // Append image file if present
      if (modalData.image_url instanceof File) {
        formData.append('image_url', modalData.image_url);
      }
  
      // Specify the _method based on the operation
      formData.append('_method', editId ? 'PUT' : 'POST');
  
      // Determine URL based on edit mode
      const url = editId
        ? `${backendUrl}/api/candidates.php?id=${editId}`
        : `${backendUrl}/api/candidates.php`;
  
      // Send data using axios
      await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setIsModalOpen(false);
      fetchCandidates(); // Refresh candidates list
  
      Swal.fire("Success!", "Candidate has been saved.", "success");
    } catch (error) {
      console.error('Error saving candidate:', error);
      Swal.fire("Error", "There was an error saving the candidate.", "error");
    }
  };
  
  
  if (loading) return <Loader />;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Candidates</h1>
      <button
        onClick={handleAddNew}
        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        <FaPlus className="mr-2" /> Add New Candidate
      </button>

      <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
        <thead className="bg-navy-blue-700 text-white w-full">
          <tr>
            <th className="py-2 px-4">image</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Level</th>
            <th className="py-2 px-4">Position</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.candidate_id} className="border-b">
              <td className="py-2 px-2 text-center"><img src={`${backendUrl}/${candidate.candidate_image}`} className='h-12 w-12 rounded-full' /></td>
              <td className="py-2 px-4 text-center">{candidate.candidate_name}</td>
              <td className="py-2 px-4 text-center">{candidate.candidate_level}</td>
              <td className="py-2 px-4 text-center">{candidate.position_name}</td>
              <td className="py-2 px-4 text-center">{candidate.votes}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleEdit(candidate)}
                  className="text-yellow-500 mr-2 hover:text-yellow-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(candidate.candidate_id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50 ">
          <div className="bg-white rounded-lg shadow-lg w-11/12 h-[90%] sm:w-96 lg:w-1/2 p-6 overflow-y-scroll">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? 'Edit Candidate' : 'Add New Candidate'}
            </h2>
            <form onSubmit={handleModalSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              {/* bio Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Bio:</label>
                <textarea
                  value={modalData.bio}
                  onChange={(e) => setModalData({ ...modalData, bio: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              {/* Position Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Position:</label>
                <select
                  value={modalData.position_id}
                  onChange={(e) => setModalData({ ...modalData, position_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select Position</option>
                  {position.map((position) => (
                    <option key={position.position_id} value={position.position_id}>{position.position_name}</option>
                  ))}
                </select>
              </div>


              {/* Image Upload and Preview */}
              <div className="mb-4">
                <label className="block text-gray-700">Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setModalData({ ...modalData, image_url: file });
                    }
                  }}
                  className="w-full px-3 py-2 border rounded"
                />
                {modalData.image_url && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(modalData.image_url)} // Use URL.createObjectURL for preview
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              {/* Class Level Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Class Level:</label>
                <select
                  value={modalData.class_level}
                  onChange={(e) => setModalData({ ...modalData, class_level: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="100 level">100 level</option>
                  <option value="200 level">200 level</option>
                  <option value="300 level">300 level</option>
                  <option value="400 level">400 level</option>
                  <option value="500 level">500 level</option>
                  <option value="600 level">600 level</option>
                  <option value="700 level">700 level</option>
                </select>
              </div>
              {/* Gender Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Gender:</label>
                <select
                  value={modalData.gender}
                  onChange={(e) => setModalData({ ...modalData, gender: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option>Select Gender</option>
                  {/* Replace with actual positions from database */}
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>
              {/* Falculty Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Falculty:</label>
                <select
                  value={modalData.falculty}
                  onChange={handleFacultyChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option>Select Faculty</option>
                  {faculty.map((faculties) => (
                    <option key={faculties.faculty_id} value={faculties.faculty_id}>{faculties.faculty_name}</option>
                  ))}
                </select>
              </div>

              {/* Department Field */}
              <div className="mb-4">
                <label className="block text-gray-700">Department:</label>
                <select
                  value={modalData.department}
                  onChange={(e) => setModalData({ ...modalData, department: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option>Select Department</option>
                  {department.map((department) => (
                    <option key={department.department_id} value={department.department_id}>
                      {department.department_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
};

export default Candidates;
