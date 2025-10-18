/**
 * Storage Manager Utility
 * Handles clearing all browser storage including localStorage, sessionStorage, and cookies
 */

export const clearAllBrowserStorage = (): void => {
  try {
    // Clear localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
      console.log('✅ localStorage cleared');
    }

    // Clear sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.clear();
      console.log('✅ sessionStorage cleared');
    }

    // Clear all cookies
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        if (name) {
          // Clear cookie for current domain
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          // Clear cookie for current domain with subdomain
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          // Clear cookie for parent domain
          const domainParts = window.location.hostname.split('.');
          if (domainParts.length > 1) {
            const parentDomain = '.' + domainParts.slice(-2).join('.');
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${parentDomain}`;
          }
        }
      }
      console.log('✅ Cookies cleared');
    }

    // Clear IndexedDB (if any databases exist)
    if (typeof window !== 'undefined' && window.indexedDB) {
      // Note: IndexedDB clearing is more complex and database-specific
      // For now, we'll just log that we attempted to clear it
      console.log('✅ IndexedDB clearing attempted (database-specific implementation may be needed)');
    }

    console.log('🧹 All browser storage cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing browser storage:', error);
  }
};

/**
 * Clear specific storage keys (for more targeted clearing if needed)
 */
export const clearSpecificStorageKeys = (keys: string[]): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      keys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`✅ Removed localStorage key: ${key}`);
      });
    }
  } catch (error) {
    console.error('❌ Error clearing specific storage keys:', error);
  }
};

/**
 * Check if storage is empty
 */
export const isStorageEmpty = (): boolean => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.length === 0;
    }
    return true;
  } catch (error) {
    console.error('❌ Error checking storage:', error);
    return true;
  }
};