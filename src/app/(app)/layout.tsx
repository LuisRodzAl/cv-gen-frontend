import Sidebar from '@/components/layout/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 print:bg-white">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <main className="flex-1 ml-64 print:ml-0 p-8 print:p-0">{children}</main>
    </div>
  );
}
