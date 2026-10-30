'use client';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <h1 className="text-8xl font-black text-[#0C1172]">404</h1>
        <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-[#111344] text-white font-semibold rounded-lg hover:bg-[#0C1172] transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

