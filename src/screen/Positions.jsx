// HomePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Vote = () => {
    const [positions, setPositions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/positions.php'); // Endpoint to fetch positions
                setPositions(response.data);
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };
        fetchPositions();
    }, []);

    const handlePositionClick = (positionId) => {
        navigate(`/voter/positions-candidates/${positionId}`); // Navigate to candidates page for the clicked position
    };

    return (
        <div>
            <h1>Positions</h1>
            <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {positions.map((position) => (
                    <div
                        key={position.position_id}
                        className="flex flex-col gap-3 p-5 transition-transform transform border border-navy-blue-800 rounded-lg cursor-pointer bg-navy-blue-700 hover:scale-105 shadow-lg"
                    >
                        <div className="w-[4cm] font-semibold text-md text-gray-800 p-1 flex justify-center items-center bg-[#FFD700] h-9 rounded-lg">
                            {`${position.total_candidates} candidates`}
                        </div>
                        <h2 className="text-xl font-bold text-white text-center">
                            {position.position_name}
                        </h2>
                        <p className="text-lg text-gray-200 text-center">
                            {position.position_description}
                        </p>
                        <p className="text-sm text-gray-400 text-center">{position.time}</p>
                        <button
                            onClick={() => handlePositionClick(position.position_id)}
                            className="mt-2 font-bold text-white h-10 rounded-lg bg-navy-blue-600 hover:bg-navy-blue-500 transition-colors"
                        >
                            Tap to View
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Vote;
