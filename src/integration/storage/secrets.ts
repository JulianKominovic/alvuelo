import { load } from "@tauri-apps/plugin-store";

const storage = await load("secrets.json", { autoSave: false });

function get(key: string) {
	return storage.get(key);
}

function set(key: string, value: string) {
	return storage.set(key, value);
}

export const SecretsStorage = {
	get,
	set,
};
