import { Navigate, createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/features/auth/pages/login-page';
import { ProtectedRoute } from '@/features/auth/components/protected-route';
import { RoleGuard } from '@/features/auth/components/role-guard';
import { AppLayout } from '@/app/layouts/app-layout';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';
import { MotoboyDetailPage } from '@/features/motoboys/pages/motoboy-detail-page';
import { MotoboyFormPage } from '@/features/motoboys/pages/motoboy-form-page';
import { MotoboysListPage } from '@/features/motoboys/pages/motoboys-list-page';
import { ServiceOrderDetailPage } from '@/features/service-orders/pages/service-order-detail-page';
import { ServiceOrderFormPage } from '@/features/service-orders/pages/service-order-form-page';
import { ServiceOrdersListPage } from '@/features/service-orders/pages/service-orders-list-page';
import { DistributionPage } from '@/features/distribution/pages/distribution-page';
import { UsersPage } from '@/features/users/pages/users-page';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/motoboys', element: <MotoboysListPage /> },
          { path: '/motoboys/new', element: <MotoboyFormPage /> },
          { path: '/motoboys/:id/edit', element: <MotoboyFormPage /> },
          { path: '/motoboys/:id', element: <MotoboyDetailPage /> },
          { path: '/service-orders', element: <ServiceOrdersListPage /> },
          { path: '/service-orders/new', element: <ServiceOrderFormPage /> },
          { path: '/service-orders/:id/edit', element: <ServiceOrderFormPage /> },
          { path: '/service-orders/:id', element: <ServiceOrderDetailPage /> },
          { path: '/distribution', element: <DistributionPage /> },
          { path: '/users', element: <RoleGuard allow={['admin', 'supervisor']}><UsersPage /></RoleGuard> },
        ],
      },
    ],
  },
]);
