// src/services/physicalTrainingService.js
import axiosInstance from '../lib/axiosInstance';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const physicalTrainingService = {
  // Get all physical training sessions
  getAllSessions: async () => {
    try {
      const response = await axiosInstance.get('/physical-training');
      return response.data.sessions;
    } catch (error) {
      console.error('Error fetching physical training sessions:', error);
      throw error;
    }
  },

  // Get session by ID
  getSessionById: async (id) => {
    try {
      const response = await axiosInstance.get(`/physical-training/${id}`);
      return response.data.session;
    } catch (error) {
      console.error(`Error fetching physical training session ${id}:`, error);
      throw error;
    }
  },

  // Create a new session
  createSession: async (sessionData) => {
    try {
      const response = await axiosInstance.post('/physical-training', sessionData);
      return response.data.session;
    } catch (error) {
      console.error('Error creating physical training session:', error);
      throw error;
    }
  },

  // Update a session
  updateSession: async (id, sessionData) => {
    try {
      const response = await axiosInstance.put(`/physical-training/${id}`, sessionData);
      return response.data.session;
    } catch (error) {
      console.error(`Error updating physical training session ${id}:`, error);
      throw error;
    }
  },

  // Delete a session
  deleteSession: async (id) => {
    try {
      const response = await axiosInstance.delete(`/physical-training/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting physical training session ${id}:`, error);
      throw error;
    }
  },

  // Get sessions by instructor
  getSessionsByInstructor: async (instructorId) => {
    try {
      const response = await axiosInstance.get(`/physical-training/instructor/${instructorId}`);
      return response.data.sessions;
    } catch (error) {
      console.error(`Error fetching sessions by instructor ${instructorId}:`, error);
      throw error;
    }
  },

  // Get available sessions
  getAvailableSessions: async () => {
    try {
      const response = await axiosInstance.get('/physical-training/available');
      return response.data.sessions;
    } catch (error) {
      console.error('Error fetching available sessions:', error);
      throw error;
    }
  },

  // Get sessions by date range
  getSessionsByDateRange: async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get(`/physical-training/date-range?startDate=${startDate}&endDate=${endDate}`);
      return response.data.sessions;
    } catch (error) {
      console.error('Error fetching sessions by date range:', error);
      throw error;
    }
  },

  // Update session status
  updateSessionStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(`/physical-training/${id}/status`, { status });
      return response.data.session;
    } catch (error) {
      console.error(`Error updating session status for ${id}:`, error);
      throw error;
    }
  },

  // Enrollment operations
  enrollStudent: async (enrollmentData) => {
    try {
      const response = await axiosInstance.post('/enroll-pts', enrollmentData);
      return response.data;
    } catch (error) {
      console.error('Error enrolling student:', error);
      throw error;
    }
  },

  getEnrollmentsBySession: async (sessionId) => {
    try {
      const response = await axiosInstance.get(`/enroll-pts/session/${sessionId}`);
      return response.data.enrollments;
    } catch (error) {
      console.error(`Error fetching enrollments for session ${sessionId}:`, error);
      throw error;
    }
  },

  updateEnrollmentStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(`/enroll-pts/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating enrollment status for ${id}:`, error);
      throw error;
    }
  },

  // PDF Generation
  generateSessionDetailsPDF: async (sessionId) => {
    try {
      // Fetch session details
      const session = await physicalTrainingService.getSessionById(sessionId);
      
      // Fetch enrollments for this session
      const enrollments = await physicalTrainingService.getEnrollmentsBySession(sessionId);
      
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Physical Training Session Details', 14, 20);
      
      // Add session info
      doc.setFontSize(12);
      doc.text(`Session ID: ${session.sessionID}`, 14, 30);
      doc.text(`Date: ${new Date(session.date).toLocaleDateString()}`, 14, 37);
      doc.text(`Time: ${session.time}`, 14, 44);
      doc.text(`Location: ${session.location}`, 14, 51);
      doc.text(`Instructor ID: ${session.instructorID}`, 14, 58);
      doc.text(`Vehicle ID: ${session.vehicleID}`, 14, 65);
      doc.text(`Status: ${session.status}`, 14, 72);
      doc.text(`Enrollment: ${session.currentCount}/${session.maxCount}`, 14, 79);
      
      // Add enrolled students table
      if (enrollments && enrollments.length > 0) {
        doc.text('Enrolled Students:', 14, 90);
        
        const tableData = enrollments.map((enrollment, index) => [
          index + 1,
          enrollment.userId,
          enrollment.status,
          new Date(enrollment.enrollmentDate).toLocaleDateString()
        ]);
        
        doc.autoTable({
          startY: 95,
          head: [['#', 'Student ID', 'Status', 'Enrollment Date']],
          body: tableData,
        });
      } else {
        doc.text('No students enrolled yet.', 14, 90);
      }
      
      // Save the PDF
      return doc.save(`session-${sessionId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  },

  generateInstructorReportPDF: async (instructorId, startDate, endDate) => {
    try {
      // Fetch instructor sessions in the date range
      const sessions = await physicalTrainingService.getSessionsByDateRange(startDate, endDate);
      const instructorSessions = sessions.filter(session => session.instructorID === instructorId);
      
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Instructor Sessions Report', 14, 20);
      
      // Add report info
      doc.setFontSize(12);
      doc.text(`Instructor ID: ${instructorId}`, 14, 30);
      doc.text(`Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`, 14, 37);
      doc.text(`Total Sessions: ${instructorSessions.length}`, 14, 44);
      
      // Calculate statistics
      const completedSessions = instructorSessions.filter(s => s.status === 'completed').length;
      const pendingSessions = instructorSessions.filter(s => s.status === 'pending').length;
      const totalCapacity = instructorSessions.reduce((sum, s) => sum + s.maxCount, 0);
      const totalEnrolled = instructorSessions.reduce((sum, s) => sum + s.currentCount, 0);
      
      doc.text(`Completed Sessions: ${completedSessions}`, 14, 51);
      doc.text(`Pending Sessions: ${pendingSessions}`, 14, 58);
      doc.text(`Total Capacity: ${totalCapacity}`, 14, 65);
      doc.text(`Total Enrolled: ${totalEnrolled}`, 14, 72);
      doc.text(`Utilization Rate: ${totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0}%`, 14, 79);
      
      // Add sessions table
      if (instructorSessions.length > 0) {
        doc.text('Sessions:', 14, 90);
        
        const tableData = instructorSessions.map((session, index) => [
          index + 1,
          session.sessionID,
          new Date(session.date).toLocaleDateString(),
          session.time,
          session.location,
          `${session.currentCount}/${session.maxCount}`,
          session.status
        ]);
        
        doc.autoTable({
          startY: 95,
          head: [['#', 'Session ID', 'Date', 'Time', 'Location', 'Enrollment', 'Status']],
          body: tableData,
        });
      } else {
        doc.text('No sessions found for this instructor in the selected date range.', 14, 90);
      }
      
      // Save the PDF
      return doc.save(`instructor-${instructorId}-report.pdf`);
    } catch (error) {
      console.error('Error generating instructor report PDF:', error);
      throw error;
    }
  }
};