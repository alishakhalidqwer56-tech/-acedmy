import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { CoursesPage } from './pages/public/CoursesPage';
import { CourseDetailPage } from './pages/public/CourseDetailPage';
import { ContactPage } from './pages/public/ContactPage';
import { AdmissionsPage } from './pages/public/AdmissionsPage';
import { FacultyPage } from './pages/public/FacultyPage';
import { EventsPage } from './pages/public/EventsPage';
import { BlogPage } from './pages/public/BlogPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { AdmissionsStatusPage } from './pages/public/AdmissionsStatusPage';
import { BlogPostDetailPage } from './pages/public/BlogPostDetailPage';
import { CelebrationVideoPage } from './pages/public/CelebrationVideoPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Student Portal Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentCoursesPage } from './pages/student/StudentCoursesPage';
import { StudentVideosPage } from './pages/student/StudentVideosPage';
import { StudentAttendancePage } from './pages/student/StudentAttendancePage';
import { StudentResultsPage } from './pages/student/StudentResultsPage';
import { StudentFeePage } from './pages/student/StudentFeePage';
import { StudentNotificationsPage } from './pages/student/StudentNotificationsPage';

// Parent Portal Pages
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ParentAttendancePage } from './pages/parent/ParentAttendancePage';
import { ParentResultsPage } from './pages/parent/ParentResultsPage';
import { ParentFeePage } from './pages/parent/ParentFeePage';
import { ParentNotificationsPage } from './pages/parent/ParentNotificationsPage';

// Teacher Portal Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherClassesPage } from './pages/teacher/TeacherClassesPage';
import { TeacherAttendancePage } from './pages/teacher/TeacherAttendancePage';
import { TeacherResultsPage } from './pages/teacher/TeacherResultsPage';
import { TeacherVideosPage } from './pages/teacher/TeacherVideosPage';
import { TeacherBlogPage } from './pages/teacher/TeacherBlogPage';
import { TeacherNotificationsPage } from './pages/teacher/TeacherNotificationsPage';

// Admin Portal Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminSubjectsPage } from './pages/admin/AdminSubjectsPage';
import { AdminClassesPage } from './pages/admin/AdminClassesPage';
import { AdminTermsPage } from './pages/admin/AdminTermsPage';
import { AdminAdmissionsPage } from './pages/admin/AdminAdmissionsPage';
import { AdminAttendancePage } from './pages/admin/AdminAttendancePage';
import { AdminResultsPage } from './pages/admin/AdminResultsPage';
import { AdminFeePage } from './pages/admin/AdminFeePage';
import { AdminGradingPage } from './pages/admin/AdminGradingPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminChatbotPage } from './pages/admin/AdminChatbotPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage';
import { AdminWebsiteCMSPage } from './pages/admin/AdminWebsiteCMSPage';
import { AdminPostersPage } from './pages/admin/AdminPostersPage';

// Chatbot & Shared
import { AcademyChatbot } from './components/chatbot/AcademyChatbot';
import { ProfilePage } from './pages/shared/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#0f0f0f] text-slate-100 font-['Poppins',sans-serif]">
        <Routes>
          {/* ================= PUBLIC ROUTES (with Public Navbar & Footer) ================= */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="flex-1"><HomePage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <main className="flex-1"><AboutPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/courses"
            element={
              <>
                <Navbar />
                <main className="flex-1"><CoursesPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <>
                <Navbar />
                <main className="flex-1"><CourseDetailPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/admissions"
            element={
              <>
                <Navbar />
                <main className="flex-1"><AdmissionsPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/admissions/status"
            element={
              <>
                <Navbar />
                <main className="flex-1"><AdmissionsStatusPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/faculty"
            element={
              <>
                <Navbar />
                <main className="flex-1"><FacultyPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/events"
            element={
              <>
                <Navbar />
                <main className="flex-1"><EventsPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/blog"
            element={
              <>
                <Navbar />
                <main className="flex-1"><BlogPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <>
                <Navbar />
                <main className="flex-1"><BlogPostDetailPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/celebration-video"
            element={
              <>
                <Navbar />
                <main className="flex-1"><CelebrationVideoPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/bise-results-2025"
            element={
              <>
                <Navbar />
                <main className="flex-1"><CelebrationVideoPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <main className="flex-1"><ContactPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <main className="flex-1"><LoginPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/admin-login"
            element={
              <>
                <Navbar />
                <main className="flex-1"><LoginPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <>
                <Navbar />
                <main className="flex-1"><ForgotPasswordPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/reset-password"
            element={
              <>
                <Navbar />
                <main className="flex-1"><ResetPasswordPage /></main>
                <Footer />
              </>
            }
          />

          {/* ================= STUDENT PROTECTED ROUTES ================= */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/videos"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentVideosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/results"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/fee"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentFeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/fees"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentFeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentNotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ================= PARENT PROTECTED ROUTES ================= */}
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/attendance"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/results"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/fee"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentFeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/fees"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentFeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/notifications"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentNotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/profile"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ================= TEACHER PROTECTED ROUTES ================= */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/classes"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherClassesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/attendance"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/results"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/videos"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherVideosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/blog"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherBlogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/notifications"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherNotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/profile"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN PROTECTED ROUTES ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subjects"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSubjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/classes"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminClassesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/terms"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminTermsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/admissions"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAdmissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/results"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fee"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminFeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fees"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminFeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/grading"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminGradingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminBlogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminTestimonialsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminGalleryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminNotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chatbot"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminChatbotPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminInquiriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/website-cms"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminWebsiteCMSPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posters"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPostersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/banners"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminWebsiteCMSPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hero-slides"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminWebsiteCMSPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminWebsiteCMSPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main className="flex-1"><NotFoundPage /></main>
                <Footer />
              </>
            }
          />
        </Routes>

        {/* 24/7 Academy Client & Admissions AI Chatbot */}
        <AcademyChatbot />
      </div>
    </BrowserRouter>
  );
}
