import React from 'react';

function VotingInstructions() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-10 px-5 sm:px-10 lg:px-20">
      <div className="bg-white shadow-md rounded-lg max-w-3xl w-full p-8 md:p-10">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Voting Instructions for Goun Selection
        </h1>
        <p className="text-gray-700 text-center mb-8">
          Welcome to the official voting process for selecting the next <span className="font-semibold">Goun</span> of Godfrey Okoye University (GoUni). The Goun is responsible for managing student affairs and representing the student body.
        </p>

        <h2 className="text-xl font-semibold text-blue-500 mb-4">General Guidelines:</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>Only registered students of GoUni are eligible to vote.</li>
          <li>Each student is allowed to vote only once.</li>
          <li>Voting will be conducted online through the GoUni Student Portal.</li>
          <li>The voting process is secure and confidential.</li>
          <li>Ensure your student ID is ready before you start the voting process.</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-500 mt-8 mb-4">Voting Rules:</h2>
        <ul className="list-decimal list-inside space-y-3 text-gray-700">
          <li>Review the candidate profiles carefully before casting your vote.</li>
          <li>Once submitted, votes cannot be changed or removed.</li>
          <li>Avoid sharing your login credentials with anyone else.</li>
          <li>Any form of voting fraud, such as multiple votes, will lead to disqualification.</li>
          <li>The voting period is open from <span className="font-semibold">9:00 AM to 5:00 PM on Election Day</span>.</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-500 mt-8 mb-4">How to Vote:</h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>Log in to the GoUni Student Portal with your university credentials.</li>
          <li>Navigate to the "Vote for Goun" section.</li>
          <li>Select your preferred candidate from the list provided.</li>
          <li>Review your choice and click "Submit" to cast your vote.</li>
          <li>Once submitted, a confirmation message will appear on the screen.</li>
        </ol>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600">Your vote matters! Help us select the best candidate to represent you.</p>
          <p className="text-sm text-gray-600 mt-2">If you encounter any issues, contact the Student Affairs Office for assistance.</p>
        </div>
      </div>
    </div>
  );
}

export default VotingInstructions;

