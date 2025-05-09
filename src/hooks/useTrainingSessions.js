// src/hooks/useTrainingSessions.js
import { useState, useEffect, useCallback } from 'react';
import { physicalTrainingService } from '../services/physicalTrainingService';
import { useAuth } from '../hooks/AuthContext';

/**
 * Custom hook for managing physical training sessions
 * Provides CRUD operations and state management for sessions
 */
export const useTrainingSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  /**
   * Fetch sessions based on user role
   * If user is instructor, fetch only their sessions, otherwise fetch all sessions
   */
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data;
      if (user?.InstructorID) {
        // If user is an instructor, fetch only their sessions
        data = await physicalTrainingService.getInstructorSessions(user.InstructorID);
      } else {
        // Otherwise fetch all sessions (admin view)
        data = await physicalTrainingService.getAllSessions();
      }
      
      // Sort sessions by date (newest first)
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch training sessions:', err);
      setError('Failed to load training sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Create a new training session
   * @param {Object} sessionData - The session data to create
   * @returns {Object} The newly created session
   */
  const createSession = async (sessionData) => {
    try {
      const newSession = await physicalTrainingService.createSession(sessionData);
      setSessions([newSession, ...sessions]);
      return newSession;
    } catch (err) {
      console.error('Failed to create session:', err);
      throw err;
    }
  };

  /**
   * Update an existing training session
   * @param {string} sessionId - The ID of the session to update
   * @param {Object} sessionData - The updated session data
   * @returns {Object} The updated session
   */
  const updateSession = async (sessionId, sessionData) => {
    try {
      const updatedSession = await physicalTrainingService.updateSession(sessionId, sessionData);
      setSessions(sessions.map(session => 
        session.sessionID === sessionId ? updatedSession : session
      ));
      return updatedSession;
    } catch (err) {
      console.error('Failed to update session:', err);
      throw err;
    }
  };

  /**
   * Delete a training session
   * @param {string} sessionId - The ID of the session to delete
   * @returns {boolean} Success status
   */
  const deleteSession = async (sessionId) => {
    try {
      await physicalTrainingService.deleteSession(sessionId);
      setSessions(sessions.filter(session => session.sessionID !== sessionId));
      return true;
    } catch (err) {
      console.error('Failed to delete session:', err);
      throw err;
    }
  };

  /**
   * Mark a session as completed
   * @param {string} sessionId - The ID of the session to complete
   * @returns {Object} The updated session
   */
  const completeSession = async (sessionId) => {
    try {
      const updatedSession = await physicalTrainingService.updateSessionStatus(sessionId, 'completed');
      setSessions(sessions.map(session => 
        session.sessionID === sessionId ? updatedSession : session
      ));
      return updatedSession;
    } catch (err) {
      console.error('Failed to complete session:', err);
      throw err;
    }
  };

  /**
   * Generate a PDF report for instructor's sessions
   * @returns {boolean} Success status
   */
  const generateInstructorReport = async () => {
    try {
      if (!user?.InstructorID) {
        throw new Error('User is not an instructor');
      }
      
      const instructorSessions = sessions.filter(
        session => session.instructorID === user.InstructorID
      );
      
      await physicalTrainingService.generateInstructorReportPDF(
        user.InstructorID, 
        instructorSessions
      );
      
      return true;
    } catch (err) {
      console.error('Failed to generate instructor report:', err);
      throw err;
    }
  };

  // Load sessions when component mounts or user changes
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
    completeSession,
    generateInstructorReport
  };
};

export default useTrainingSessions;