import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../api';

const QuizPackageSelector = () => {
    const [packages, setPackages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await instance.get('/quizPackage/');
                setPackages(response.data);
            } catch (error) {
                console.error('Error fetching quiz packages:', error);
            }
        };
        fetchPackages();
    }, []);

    const handleSelectPackage = (quizPackageID) => {
        navigate(`/takeQuiz/${quizPackageID}`);
    };

    return (
        <div className="p-4">
            <h1>Select a Quiz Package</h1>
            <ul className="list-none">
                {packages.map(pkg => (
                    <li key={pkg.quizPackageID} className="p-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectPackage(pkg.quizPackageID)}>
                        {pkg.quizPackage}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuizPackageSelector;
