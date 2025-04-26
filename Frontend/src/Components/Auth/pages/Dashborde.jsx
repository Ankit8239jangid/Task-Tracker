import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigator = useNavigate();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/user/all_users');
                setData(response.data);
              
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
       
    }, []);

    // Filter users based on search input
    const filteredUsers = data.filter((user) =>
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-[#121212] min-h-screen text-white">
            {/* Navbar */}
            <nav className="bg-[#1E1E1E] p-4 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold text-indigo-400">PayTM App</h1>
                <span className="bg-gray-700 px-4 py-2 rounded-full text-gray-300">Hello, 👋</span>
            </nav>

            {/* Balance Section */}
            <div className="container mx-auto mt-6 px-6">
                <h2 className="text-3xl font-semibold">
                    Your balance: <span className="text-indigo-500">₹10,000</span>
                </h2>
            </div>

            {/* Search Bar */}
            <div className="container mx-auto mt-6 px-6">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#1E1E1E] border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-gray-400"
                />
            </div>

            {/* Users List */}
            <div className="container mx-auto mt-6 px-6">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center bg-[#1E1E1E] p-4 rounded-lg shadow-md mb-3 hover:bg-[#2A2A2A] transition-all duration-300"
                        >
                            {/* Avatar & User Info */}
                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-700 text-white text-xl font-bold rounded-full h-12 w-12 flex items-center justify-center">
                                    {user.firstname[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{user.firstname} {user.lastname}</h3>
                                </div>
                            </div>

                            {/* Send Money Button */}
                            <button onClick={(e) => {
                                navigator('/send?id=' + user.id + '&name=' + user.firstname)
                            }} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-300">
                                Send Money
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center mt-4">No users found</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
