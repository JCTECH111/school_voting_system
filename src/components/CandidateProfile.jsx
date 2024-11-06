import React, { useEffect, useState } from 'react';
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function CandidateProfileComponent({ candidateId }) {
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/candidateProfile.php?candidate_id=${candidateId}`);
        console.log(response.data)
        if (response.data.status === 'success') {
          setCandidateData(response.data.data);
        } else {
          setError('Error fetching candidate data');
          console.log(response.data)
        }
      } catch (err) {
        console.error('Error fetching candidate data:', err);
        setError('Error fetching candidate data');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [candidateId]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!candidateData) {
    return <div>No candidate data found.</div>;
  }

  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="mb-4 text-3xl font-bold">{candidateData.name}</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Bio</h2>
        <p className="text-gray-700">{candidateData.bio}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Profile Details</h2>
        <p><strong>Class:</strong> {candidateData.class_level}</p>
        <p><strong>Gender:</strong> {candidateData.gender}</p>
        <p><strong>Faculty:</strong> {candidateData.faculty}</p>
        <p><strong>Department:</strong> {candidateData.department}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Images</h2>
        <div className="grid grid-cols-2 gap-4">
            <img  src={`${backendUrl}/${candidateData.image_url}`} alt={`Candidate image `} className="object-cover w-full h-48 rounded-lg shadow" />

        </div>
      </div>
    </div>
  );
}

export default CandidateProfileComponent;
