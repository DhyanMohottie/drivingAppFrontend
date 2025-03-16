import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserSideBar from '../Components/UserSideBar';
import instance from '../api';
import jsPDF from 'jspdf';



const Payment = () => {
    const [payments, setPayments] = useState([]);
    const [formData, setFormData] = useState({
        paymentType: '',
        Amount: 0,
        remarks: null,
    });

    const [change , setChange] = useState(false);
    const userData = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await instance.get(`/revenue/revenueByUser/${userData.username}`);
                setPayments(response?.data);
                setPayments(response.data)
               
            } catch (error) {
                console.error("Failed to fetch payments:", error);
            }
        };
        fetchPayments();
    }, [change]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            setFormData({ ...formData, remarks: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 55, 71);  // Setting the text color to dark grey
        doc.setFontSize(16);

        doc.text('Payments Report', 105, 20, null, null, 'center');

        let yPos = 40;

        payments.forEach((payment, index) => {
            doc.setFontSize(12);
            doc.setTextColor(63, 81, 181); // Blue color for headers
            doc.text(`Payment ID: ${payment.paymentID}`, 20, yPos);
            doc.setTextColor(33, 37, 41); // Dark color for text
            doc.text(`Type: ${payment.paymentType}`, 20, yPos + 10);
            doc.text(`Amount: ${payment.Amount}`, 20, yPos + 20);
            doc.text(`Date: ${new Date(payment.dateTime).toLocaleDateString()}`, 20, yPos + 30);
            yPos += 40;
        });

        doc.save('payments-report.pdf');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('paymentType', formData.paymentType);
        data.append('studentName', userData.username); // using username instead of name
        data.append('Amount', formData.Amount);
        if (formData.file) {
            data.append('remarks', formData.file);
        }
        // if (formData.remarks) {
        //     data.append('remarks', formData.remarks);
        // }

        try {
            await instance.post('/revenue/revenue/add', data ,  {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
            alert('Payment added successfully!');
            setFormData({
                paymentType: '',
                Amount: 0,
                remarks: null,
            });
            setChange(!change)
            alert('Payment added successfully!');
        } catch (error) {
            console.error('Failed to add payment:', error?.message);
            alert('Failed to add payment');
        }
    };

    return (
        <div className='flex flex-row'>
            <UserSideBar/>
            <div className='flex-grow p-4'>
                <h1 className='text-center text-3xl font-bold'>Welcome to Payment</h1>
                <div className='mt-6'>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label>Payment Type:</label>
                            <input type="text" name="paymentType" value={formData.paymentType} onChange={handleChange} className="border border-gray-300 rounded p-2" />
                        </div>
                        {/* <div>
                            <label>Remarks (optional):</label>
                            <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} className="border border-gray-300 rounded p-2" />
                        </div> */}
                        <div>
                            <label>Upload Receipt (optional):</label>
                            <input type="file" name="remarks" onChange={handleChange} className="border border-gray-300 rounded p-2" />
                        </div>
                        <div>
                            <label>Amount:</label>
                            <input min={1} type="number" name="Amount" value={formData.Amount} onChange={handleChange} className="border border-gray-300 rounded p-2" />
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Payment</button>
                    </form>
                </div>
                
                <div className='mt-8 h-60 overflow-y-auto'>
                    <h2 className='text-xl font-semibold'>Past Payments</h2>
                    <button onClick={generatePDF} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generate Report</button>
                    {console.log(payments)}
                    { payments.map((payment, index) => (
                        <div key={index} className="p-4 mt-2 border border-gray-300 rounded">
                            <p>Payment ID: {payment.paymentID}</p>
                            <p>Payment Type: {payment.paymentType}</p>
                            <p>Date: {new Date(payment.dateTime).toLocaleDateString()}</p>
                            <p>Amount: {payment.Amount}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Payment;
