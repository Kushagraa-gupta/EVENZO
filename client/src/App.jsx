import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Events } from './pages/Events';
import { EventDetail } from './pages/EventDetail';
import { Checkout } from './pages/Checkout';
import { BookingSuccess } from './pages/BookingSuccess';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { AttendeeLayout } from './pages/dashboard/attendee/AttendeeLayout';
import { AttendeeOverview } from './pages/dashboard/attendee/AttendeeOverview';
import { MyBookings } from './pages/dashboard/attendee/MyBookings';
import { MyTickets } from './pages/dashboard/attendee/MyTickets';
import { OrganizerLayout } from './pages/dashboard/organizer/OrganizerLayout';
import { OrganizerOverview } from './pages/dashboard/organizer/OrganizerOverview';
import { MyEvents } from './pages/dashboard/organizer/MyEvents';
import { CreateEvent } from './pages/dashboard/organizer/CreateEvent';
import { EditEvent } from './pages/dashboard/organizer/EditEvent';
import { EventBookings } from './pages/dashboard/organizer/EventBookings';
import { CheckinScanner } from './pages/dashboard/organizer/CheckinScanner';
import { OrganizerAnalytics } from './pages/dashboard/organizer/OrganizerAnalytics';
import { AdminLayout } from './pages/dashboard/admin/AdminLayout';
import { AdminOverview } from './pages/dashboard/admin/AdminOverview';
import { ManageUsers } from './pages/dashboard/admin/ManageUsers';
import { ManageEvents } from './pages/dashboard/admin/ManageEvents';
import { ManageBookings } from './pages/dashboard/admin/ManageBookings';
import { OrganizerApprovals } from './pages/dashboard/admin/OrganizerApprovals';
import { AdminAnalytics } from './pages/dashboard/admin/AdminAnalytics';
import { Profile } from './pages/dashboard/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, retry: 1 },
  },
});

const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1A1A2E',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Layout><Landing /></Layout>} />
            <Route path="/events" element={<Layout><Events /></Layout>} />
            <Route path="/events/:id" element={<Layout><EventDetail /></Layout>} />
            <Route path="/checkout/:id" element={<Layout><Checkout /></Layout>} />
            <Route
              path="/booking-success"
              element={
                <ProtectedRoute>
                  <Layout><BookingSuccess /></Layout>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
            <Route path="/reset-password/:token" element={<Layout><ResetPassword /></Layout>} />

            <Route path="/dashboard/attendee" element={<AttendeeLayout />}>
              <Route index element={<AttendeeOverview />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="tickets" element={<MyTickets />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="/dashboard/organizer" element={<OrganizerLayout />}>
              <Route index element={<OrganizerOverview />} />
              <Route path="events" element={<MyEvents />} />
              <Route path="create" element={<CreateEvent />} />
              <Route path="events/:id/edit" element={<EditEvent />} />
              <Route path="events/:id/bookings" element={<EventBookings />} />
              <Route path="scanner" element={<CheckinScanner />} />
              <Route path="analytics" element={<OrganizerAnalytics />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="/dashboard/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="approvals" element={<OrganizerApprovals />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);
