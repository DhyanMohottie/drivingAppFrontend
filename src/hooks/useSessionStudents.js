// src/hooks/useSessionStudents.js
import { useState, useEffect, useCallback } from 'react';
import { physicalTrainingService } from '../services/physicalTrainingService';

/**
 * Custom hook for managing students enrolled in a training session
 * @param {string} sessionId - The ID of the session to fetch students for
 */
export const useSessionStudents = (sessionId) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  /**
   * Fetch students enrolled in the specified session
   */
  const fetchStudents = useCallback(async () => {
    if (!sessionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get session details
      const sessionData = await physicalTrainingService.getSessionById(sessionId);
      setSession(sessionData);
      
      // Get enrollments for this session
      const enrollments = await physicalTrainingService.getSessionStudents(sessionId);
      setStudents(enrollments);
    } catch (err) {
      console.error('Failed to fetch session students:', err);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  /**
   * Update a student's attendance status
   * @param {string} enrollmentId - The ID of the enrollment to update
   * @param {string} status - The new status ('attended' or 'absent')
   * @returns {boolean} Success status
   */
  const updateAttendance = async (enrollmentId, status) => {
    try {
      await physicalTrainingService.updateAttendance(enrollmentId, status);
      
      // Update local state to reflect the change
      setStudents(students.map(student => 
        student._id === enrollmentId ? {...student, status} : student
      ));
      
      return true;
    } catch (err) {
      console.error('Failed to update attendance:', err);
      throw err;
    }
  };

  /**
   * Generate PDF report for the session
   * @returns {boolean} Success status
   */
  const generatePDF = async () => {
    try {
      if (!session) {
        throw new Error('Session data not available');
      }
      
      return await physicalTrainingService.generateSessionPDF(session, students);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      throw err;
    }
  };

  /**
   * Add a new student to the session
   * @param {string} userId - The ID of the user to enroll
   * @returns {Object} The new enrollment
   */
  const addStudent = async (userId) => {
    try {
      if (!sessionId || !userId) {
        throw new Error('Session ID and User ID are required');
      }
      
      const enrollment = await physicalTrainingService.enrollStudent({
        userId,
        sessionId
      });
      
      // Update local state with the new enrollment
      setStudents([...students, enrollment]);
      
      // Update session count
      if (session) {
        setSession({
          ...session,
          currentCount: session.currentCount + 1
        });
      }
      
      return enrollment;
    } catch (err) {
      console.error('Failed to add student:', err);
      throw err;
    }
  };

  /**
   * Remove a student from the session
   * @param {string} enrollmentId - The ID of the enrollment to remove
   * @returns {boolean} Success status
   */
  const removeStudent = async (enrollmentId) => {
    try {
      // First find the enrollment to get its status
      const enrollment = students.find(s => s._id === enrollmentId);
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }
      
      // Update the enrollment status to cancelled
      await physicalTrainingService.updateAttendance(enrollmentId, 'cancelled');
      
      // Remove from local state
      setStudents(students.filter(s => s._id !== enrollmentId));
      
      // Update session count if the enrollment was confirmed
      if (enrollment.status === 'confirmed' && session) {
        setSession({
          ...session,
          currentCount: Math.max(0, session.currentCount - 1)
        });
      }
      
      return true;
    } catch (err) {
      console.error('Failed to remove student:', err);
      throw err;
    }
  };

  /**
   * Get statistics about the students in this session
   * @returns {Object} Session statistics
   */
  const getSessionStats = () => {
    if (!students.length) return null;
    
    const confirmed = students.filter(s => s.status === 'confirmed').length;
    const attended = students.filter(s => s.status === 'attended').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const cancelled = students.filter(s => s.status === 'cancelled').length;
    
    return {
      total: students.length,
      confirmed,
      attended,
      absent,
      cancelled,
      attendanceRate: students.length > 0 ? (attended / (attended + absent) * 100) || 0 : 0
    };
  };

  // Load students when sessionId changes
  useEffect(() => {
    if (sessionId) {
      fetchStudents();
    } else {
      // Reset state when sessionId is removed
      setStudents([]);
      setSession(null);
      setError(null);
    }
  }, [sessionId, fetchStudents]);

  return {
    students,
    session,
    loading,
    error,
    fetchStudents,
    updateAttendance,
    generatePDF,
    addStudent,
    removeStudent,
    getSessionStats
  };
};

export default useSessionStudents;