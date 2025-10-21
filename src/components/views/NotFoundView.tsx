import { useCallback } from 'react';

const NotFoundView = () => {
  const handleReload = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f4f1] text-[rgba(0,0,0,0.95)] flex flex-col font-[yourwareSans] overflow-x-hidden leading-[1.2]">
      <header className="flex items-center gap-2 px-6 py-4">
        <img
          src="https://www.youware.com/icons/logo.svg"
          alt="YOUWARE Logo"
          className="w-6 h-6"
          loading="lazy"
        />
        <p className="text-base font-medium">YouWare</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-[120px] text-center">
        <h1 className="text-[clamp(5rem,16vw,8rem)] font-normal leading-none">404</h1>
        <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-medium leading-tight">
          Oops, something went wrong!
        </h2>
        <p className="mt-3 text-sm sm:text-base text-black/45 max-w-md">
          Try to reload the page or contact us if the problem persists.
        </p>
        <button
          type="button"
          onClick={handleReload}
          className="mt-12 sm:mt-16 md:mt-20 inline-flex h-[48px] w-[144px] sm:h-[56px] sm:w-[160px] items-center justify-center rounded-2xl bg-[#55644a] text-white font-medium text-sm sm:text-base transition hover:bg-[#445039]"
        >
          Reload
        </button>
      </main>
    </div>
  );
};

export default NotFoundView;
