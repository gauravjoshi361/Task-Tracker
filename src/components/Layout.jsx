import Navigation from './Navigation';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto p-6">
        {children}
      </div>
    </div>
  );
}