function load(storage: Storage, key: string) {
  try {
    const serializedState = storage.getItem(key);
    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch (error) {
    console.warn(error);
    storage.removeItem(key);
    return undefined;
  }
}

function save(storage: Storage, key: string, object: unknown) {
  if (object === null) {
    storage.removeItem(key);
    return;
  }

  try {
    const serializedState = JSON.stringify(object);
    storage.setItem(key, serializedState);
  } catch (error) {
    console.warn(error);
  }
}

export const storage = {
  local: {
    load: (key: string) => load(window.localStorage, key),
    save: (key: string, object: unknown) =>
      save(window.localStorage, key, object),
  },
  session: {
    load: (key: string) => load(window.sessionStorage, key),
    save: (key: string, object: unknown) =>
      save(window.sessionStorage, key, object),
  },
};
