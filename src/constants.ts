import { type } from "@tauri-apps/plugin-os";
const OS_TYPE = type();
const CONSTANTS = {
	OS_TYPE,
	OPENAI_CHEAP_MODEL: "gpt-4.1-nano" as const,
} as const;
export default CONSTANTS;
