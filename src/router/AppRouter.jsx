// Import necessary modules
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import SplashScreen from '../screen/SplashScreen';
import SignIn from '../authentication/SignIn';
// import Register from '../authentication/Register';
// import ForgotPassword from '../authentication/ForgotPassword';
import AdminDashboard from '../admin/AdminDashboard';
import ManageCandidates from '../admin/ManageCandidates';
import ManagePositions from '../admin/ManagePositions';
import Results from '../admin/Results';
import Settings from '../admin/Settings';
import HomePages from '../screen/HomePage';
import VotingInstructions from '../screen/VotingInstructions';
import ResultsView from '../screen/ResultsView';
import CandidateProfile from '../screen/CandidateProfile';
import VotingEnded from '../screen/VotingEnded';
import PositionsCandidate from '../screen/PositionsCandidate';
import Nav from '../components/Nav';
import NotFound from '../components/404';
import Vote from '../screen/Positions';
import AdminNav from '../components/AdminNav';
import ManageFaculties from '../admin/ManageFaculties';
import ManageDepartments from '../admin/ManageDeparments';

// Admin Layout Component
function AdminLayout() {
  return (
    <AdminNav>
       <Outlet />
    </AdminNav>
  );
}

// Voter Layout Component
function VoterLayout() {
  return (
      <div>
           <Nav />
          <Outlet /> {/* Renders child routes for voters */}
      </div>
  );
}

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<SplashScreen />} />
                <Route path="/signin" element={<SignIn />} />

                {/* Admin Routes with Nested Children */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="manage-candidates" element={<ManageCandidates />} />
                    <Route path="manage-positions" element={<ManagePositions />} />
                    <Route path="manage-faculties" element={<ManageFaculties />} />
                    <Route path="manage-departments" element={<ManageDepartments />} />
                    <Route path="results" element={<Results />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                {/* Voter Routes with Nested Children */}
                <Route path="/voter" element={<VoterLayout />}>
                    <Route path="candidates-profile/:id" element={<CandidateProfile />} /> {/* View individual candidate */}
                    <Route index element={<HomePages />} />
                    <Route path="home" element={<HomePages />} />
                    <Route path="vote" element={<Vote />} />
                    <Route path="instructions" element={<VotingInstructions />} />
                    <Route path="voting-ended" element={<VotingEnded />} />
                    <Route path="positions-candidates/:id" element={<PositionsCandidate />} /> {/* View individual candidate */}
                    <Route path="results" element={<ResultsView />} /> {/* Viewable results for voters */}
                </Route>

                {/* Catch-all route for 404 Not Found */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}
