import React, { useState } from 'react';
import axios from 'axios';
import instance from '../api';

const AddPayment = () => {
    const [paymentData, setPaymentData] = useState({
        paymentID: '',
        paymentType: '',
        dateTime: '',
        studentName: '',
        remarks: '',
        Amount: ''
    });

    const handleChange = (e) => {
        setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await instance.post('/revenue/revenue/add', {
                ...paymentData,
                dateTime: new Date(paymentData.dateTime),
                Amount: Number(paymentData.Amount)
            });
            alert('Payment Added Successfully!');
            console.log(response.data);
            // Reset form if needed
            setPaymentData({
                paymentID: '',
                paymentType: '',
                dateTime: '',
                studentName: '',
                remarks: '',
                Amount: ''
            });
        } catch (error) {
            console.error('Failed to add payment:', error);
            alert('Failed to add payment.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add Payment</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <label className="block">
                    Payment ID:
                    <input type="text" name="paymentID" value={paymentData.paymentID} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </label>
                <label className="block">
                    Payment Type:
                    <input type="text" name="paymentType" value={paymentData.paymentType} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </label>
                <label className="block">
                    Date and Time:
                    <input type="datetime-local" name="dateTime" value={paymentData.dateTime} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </label>
                <label className="block">
                    Student Name:
                    <input type="text" name="studentName" value={paymentData.studentName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </label>
                <label className="block">
                    Remarks:
                    <input type="text" name="remarks" value={paymentData.remarks} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </label>
                <label className="block">
                    Amount:
                    <input type="number" name="Amount" value={paymentData.Amount} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </label>
                <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Submit Payment
                </button>
            </form>
        </div>
    );
};

export default AddPayment;
