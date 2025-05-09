// src/hooks/useInstructors.js
import { useState, useEffect, useCallback } from 'react';
import { instructorService } from '../services/instructorService';

export const useInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all instructors
  const fetchInstructors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await instructorService.getAllInstructors();
      setInstructors(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch instructors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create instructor
  const createInstructor = async (instructorData) => {
    setLoading(true);
    try {
      const newInstructor = await instructorService.createInstructor(instructorData);
      setInstructors([...instructors, newInstructor]);
      setError(null);
      return newInstructor;
    } catch (err) {
      setError('Failed to create instructor');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update instructor
  const updateInstructor = async (id, instructorData) => {
    setLoading(true);
    try {
      const updatedInstructor = await instructorService.updateInstructor(id, instructorData);
      setInstructors(instructors.map(instructor => 
        instructor.InstructorID === id ? updatedInstructor : instructor
      ));
      setError(null);
      return updatedInstructor;
    } catch (err) {
      setError('Failed to update instructor');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete instructor
  const deleteInstructor = async (id) => {
    setLoading(true);
    try {
      await instructorService.deleteInstructor(id);
      setInstructors(instructors.filter(instructor => instructor.InstructorID !== id));
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to delete instructor');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load instructors on initial render
  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  return {
    instructors,
    loading,
    error,
    fetchInstructors,
    createInstructor,
    updateInstructor,
    deleteInstructor,
  };
};