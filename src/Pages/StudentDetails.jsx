import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom'; // assuming you're using react-router
import { MdOutlineAddBox } from 'react-icons/md'; // assuming you're using react-icons for icons
import Spinner from './Spinner'; // assuming Spinner is a component to show loading state

function StudentDetails() {
    const componentPDF = useRef();
    const [showstudent, setShowStudent] = useState([]);
    const [searchkey, setSearchKey] = useState('');

    // Read
    const getFetchData = async () => {
        try {
            const data = await axios.get("http://localhost:8020/_user");
            console.log(data.data.success);
            if (data.data.success) {
                setShowStudent(data.data.data);
            }
        } catch (err) {
            alert(err);
        }
    }

    useEffect(() => {
        getFetchData();
    }, []);

    // Delete
    const handleDelete = async (id) => {
        const data = await axios.delete("http://localhost:8020/delete_user/" + id);
        if (data.data.success) {
            getFetchData();
            console.log(data.data.message);
            alert("Deleted Successfully!");
        }
    }

    // Generate PDF
    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "Show Services",
        onAfterPrint: () => alert("Data saved in PDF")
    });

    // Search
    const handleSearch = () => {
        filterData(searchkey);
    }

    const filterData = (searchKey) => {
        const filteredData = showstudent.filter(customer =>
            customer && customer.fname && customer.fname.toLowerCase().includes(searchKey.toLowerCase())
        );
        setShowStudent(filteredData);
    }

    return (
        <div className="showstudent">
            <div className='searchbtn'>
                <input type="search" onChange={(e) => setSearchKey(e.target.value)} placeholder='Search' className='in' />
                <button id='search-btn' onClick={handleSearch}>Search</button>
            </div>

            <div ref={componentPDF} style={{ width: '100%' }}>
                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl my-8">Vehicles</h1>
                        <Link to="/vehicles/create">
                            <MdOutlineAddBox className="text-sky-800 text-4xl" />
                        </Link>
                    </div>
                    {showstudent.length === 0 ? (
                        <p>No data found</p>
                    ) : (
                        <table className="w-full border-separate border-spacing-2">
                            <thead>
                                <tr>
                                    <th className="border border-slate-600 rounded-md">Full Name</th>
                                    <th className="border border-slate-600 rounded-md">Student Email</th>
                                    <th className="border border-slate-600 rounded-md">Registration Number</th>
                                    <th className="border border-slate-600 rounded-md">Message</th>
                                    <th className="border border-slate-600 rounded-md">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showstudent.map((student, index) => (
                                    <tr key={student._id} className="h-8">
                                        <td className="border border-slate-700 rounded-md text-center">{student.fname}</td>
                                        <td className="border border-slate-700 rounded-md text-center">{student.email}</td>
                                        <td className="border border-slate-700 rounded-md text-center">{student.regno}</td>
                                        <td className="border border-slate-700 rounded-md text-center">{student.message}</td>
                                        <td className="border border-slate-700 rounded-md text-center">
                                            <div className="flex justify-center gap-x-4">
                                                <a href={`/updateuser/${student._id}`}>Edit Details</a>
                                                <button onClick={() => handleDelete(student._id)}>Delete Details</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentDetails;
