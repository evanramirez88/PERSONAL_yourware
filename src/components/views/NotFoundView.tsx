import { useCallback } from 'react';
import { Link } from 'react-router-dom';

const NotFoundView = () => {
  const handleReload = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f4f1] text-[rgba(0,0,0,0.95)] flex flex-col font-sans">
      <header className="flex items-center gap-2 h-24 px-6">
        <img
          src="https://www.youware.com/icons/logo.svg"
          alt="YOUWARE Logo"
          className="w-6 h-6"
          loading="lazy"
        />
        <p className="text-base font-medium">YouWare</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24 text-center">
        <h1 className="text-[clamp(4rem,12vw,8rem)] font-normal leading-none">404</h1>
        <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-medium leading-tight">
          Oops, something went wrong!
        </h2>
        <p className="mt-3 text-sm sm:text-base text-black/45 max-w-md">
          Try to reload the page or contact us if the problem persists.
        </p>
        <div className="mt-12 sm:mt-16 flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleReload}
            className="inline-flex min-w-[144px] items-center justify-center rounded-2xl bg-[#55644a] px-8 py-3 text-sm font-medium text-white shadow-md transition hover:bg-[#445039] sm:h-14 sm:min-w-[160px] sm:px-10 sm:text-base"
          >
            Reload
          </button>
          <Link
            to="/editor"
            className="inline-flex min-w-[144px] items-center justify-center rounded-2xl border border-black/15 bg-white px-8 py-3 text-sm font-medium text-black/70 shadow-md transition hover:border-black/25 hover:bg-black/5 sm:h-14 sm:min-w-[160px] sm:px-10 sm:text-base"
          >
            Go to Editor
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFoundView;
