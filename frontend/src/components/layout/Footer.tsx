export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">
          <p>&copy; {currentYear} Revu AI. All rights reserved.</p>
          <p className="mt-2 text-sm">
            AI-powered product reviews and ratings
          </p>
        </div>
      </div>
    </footer>
  );
};
