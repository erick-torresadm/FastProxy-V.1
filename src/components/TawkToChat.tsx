import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: any;
  }
}

export function TawkToChat() {
  useEffect(() => {
    // Remove any existing Tawk.to script to avoid duplicates
    const existingScript = document.getElementById('tawkto-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and append the new script
    const script = document.createElement('script');
    script.id = 'tawkto-script';
    script.async = true;
    script.src = 'https://embed.tawk.to/673b2a734304e3196ae47317/1imsq0jbb';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Initialize Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    document.body.appendChild(script);

    // Cleanup
    return () => {
      const scriptToRemove = document.getElementById('tawkto-script');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return null;
}