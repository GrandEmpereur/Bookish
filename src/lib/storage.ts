// Unified storage service for Capacitor apps
// Uses Capacitor Preferences API on native platforms for better persistence
// Falls back to localStorage on web platforms
// Differentiates between Desktop and Mobile to avoid conflicts

import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";

interface StorageOptions {
  retries?: number;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Detect platform and create appropriate key prefix
function getPlatformPrefix(): string {
  const isNative = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform();

  if (isNative) {
    // Native platforms: ios, android
    return `mobile_${platform}_`;
  } else {
    // Web platforms: web, electron
    return `desktop_web_`;
  }
}

// Add platform prefix to keys to avoid conflicts
function getPlatformKey(key: string): string {
  const prefix = getPlatformPrefix();
  return `${prefix}${key}`;
}

// Browser storage using localStorage with platform-specific keys
async function browserStorage(
  action: "get" | "set" | "remove",
  key: string,
  value?: any
): Promise<any> {
  const platformKey = getPlatformKey(key);

  try {
    switch (action) {
      case "get":
        const item = localStorage.getItem(platformKey);
        return item ? { value: item } : { value: null };

      case "set":
        localStorage.setItem(platformKey, value);
        return;

      case "remove":
        localStorage.removeItem(platformKey);
        return;

      default:
        throw new Error(`Action ${action} non supportée`);
    }
  } catch (error) {
    console.warn(
      `Erreur localStorage pour ${action} (key: ${platformKey}):`,
      error
    );
    throw error;
  }
}

// Capacitor storage using Preferences API with platform-specific keys
async function capacitorStorage(
  action: "get" | "set" | "remove",
  key: string,
  value?: any
): Promise<any> {
  const platformKey = getPlatformKey(key);

  try {
    switch (action) {
      case "get":
        return await Preferences.get({ key: platformKey });

      case "set":
        await Preferences.set({ key: platformKey, value });
        return;

      case "remove":
        await Preferences.remove({ key: platformKey });
        return;

      default:
        throw new Error(`Action ${action} non supportée`);
    }
  } catch (error) {
    console.warn(
      `Erreur Preferences pour ${action} (key: ${platformKey}):`,
      error
    );
    throw error;
  }
}

// Main storage helper – detects platform and uses appropriate storage
async function storageRequest(
  action: "get" | "set" | "remove",
  key: string,
  value?: any,
  { retries = 2 }: StorageOptions = {}
): Promise<any> {
  const isNative = Capacitor.isNativePlatform();

  try {
    if (isNative) {
      return await capacitorStorage(action, key, value);
    } else {
      return await browserStorage(action, key, value);
    }
  } catch (error: any) {
    // Retry logic pour les erreurs de storage
    if (retries > 0) {
      await delay(100);
      return storageRequest(action, key, value, { retries: retries - 1 });
    }
    throw error;
  }
}

// Public API
export const storage = {
  // Get a string value
  async getString(key: string): Promise<string | null> {
    const result = await storageRequest("get", key);
    return result.value;
  },

  // Set a string value
  async setString(key: string, value: string): Promise<void> {
    await storageRequest("set", key, value);
  },

  // Get an object (auto JSON parse)
  async getObject<T>(key: string): Promise<T | null> {
    const result = await storageRequest("get", key);
    if (!result.value) return null;

    try {
      return JSON.parse(result.value) as T;
    } catch (error) {
      console.warn(`Erreur parsing JSON pour ${key}:`, error);
      return null;
    }
  },

  // Set an object (auto JSON stringify)
  async setObject<T>(key: string, value: T): Promise<void> {
    const jsonValue = JSON.stringify(value);
    await storageRequest("set", key, jsonValue);
  },

  // Get a boolean
  async getBoolean(key: string): Promise<boolean | null> {
    const result = await storageRequest("get", key);
    if (!result.value) return null;
    return result.value === "true";
  },

  // Set a boolean
  async setBoolean(key: string, value: boolean): Promise<void> {
    await storageRequest("set", key, value.toString());
  },

  // Remove a key
  async remove(key: string): Promise<void> {
    await storageRequest("remove", key);
  },

  // Clear all storage (use with caution!)
  async clear(): Promise<void> {
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      await Preferences.clear();
    } else {
      localStorage.clear();
    }
  },

  // Get all keys (filtered by platform)
  async keys(): Promise<string[]> {
    const isNative = Capacitor.isNativePlatform();
    const prefix = getPlatformPrefix();

    if (isNative) {
      const result = await Preferences.keys();
      // Filter keys for current platform and remove prefix
      return result.keys
        .filter((key) => key.startsWith(prefix))
        .map((key) => key.substring(prefix.length));
    } else {
      // Filter localStorage keys for current platform and remove prefix
      return Object.keys(localStorage)
        .filter((key) => key.startsWith(prefix))
        .map((key) => key.substring(prefix.length));
    }
  },

