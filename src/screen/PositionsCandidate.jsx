import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function PositionsCandidate() {
    const { id: positionId } = useParams(); // Extract positionId from URL
    const [candidates, setCandidates] = useState([]);
    const token = localStorage.getItem('userToken');
    const userId = token; // Ensure this holds the correct user ID

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                // Fetch candidates for the position
                const response = await axios.get(
                    `${backendUrl}/api/positionCandidates.php?position_id=${positionId}`
                );

                if (response.data.status === 'success') {
                    const candidatesData = response.data.data;

                    // Now fetch the user's voting status for these candidates
                    const votesResponse = await axios.get(
                        `${backendUrl}/api/userVotes.php?user_id=${userId}&position_id=${positionId}`
                    );

                    const votedCandidates = votesResponse.data.votedCandidates || [];

                    // Set candidates data with voted status
                    const updatedCandidates = candidatesData.map(candidate => ({
                        ...candidate,
                        voted: votedCandidates.includes(candidate.candidate_id), // Check if the user has voted for this candidate
                    }));

                    setCandidates(updatedCandidates); // Set candidates data
                } else {
                    console.error('Error fetching candidates:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        };

        fetchCandidates();
    }, [positionId, userId]);

    const handleVote = async (candidateId) => {
        try {
            const response = await axios.post(`${backendUrl}/api/vote.php`, {
                user_id: userId,
                candidate_id: candidateId,
                position_id: positionId,
            });

            if (response.data.status === 'success') {
                alert('Vote cast successfully!');
                setCandidates(prevCandidates =>
                    prevCandidates.map(candidate => 
                        candidate.candidate_id === candidateId 
                            ? { ...candidate, voted: true } // Mark as voted
                            : candidate
                    )
                );
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error voting:', error);
            alert('There was an issue casting your vote. Please try again.');
        }
    };

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Candidates</h1>
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {candidates.map((candidate) => (
                    <div
                        key={candidate.candidate_id}
                        className="p-4 transition-transform duration-300 border rounded-lg shadow-md hover:scale-105"
                    >
                        <a href={`/voter/candidates-profile/${candidate.candidate_id}`} className="block mb-2">
                            <img
                                src={`${backendUrl}/${candidate.image_url}`} // Assuming candidate.image_url holds the candidate's image URL
                                alt={candidate.name}
                                className="object-cover w-full h-48 rounded-md"
                            />
                        </a>
                        <h2 className="font-semibold">{candidate.name}</h2>
                        <p className="text-sm text-gray-600">{candidate.bio}</p>
                        {!candidate.voted ? (
                            <button
                                onClick={() => handleVote(candidate.candidate_id)}
                                className="px-4 py-2 mt-2 text-white transition-transform duration-200 transform bg-blue-500 rounded-lg hover:bg-blue-600 hover:scale-105"
                            >
                                Vote
                            </button>
                        ) : (
                            <button
                                className="px-4 py-2 mt-2 text-white transition-transform duration-200 transform bg-green-500 rounded-lg hover:bg-green-600 hover:scale-105"
                            >
                                Voted
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PositionsCandidate;
