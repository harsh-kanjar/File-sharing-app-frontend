import React from 'react';

function MainLayout({ children }) {
  return (
    <div
      className="flex flex-col min-h-screen rounded-md"
      style={{
        backgroundImage: "url('/bg/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Main content will grow to push footer down */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      
    </div>
  );
}

export default MainLayout;
