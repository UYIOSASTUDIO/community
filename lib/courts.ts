import { Sport } from "./types";
import courtsData from "@/data/courts.json";

export interface Court {
  id: string;
  name: string;
  address: string;
  district: string;
  sports: Sport[];
  lat: number;
  lng: number;
  note?: string;
}

export function getAllCourts(): Court[] {
  return courtsData as Court[];
}
