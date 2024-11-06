import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Results = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/get_results.php`)
      .then((response) => {
        const fetchedData = response.data;
        setData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (!data) return <Loader />;

  return (
    <div className="p-6  rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold text-center mb-6">Election Results</h2>

      {data.map((pos, index) => {
        // Prepare chart data for each position
        const chartData = {
          labels: pos.candidates.map((candidate) => candidate.name),
          datasets: [
            {
              label: `${pos.position_name} Votes`,
              data: pos.candidates.map((candidate) => candidate.votes),
              backgroundColor: `rgba(${index * 50}, 99, 132, 0.6)`,
              borderColor: `rgba(${index * 50}, 99, 132, 1)`,
              borderWidth: 1,
              color: "blue"
            },
          ],
        };

        // Determine the leading candidate for this position
        const leadingCandidate = pos.candidates.reduce((leader, candidate) =>
          leader && leader.votes > candidate.votes ? leader : candidate
        );

        return (
          <div key={pos.position_name} className="mb-10">
            <h3 className="text-xl font-semibold text-center mb-4">
              {pos.position_name} - Candidates Votes
            </h3>
            <div className="bg-white p-4 rounded-lg mb-6">
              <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </div>

            {/* Leading Candidate for this position */}
            {leadingCandidate && (
              <div className="flex flex-col items-center text-center mt-8 p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-300">Leading Candidate</h3>
                <a href={`/voter/candidates-profile/${leadingCandidate.id}`} className="flex flex-col items-center mt-4 hover:underline">
                  <img
                    src={`${backendUrl}/${leadingCandidate.image_url}`}
                    alt={leadingCandidate.name}
                    className="w-20 h-20 rounded-full border-4 border-navy-blue-700 mb-2"
                  />
                  <span className="text-xl font-bold text-navy-blue-700">{leadingCandidate.name}</span>
                  <span className="text-sm text-gray-700 font-bold">{leadingCandidate.class_level}</span>
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Results;
