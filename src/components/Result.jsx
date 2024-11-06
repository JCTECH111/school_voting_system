import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Results = ({ positions }) => {
  // Define chart data and options
  const data = {
    labels: positions.map((pos) => pos.position_name),
    datasets: positions.map((pos, index) => ({
      label: pos.position_name,
      data: pos.candidates.map((candidate) => candidate.votes),
      backgroundColor: `rgba(${index * 50}, 99, 132, 0.6)`, // Differentiated colors for each position
      borderColor: `rgba(${index * 50}, 99, 132, 1)`,
      borderWidth: 1,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Find the leading candidate across all positions
  const leadingCandidate = positions.flatMap((position) => position.candidates).reduce((leader, candidate) =>
    leader.votes > candidate.votes ? leader : candidate
  );

  return (
    <div className="p-6 bg-navy-blue-700 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold text-center mb-6">Election Results</h2>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-lg mb-6">
        <Bar data={data} options={options} />
      </div>

      {/* Leading Candidate */}
      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold text-gray-300">Leading Candidate</h3>
        <a href={`/candidates/${leadingCandidate.id}`} className="flex flex-col items-center mt-4 hover:underline">
          <img
            src={leadingCandidate.image_url}
            alt={leadingCandidate.name}
            className="w-24 h-24 rounded-full border-4 border-navy-blue-700 mb-2"
          />
          <span className="text-lg font-bold">{leadingCandidate.name}</span>
          <span className="text-sm text-gray-400">{leadingCandidate.class_level}</span>
        </a>
      </div>
    </div>
  );
};

export default Results;
