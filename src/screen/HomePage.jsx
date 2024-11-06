import React from 'react';

function HomePages() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center px-5 sm:px-10 lg:px-20 py-10">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600">GoUni Student Election Voting Portal</h1>
        <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
          Welcome to the official voting page for the <span className="font-semibold">Godfrey Okoye University (GoUni)</span> student election. Here, you can cast your vote to select the next student representative (Goun), who will be responsible for advocating on behalf of the student body.
        </p>
      </header>

      <section className="w-full bg-white shadow-md rounded-lg p-8 mb-10">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">About the Election</h2>
        <p className="text-gray-700">
          The GoUni Student Election is a platform where students can elect the next <span className="font-semibold">Goun</span> – the leader who takes care of student affairs and serves as the bridge between the students and the university administration. This election is your opportunity to choose a representative who will uphold student interests, address concerns, and drive positive changes.
        </p>
        <img
          src="https://images.unsplash.com/photo-1553499943-4f1b7d9fa5bb"
          alt="Student Election"
          className="mt-5 w-full h-64 object-cover rounded-lg shadow-md"
        />
      </section>

      <section className="w-full bg-white shadow-md rounded-lg p-8 mb-10">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">How the Voting Process Works</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-3">
          <li>Log in to your student portal using your university credentials.</li>
          <li>Review the profiles of each candidate.</li>
          <li>Select the candidate who best represents your interests.</li>
          <li>Submit your vote securely.</li>
          <li>Once your vote is submitted, it is confidential and cannot be altered.</li>
        </ul>
        <img
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
          alt="Voting Process"
          className="mt-5 w-full h-64 object-cover rounded-lg shadow-md"
        />
      </section>

      <section className="w-full bg-white shadow-md rounded-lg p-8 mb-10">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Why Your Vote Matters</h2>
        <p className="text-gray-700">
          The Goun plays a critical role in enhancing student life at GoUni. They ensure that student voices are heard in university matters and help make GoUni a better place for everyone. Your vote directly impacts the direction of student governance and empowers the leader of your choice to address key issues and bring about meaningful change.
        </p>
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
          alt="Student Representation"
          className="mt-5 w-full h-64 object-cover rounded-lg shadow-md"
        />
      </section>

      <section className="w-full bg-white shadow-md rounded-lg p-8 mb-10">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Meet the Candidates</h2>
        <p className="text-gray-700">
          Each candidate brings unique perspectives and ideas to improve the student experience. Before voting, take a moment to learn more about their goals, background, and vision for GoUni.
        </p>
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
          alt="Candidates"
          className="mt-5 w-full h-64 object-cover rounded-lg shadow-md"
        />
      </section>

      <footer className="text-center mt-10 text-gray-500 text-sm">
        <p>Godfrey Okoye University &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default HomePages;
