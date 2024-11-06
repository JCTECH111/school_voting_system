import{ useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from '../components/Loader';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({ name: '', faculty_id: '' });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
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

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/departments.php`);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);  // Stop loading once departments are fetched
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Are you sure?',
      text: editId ? "Do you want to update this department?" : "Do you want to add this department?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (editId) {
            await axios.put(`${backendUrl}/api/departments.php?id=${editId}`, formData);
          } else {
            await axios.post(`${backendUrl}/api/departments.php`, formData);
          }
          setFormData({ name: '', faculty_id: '' });
          setEditId(null);
          fetchDepartments();
          setIsModalOpen(false);

          Swal.fire(
            'Success!',
            editId ? 'Department updated successfully.' : 'Department added successfully.',
            'success'
          );
        } catch (error) {
          console.error("Error saving department:", error);
          Swal.fire(
            'Error',
            'There was an error saving the department. Please try again.',
            'error'
          );
        }
      }
    });
  };

  const handleEdit = (department) => {
    setEditId(department.department_id);
    setFormData({ name: department.department_name, faculty_id: department.faculty_id });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action will permanently delete the department.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${backendUrl}/api/departments.php?id=${id}`);
          fetchDepartments();
          Swal.fire('Deleted!', 'The department has been deleted.', 'success');
        } catch (error) {
          console.error("Error deleting department:", error);
          Swal.fire(
            'Error',
            'There was an error deleting the department. Please try again.',
            'error'
          );
        }
      }
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Manage Departments</h1>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        {editId ? "Edit Department" : "Add Department"}
      </button>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border px-4 py-2">Department ID</th>
              <th className="border px-4 py-2">Department Name</th>
              <th className="border px-4 py-2">Faculty</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.department_id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{department.department_id}</td>
                <td className="border px-4 py-2">{department.department_name}</td>
                <td className="border px-4 py-2">{department.faculty_name}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => handleEdit(department)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(department.department_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editId ? "Edit Department" : "Add Department"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Department Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter department name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Faculty:</label>
                <select
                  name="faculty_id"
                  value={formData.faculty_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Choose a Faculty</option>
                  {faculties.map((faculty) => (
                    <option value={faculty.faculty_id} key={faculty.faculty_id}>
                      {faculty.faculty_name}
                    </option>
                  ))}
                </select>
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
                  {editId ? "Update Department" : "Add Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDepartments;
