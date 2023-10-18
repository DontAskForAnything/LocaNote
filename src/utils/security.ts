import * as SecureStore from "expo-secure-store";

export async function saveSecureStore(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getSecureStore(key: string | undefined) {
  if (!key) return undefined;
  const token = await SecureStore.getItemAsync(key);
  return token;
}
export async function deleteSecureStore(key: string) {
  await SecureStore.deleteItemAsync(key);
}
