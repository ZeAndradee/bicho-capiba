import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Coordinates, parseCoordinates } from "@/utils/geo";

const STORAGE_KEY = "bicho-capiba:user-location";

const readStoredLocation = (): Coordinates | null => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const { latitude, longitude } = JSON.parse(stored);
    return parseCoordinates(latitude, longitude);
  } catch {
    return null;
  }
};

const storeLocation = (location: Coordinates) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch {}
};

export const useUserLocation = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    const stored = readStoredLocation();
    if (stored) {
      setLocation(stored);
      setIsResolved(true);
      return;
    }

    const fallback = parseCoordinates(user?.latitude, user?.longitude);

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocation(fallback);
      setIsResolved(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const current = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
        storeLocation(current);
        setLocation(current);
        setIsResolved(true);
      },
      () => {
        setLocation(fallback);
        setIsResolved(true);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  }, [user?.latitude, user?.longitude]);

  return { location, isResolved };
};
