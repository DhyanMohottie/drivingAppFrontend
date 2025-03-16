import { useState } from "react";
import axios from "axios";
import instance from "../api";

function Student() {
    const [student, setStudent] = useState({
        userID: "",
        email: "",
        regno: "",
        message: "",
    });

    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
        // Regular expression for email validation
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        setStudent((prevStudent) => ({
            ...prevStudent,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email
        const emailValid = validateEmail(student.email);
        if (!emailValid) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: "Invalid email address",
            }));
            return;
        }

        // If email is valid, submit the form
        try {
            const response = await instance.post("http://localhost:3000/create_user", student);
            console.log(response);
            alert("Successfully submitted!");
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className='p-4 flex flex-col justify-center items-center'>
            <div><h1 className='text-3xl my-4'>Student Details</h1></div>
        
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'>Full Name</label>
                    <input
                        type='text'
                        name='userID'
                        value={student.userID}
                        onChange={handleChange}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'>Email</label>
                    <input
                        type='text'
                        name='email'
                        value={student.email}
                        onChange={handleChange}
                        className='border-2 border-gray-500 px-4 py-2 w-full'
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'>Registration Number</label>
                    <input
                        type='text'
                        name='regno'
                        value={student.regno}
                        onChange={handleChange}
                        className='border-2 border-gray-500 px-4 py-2  w-full '
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-500'>Message</label>
                    <input
                        type='text'
                        name='message'
                        value={student.message}
                        onChange={handleChange}
                        className='border-2 border-gray-500 px-4 py-2  w-full '
                    />
                </div>
            
                <button className='p-2 bg-sky-300 m-8' onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Student;
