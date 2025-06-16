'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminHeader from '@/components/AdminHeader';

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  
  // Don't wrap login page with ProtectedRoute
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Wrap all other admin pages with ProtectedRoute
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
} 