  // Get platform info (for debugging)
  getPlatformInfo(): { platform: string; prefix: string; isNative: boolean } {
    const platform = Capacitor.getPlatform();
    const prefix = getPlatformPrefix();
    const isNative = Capacitor.isNativePlatform();

    return { platform, prefix, isNative };
  },
};

// Migration helper for existing users
export const storageMigration = {
  // Migrate old localStorage data to new platform-specific keys
  async migrateOnboardingData(): Promise<void> {
    try {
      // Check if old data exists (without platform prefix)
      const oldValue = localStorage.getItem("hasSeenOnboarding");

      if (oldValue !== null) {
        // Save to new platform-specific storage
        await storage.setBoolean("hasSeenOnboarding", oldValue === "true");

        // Remove old data to avoid conflicts
        localStorage.removeItem("hasSeenOnboarding");

        console.log("✅ Migration onboarding data terminée");
      }
    } catch (error) {
      console.warn("⚠️ Erreur lors de la migration:", error);
    }
  },
};

// Debug helper for development
export const storageDebug = {
  // Log all stored preferences (useful for Xcode debugging)
  async logAllPreferences(): Promise<void> {
    const isNative = Capacitor.isNativePlatform();
    const platformInfo = storage.getPlatformInfo();

    console.log("🔍 === STORAGE DEBUG ===");
    console.log("📱 Platform Info:", platformInfo);

    try {
      if (isNative) {
        // Get all Capacitor Preferences
        const allKeys = await Preferences.keys();
        console.log("🗝️ All Preferences Keys:", allKeys.keys);

        // Get values for our platform
        const ourKeys = await storage.keys();
        console.log("🎯 Our Platform Keys:", ourKeys);

        for (const key of ourKeys) {
          const value = await storage.getString(key);
          console.log(`📄 ${key}: ${value}`);
        }
      } else {
        // Get all localStorage for web
        const allKeys = Object.keys(localStorage);
        console.log("🗝️ All localStorage Keys:", allKeys);

        const ourKeys = await storage.keys();
        console.log("🎯 Our Platform Keys:", ourKeys);

        for (const key of ourKeys) {
          const value = await storage.getString(key);
          console.log(`📄 ${key}: ${value}`);
        }
      }
    } catch (error) {
      console.error("❌ Erreur debug storage:", error);
    }

    console.log("🔍 === END DEBUG ===");
  },

  // Test storage functionality
  async testStorage(): Promise<void> {
    console.log("🧪 === STORAGE TEST ===");

    try {
      // Test string
      await storage.setString("test_string", "Hello World");
      const testString = await storage.getString("test_string");
      console.log("✅ String test:", testString);

      // Test boolean
      await storage.setBoolean("test_boolean", true);
      const testBoolean = await storage.getBoolean("test_boolean");
      console.log("✅ Boolean test:", testBoolean);

      // Test object
      const testObj = { name: "John", age: 30 };
      await storage.setObject("test_object", testObj);
      const retrievedObj = await storage.getObject("test_object");
      console.log("✅ Object test:", retrievedObj);

      // Clean up
      await storage.remove("test_string");
      await storage.remove("test_boolean");
      await storage.remove("test_object");

      console.log("✅ Storage test completed successfully");
    } catch (error) {
      console.error("❌ Storage test failed:", error);
    }

    console.log("🧪 === END TEST ===");
  },
};

// Convenience functions for common use cases
export const onboardingStorage = {
  async hasSeenOnboarding(): Promise<boolean> {
    // Attempt migration first for existing users
    await storageMigration.migrateOnboardingData();

    const seen = await storage.getBoolean("hasSeenOnboarding");
    return seen === true;
  },

  async setOnboardingSeen(seen: boolean = true): Promise<void> {
    await storage.setBoolean("hasSeenOnboarding", seen);
  },
};

// User preferences helper
export const userPreferences = {
  async getTheme(): Promise<"light" | "dark" | "system" | null> {
    return (await storage.getString("theme")) as
      | "light"
      | "dark"
      | "system"
      | null;
  },

  async setTheme(theme: "light" | "dark" | "system"): Promise<void> {
    await storage.setString("theme", theme);
  },

  async getLanguage(): Promise<string | null> {
    return await storage.getString("language");
  },

  async setLanguage(language: string): Promise<void> {
    await storage.setString("language", language);
  },
};
