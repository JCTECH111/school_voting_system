import React from 'react';
import { useParams } from 'react-router-dom';
import CandidateProfileComponent from '../components/CandidateProfile.jsx';

function CandidateProfile() {
  const { id: candidateId } = useParams(); // Extract candidateId from URL parameters
  //  alert(candidateId)
  return (
    
    <CandidateProfileComponent candidateId={candidateId} />
  );
}

export default CandidateProfile;
