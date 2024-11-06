import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context/contextProvider';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function SignIn() {
    const [regNo, setRegNo] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    
    const { settVoterToken } = useStateContext();
    const handleSignIn = async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        setLoading(true);
        setError('');
    
        try {
            const response = await axios.post(`${backendUrl}/authentication/signin.php`, {
                reg_no: regNo,
                password: password,
            });
        
            // Check if sign-in was successful
            if (response.data.message == 'Sign In Successful') {
                console.log('Sign In Successful:', response.data.user.user_id);
                settVoterToken(response.data.user.user_id);
                localStorage.setItem('userToken', response.data.user.user_id);
                navigate('/voter');
            } else {
                // Handle other responses (e.g., show error message)
                setError('Sign In Failed: ' + (response.data.error || 'Unknown error'));

            }
        }
        catch (err) {
            // Handle error (e.g., show error message)
            setError('Sign In Failed. Please check your credentials.');
            console.error('Error signing in:', err);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center h-screen max-w-md p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-navy-blue-900">Sign In</h2>
            {error && <p className="mb-2 text-red-500">{error}</p>}
            {/* Registration Number Input */}
            <div className="w-full mb-4">
                <label htmlFor="regNo" className="block mb-2 text-navy-blue-900">Registration Number</label>
                <input
                    type="text"
                    id="regNo"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="Enter your Reg No"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-navy-blue-700"
                />
            </div>

            {/* Password Input with Toggle Icon */}
            <div className="relative w-full mb-6">
                <label htmlFor="password" className="block mb-2 text-navy-blue-900">Password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-navy-blue-700"
                />
                {/* Toggle Icon */}
                <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer right-3 top-10 text-navy-blue-900"
                >
                    {showPassword ? '👁️' : '🙈'}
                </span>
            </div>

            {/* Sign In Button */}
            <button
                onClick={handleSignIn}
                className="w-full py-3 font-semibold text-white rounded bg-navy-blue-900 hover:bg-navy-blue-700"
            >
                {loading ? 'Signing In...' : 'Sign In'}
            </button>
        </div>
    );
}

export default SignIn;
