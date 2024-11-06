import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from "../components/Card";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function AdminDashboard() {
  const [totalCounts, setTotalCounts] = useState({
    candidates: 0,
    votes: 0,
    faculty: 0,
    department: 0,
    position: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/dashboard_count.php`);
        setTotalCounts(response.data);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Votes */}
      <Card heading="Total Votes" count={totalCounts.votes} />
      <Card heading="Total Candidates" count={totalCounts.candidates} />
      <Card heading="Total Faculty" count={totalCounts.faculty} />
      <Card heading="Total Departments" count={totalCounts.department} />
      <Card heading="Total Positions" count={totalCounts.position} />
      <Card heading="Total Users" count={totalCounts.users} />
    </section>
  );
}

export default AdminDashboard;
