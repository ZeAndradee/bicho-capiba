import { cache } from "react";
import { getApiInstance } from "@/hooks/Api";

const api = getApiInstance();

export type EventCategory = "castracao" | "vacinacao" | "adocao";

export type EventSpecies = "dog" | "cat";

export interface PetEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  weekday: string;
  neighborhood: string;
  address: string;
  city: string;
  startTime: string | null;
  bookingUrl: string;
  mapsUrl: string;
}

export interface EventSlot {
  time: string;
  arrival: string;
  audience: string;
  species: EventSpecies;
}

export interface EventRestriction {
  title: string;
  groups: { label: string; items: string[] }[];
}

export interface CityEventsResponse {
  events: PetEvent[];
  slots: EventSlot[];
  bookingStatus: string | null;
  bookingPeriod: string | null;
  notices: string[];
  restriction: EventRestriction | null;
  bookingUrl: string | null;
  source: { name: string; url: string } | null;
  updatedAt: string | null;
}

export const fetchCityEvents = async (
  citySlug: string,
): Promise<CityEventsResponse> => {
  try {
    const response = await api.get(`/events/${citySlug}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching city events:", error);
    throw error;
  }
};

export const getCityEvents = cache(fetchCityEvents);
