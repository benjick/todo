interface Storage {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

const store: Record<string, any> = {};

export const storageStub: Storage = {
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
