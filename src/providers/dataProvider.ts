// dataProvider.ts
import { fetchUtils } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest"; // ya apna custom provider

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const httpClient = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }

  const auth = localStorage.getItem("auth");
  if (auth) {
    const token = JSON.parse(auth).data?.token;
    if (token) {
      options.headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return fetchUtils.fetchJson(url, options);
};

export const dataProvider = simpleRestProvider(API_URL, httpClient);
