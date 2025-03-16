import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import instance from '../api';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({});

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await instance.get(`/quiz/getQuiz/${quizId}`);
                if (response.data) {
                    formik.setValues({
                        quiz: response.data.quiz,
                        answer1: response.data.answer1,
                        answer2: response.data.answer2,
                        answer3: response.data.answer3,
                        answer4: response.data.answer4,
                        correctAnswer: response.data.correctAnswer.toString()
                    });
                }

            } catch (error) {
                console.error('Failed to fetch quiz:', error);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const validationSchema = Yup.object({
        quiz: Yup.string().required('Quiz question is required'),
        answer1: Yup.string().required('Answer 1 is required'),
        answer2: Yup.string().required('Answer 2 is required'),
        answer3: Yup.string().required('Answer 3 is required'),
        answer4: Yup.string().required('Answer 4 is required'),
        correctAnswer: Yup.string().required('Correct answer is required'),
    });

    const formik = useFormik({
        initialValues: {
            quiz: '',
            answer1: '',
            answer2: '',
            answer3: '',
            answer4: '',
            correctAnswer: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await instance.put(`/quiz/updateQuiz/${quizId}`, values);
                alert('Quiz updated successfully');
                navigate('/quizmain');
            } catch (error) {
                console.error('Failed to update quiz:', error);
            }
        },
    });

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-xl font-bold mb-4">Update Quiz</h1>
            <form onSubmit={formik.handleSubmit}>
                <label className="block">
                    Question:
                    <input type="text" name="quiz" onChange={formik.handleChange} value={formik.values.quiz} className="mt-1 p-2 border rounded w-full" />
                    {formik.touched.quiz && formik.errors.quiz ? <div className="text-red-500">{formik.errors.quiz}</div> : null}
                </label>
                {[1, 2, 3, 4].map(num => (
                    <label key={num} className="block">
                        Answer {num}:
                        <input type="text" name={`answer${num}`} onChange={formik.handleChange} value={formik.values[`answer${num}`]} className="mt-1 p-2 border rounded w-full" />
                        {formik.touched[`answer${num}`] && formik.errors[`answer${num}`] ? <div className="text-red-500">{formik.errors[`answer${num}`]}</div> : null}
                    </label>
                ))}
                <label className="block">
                    Correct Answer:
                    <select name="correctAnswer" onChange={formik.handleChange} value={formik.values.correctAnswer} className="mt-1 p-2 border rounded w-full">
                        <option value="">Select the correct answer</option>
                        {[1, 2, 3, 4].map(option => (
                            <option key={option} value={option}>Answer {option}</option>
                        ))}
                    </select>
                    {formik.touched.correctAnswer && formik.errors.correctAnswer ? <div className="text-red-500">{formik.errors.correctAnswer}</div> : null}
                </label>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Update Quiz
                </button>
            </form>
        </div>
    );
};

export default UpdateQuiz;
