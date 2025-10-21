import { useNavigate } from 'react-router-dom';

const NotFoundView = () => {
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-[#f6f4f1] text-[rgba(0,0,0,0.95)] flex flex-col">
      <header className="flex items-center gap-2 p-4 h-6">
        <img
          src="https://www.youware.com/icons/logo.svg"
          alt="YOUWARE Logo"
          className="w-6 h-6"
        />
        <p className="text-base font-medium translate-y-[2px]">YouWare</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24 text-center">
        <div className="max-w-md">
          <h1 className="font-normal leading-none text-[80px] sm:text-[100px] md:text-[128px]">404</h1>
          <h2 className="mt-2 text-2xl sm:text-[32px] md:text-[40px] font-medium leading-tight">
            Oops, something went wrong!
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[rgba(0,0,0,0.45)]">
            Try to reload the page or contact us if the problem persists.
          </p>

          <div className="mt-12 sm:mt-16 md:mt-20 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-3 sm:space-y-0">
            <button
              type="button"
              onClick={handleReload}
              className="w-36 sm:w-40 h-12 sm:h-14 rounded-2xl bg-[#55644a] text-white font-medium text-sm sm:text-base flex items-center justify-center transition-transform duration-150 hover:scale-[1.01] active:scale-95"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={handleGoHome}
              className="w-36 sm:w-40 h-12 sm:h-14 rounded-2xl border border-[rgba(0,0,0,0.18)] text-[rgba(0,0,0,0.80)] font-medium text-sm sm:text-base flex items-center justify-center transition-transform duration-150 hover:scale-[1.01] active:scale-95"
            >
              Go to Editor
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFoundView;
