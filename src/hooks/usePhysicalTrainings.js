// src/hooks/usePhysicalTrainings.js
import { useState, useEffect, useCallback } from 'react';
import { physicalTrainingService } from '../services/physicalTrainingService';
import { useAuth } from '../contexts/AuthContext';

export const usePhysicalTrainings = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Get all sessions or instructor's sessions if logged in
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (user && user.InstructorID) {
        data = await physicalTrainingService.getSessionsByInstructor(user.InstructorID);
      } else {
        data = await physicalTrainingService.getAllSessions();
      }
      setSessions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch physical training sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create session
  const createSession = async (sessionData) => {
    setLoading(true);
    try {
      const newSession = await physicalTrainingService.createSession(sessionData);
      setSessions([...sessions, newSession]);
      setError(null);
      return newSession;
    } catch (err) {
      setError('Failed to create session');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update session
  const updateSession = async (id, sessionData) => {
    setLoading(true);
    try {
      const updatedSession = await physicalTrainingService.updateSession(id, sessionData);
      setSessions(sessions.map(session => 
        session.sessionID === id ? updatedSession : session
      ));
      setError(null);
      return updatedSession;
    } catch (err) {
      setError('Failed to update session');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete session
  const deleteSession = async (id) => {
    setLoading(true);
    try {
      await physicalTrainingService.deleteSession(id);
      setSessions(sessions.filter(session => session.sessionID !== id));
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to delete session');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update session status
  const updateSessionStatus = async (id, status) => {
    setLoading(true);
    try {
      const updatedSession = await physicalTrainingService.updateSessionStatus(id, status);
      setSessions(sessions.map(session => 
        session.sessionID === id ? updatedSession : session
      ));
      setError(null);
      return updatedSession;
    } catch (err) {
      setError('Failed to update session status');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generate session PDF report
  const generateSessionPDF = async (id) => {
    setLoading(true);
    try {
      await physicalTrainingService.generateSessionDetailsPDF(id);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to generate session PDF');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generate instructor's report PDF for a date range
  const generateInstructorReportPDF = async (instructorId, startDate, endDate) => {
    setLoading(true);
    try {
      await physicalTrainingService.generateInstructorReportPDF(instructorId, startDate, endDate);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to generate instructor report PDF');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load sessions on initial render
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
    updateSessionStatus,
    generateSessionPDF,
    generateInstructorReportPDF,
  };
};

// src/hooks/useEnrollments.js
import { useState, useEffect, useCallback } from 'react';
import { physicalTrainingService } from '../services/physicalTrainingService';

export const useEnrollments = (sessionId = null) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch enrollments for a specific session
  const fetchEnrollments = useCallback(async () => {
    if (!sessionId) return;
    
    setLoading(true);
    try {
      const data = await physicalTrainingService.getEnrollmentsBySession(sessionId);
      setEnrollments(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch enrollments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Update enrollment status
  const updateEnrollmentStatus = async (id, status) => {
    setLoading(true);
    try {
      await physicalTrainingService.updateEnrollmentStatus(id, status);
      setEnrollments(enrollments.map(enrollment => 
        enrollment._id === id ? { ...enrollment, status } : enrollment
      ));
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to update enrollment status');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load enrollments if sessionId is provided
  useEffect(() => {
    if (sessionId) {
      fetchEnrollments();
    }
  }, [sessionId, fetchEnrollments]);

  return {
    enrollments,
    loading,
    error,
    fetchEnrollments,
    updateEnrollmentStatus,
  };
};