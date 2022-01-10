import { StateStorage } from "zustand/middleware";

const store: Record<string, any> = {};

export const storageStub: StateStorage = {
  getItem: (name) => {
    return store[name];
  },
  setItem: (name, value) => {
    store[name] = value;
  },
  removeItem: (name) => {
    delete store[name];
  },
};
