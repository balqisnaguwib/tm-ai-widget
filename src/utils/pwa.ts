// PWA utilities for service worker registration and app installation

export const registerSW = async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available, show update notification
                console.log('New content available! Please refresh.');
              }
            });
          }
        });
  
        console.log('SW registered: ', registration);
        return registration;
      } catch (registrationError) {
        console.log('SW registration failed: ', registrationError);
        return null;
      }
    }
    return null;
  };
  
  // PWA install prompt
  let deferredPrompt: any = null;
  
  export const initPWAPrompt = () => {
    if (typeof window === 'undefined') return;
  
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      
      // Show custom install button
      showInstallPrompt();
    });
  
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      hideInstallPrompt();
      deferredPrompt = null;
    });
  };
  
  export const showInstallPrompt = () => {
    // Create or show install prompt UI
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.style.display = 'block';
    }
  };
  
  export const hideInstallPrompt = () => {
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.style.display = 'none';
    }
  };
  
  export const installPWA = async () => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return false;
    }
  
    // Show the prompt
    deferredPrompt.prompt();
  
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  
    deferredPrompt = null;
    return outcome === 'accepted';
  };
  
  // Check if app is running in standalone mode (installed as PWA)
  export const isPWAInstalled = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  };
  
  // iOS Safari specific PWA detection
  export const isIOSPWA = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    return (window.navigator as any).standalone === true;
  };
  
  // Check if device is iOS
  export const isIOS = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };
  
  // Show iOS install instructions
  export const showIOSInstallInstructions = () => {
    if (!isIOS() || isIOSPWA()) return false;
    
    // Show iOS-specific install instructions
    const instructions = `
      To install TM AI Day app on your iPhone/iPad:
      1. Tap the Share button at the bottom of Safari
      2. Scroll down and tap "Add to Home Screen"
      3. Tap "Add" in the top right corner
    `;
    
    console.log(instructions);
    return true;
  };
  
  // Network status utilities
  export const isOnline = (): boolean => {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
  };
  
  export const initNetworkListeners = (
    onOnline?: () => void,
    onOffline?: () => void
  ) => {
    if (typeof window === 'undefined') return;
  
    window.addEventListener('online', () => {
      console.log('App is online');
      onOnline?.();
    });
  
    window.addEventListener('offline', () => {
      console.log('App is offline');
      onOffline?.();
    });
  };
  
  // Cache management
  export const clearAppCache = async () => {
    if (typeof window === 'undefined' || !('caches' in window)) return false;
  
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  };
  
  // App version management
  export const getAppVersion = (): string => {
    return process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
  };
  
  export const checkForUpdates = async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;
  
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return true;
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
    return false;
  };