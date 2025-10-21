import { useEffect } from 'react';

const LIB_SCRIPT_ID = 'yourware-lib';
const LIB_SCRIPT_SRC = 'https://lib.youware.com/youware-lib-editor.1760171868.js';

const ensureYourwareScript = () => {
  if (document.getElementById(LIB_SCRIPT_ID)) {
    return undefined;
  }

  const script = document.createElement('script');
  script.src = LIB_SCRIPT_SRC;
  script.async = true;
  script.id = LIB_SCRIPT_ID;
  document.head.appendChild(script);

  return () => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };
};

const NotFoundView = () => {
  useEffect(() => {
    const cleanup = ensureYourwareScript();
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f4f1] text-black flex flex-col font-[\'yourwareSans\']">
      <header className="flex items-center gap-2 px-6 py-4 h-16">
        <img
          src="https://www.youware.com/icons/logo.svg"
          alt="YOUWARE Logo"
          className="w-6 h-6"
        />
        <p className="text-base tracking-tight">YouWare</p>
        <span className="ml-2 inline-flex items-center rounded border border-black/50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-black/70">
          Personal Agent Studio
        </span>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-28 text-center">
        <div className="max-w-xl">
          <h1 className="text-[80px] sm:text-[100px] md:text-[128px] leading-none font-normal">404</h1>
          <h2 className="mt-2 text-[28px] sm:text-[32px] md:text-[40px] font-medium leading-tight">
            Oops, something went wrong!
          </h2>
          <p className="mt-3 text-sm sm:text-base text-black/60">
            Try to reload the page or contact us if the problem persists.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-12 inline-flex h-12 w-36 items-center justify-center rounded-2xl bg-[#55644a] px-6 text-sm font-medium text-white transition hover:bg-[#47533d] sm:mt-16 sm:h-14 sm:w-40 sm:text-base"
          >
            Reload
          </button>
        </div>
      </main>
    </div>
  );
};

export default NotFoundView;
