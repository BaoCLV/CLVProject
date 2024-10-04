import ProfileSidebar from '@/src/shared/components/ProfileSidebar';
import Header from '@/src/shared/components/Header'; 
import App from '@/src/shared/views/route/userRoute';

export default function Page({ params }: { params: { userId: string } }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ProfileSidebar />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 bg-gray-200 border-black">
        {/* Header */}
        <Header />
        
        {/* Main App */}
        <App />
      </div>
    </div>
  );
}
