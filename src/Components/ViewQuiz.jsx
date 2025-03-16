import React, { useState, useEffect } from 'react';
import axios from 'axios';
import instance from '../api';
import { useNavigate } from 'react-router-dom';

const ViewQuiz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await instance.get('/quiz/getAllQuizes');
                setQuizzes(response.data || []);
            } catch (error) {
                console.error('Failed to fetch quizzes:', error);
            }
        };

        fetchQuizzes();
    }, []);

    const handleDelete = async (quizId) => {
        try {
            await instance.delete(`/quiz/deleteQuiz/${quizId}`);
            setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
            alert('Quiz deleted successfully');
        } catch (error) {
            console.error('Failed to delete quiz:', error);
        }
    };

    const handleUpdate = (quizId) => {
        navigate(`/updateQuiz/${quizId}`);
    };

    // Filter quizzes based on search term
    const filteredQuizzes = quizzes.filter(quiz => quiz.quiz.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-4 overflow-y-scroll h-screen mt-4">
            <input
                type="text"
                placeholder="Search quizzes"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="mb-4 w-full p-2 border border-gray-300 rounded"
            />
            {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map(quiz => (
                    <div key={quiz._id} className="bg-gray-100 p-4 rounded shadow mb-4">
                        <h3 className="text-lg font-semibold">{quiz.quiz}</h3>
                        <ul className="list-disc ml-5">
                            <li>{quiz.answer1}</li>
                            <li>{quiz.answer2}</li>
                            <li>{quiz.answer3}</li>
                            <li>{quiz.answer4}</li>
                            <li>{quiz?.answer5}</li>
                        </ul>
                        <button onClick={() => handleDelete(quiz._id)} className="text-red-500 hover:text-red-700 mr-2">
                            Delete
                        </button>
                        <button onClick={() => handleUpdate(quiz._id)} className="text-blue-500 hover:text-blue-700">
                            Update
                        </button>
                    </div>
                ))
            ) : (
                <p>No quizzes found.</p>
            )}
        </div>
    );
};

export default ViewQuiz;
