<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found - YOUWARE</title>
  <style>
    @font-face {
      font-family: 'yourwareSans';
      src: url('https://www.youware.com/fonts/youware-sans/youware-sans-regular.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'yourwareSans';
      src: url('https://www.youware.com/fonts/youware-sans/youware-sans-medium.woff2') format('woff2');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }

    body {
      margin: 0;
      padding: 0;
      /* font-family: 'Courier Prime', monospace; */
      font-family: 'yourwareSans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #f6f4f1;
      color: rgba(0, 0, 0, 0.95);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      line-height: 1.2;
    }

    header {
      height: 24px;
      display: flex;
      justify-content: flex-start;
      padding: 16px;
      align-items: center;
      gap: 8px;
    }

    .logo {
      width: 24px;
      height: 24px;
    }

    .logo-text {
      font-size: 16px;
      transform: translateY(2px);
    }

    .version {
      font-size: 10px;
      border-radius: 4px;
      border: 0.5px solid #000;
      padding: 2px 4px;
      font-size: 10px;
    }

    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
      margin-bottom: 120px;
    }

    .content {
      text-align: center;
    }

    h1 {
      font-size: 80px;
      margin-bottom: 8px;
      font-weight: 400;
      line-height: 1;
    }

    h2 {
      font-size: 28px;
      font-weight: 500;
      margin-top: 0;
      margin-bottom: 12px;
      line-height: 1.2;
    }

    .description {
      color: rgba(0, 0, 0, 0.45);
      margin-top: 12px;
      margin-bottom: 0;
      font-size: 14px;
    }

    .button {
      border: none;
      outline: none;
      margin-top: 48px;
      width: 144px;
      height: 48px;
      /* font-family: 'Courier Prime', monospace; */
      font-family: 'yourwareSans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: 500;
      background-color: #55644a;
      color: white;
      text-decoration: none;
      font-size: 14px;
    }

    @media (min-width: 640px) {
      h1 {
        font-size: 100px;
      }

      h2 {
        font-size: 32px;
      }

      p {
        font-size: 16px;
      }

      .button {
        margin-top: 64px;
        width: 160px;
        height: 56px;
        font-size: 16px;
      }
    }

    @media (min-width: 768px) {
      h1 {
        font-size: 128px;
      }

      h2 {
        font-size: 40px;
      }

      .button {
        margin-top: 80px;
      }
    }
  </style>
  <!-- <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;500&display=swap" rel="stylesheet"> -->
<script src="https://lib.youware.com/youware-lib-editor.1760171868.js" id="yourware-lib"></script></head>

<body>
  <header>
    <img src="https://www.youware.com/icons/logo.svg" alt="YOUWARE Logo" class="logo">
    <p class="logo-text">YouWare</p>
  </header>

  <main>
    <div class="content">
      <h1 class="title">404</h1>
      <h2 class="subtitle">Oops, something went wrong!</h2>
      <p class="description">Try to reload the page or contact us if the problem persists.</p>
      <button class="button" onclick="window.location.reload()">Reload</button>
    </div>
  </main>
</body>

</html>