import axios from 'axios';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function SendMoney() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    console.log(id)
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Sending money to:', name, 'Amount:', amount);
        axios.put('http://localhost:3000/api/v1/account/send', { amount, to: id }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.error('Transfer error:', error);
        })

        
    };

    return ( 
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-2xl font-bold mb-6">Send Money</h2>

                {/* Receiver Profile */}
                <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-green-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                        {name.split('')[0].toUpperCase()}
                    </div>
                    <span className="ml-3 text-lg font-semibold">{name}</span>
                </div>

                {/* Amount Input */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                        <label className="block text-gray-600 mb-1">Amount (in Rs)</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-all duration-300 font-semibold"
                    >
                        Transfer
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SendMoney;
