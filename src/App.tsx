import { useState } from "react";
import TrafficLights from "./components/TrafficLights";
import { Chat } from "./components/ui/chat";
import type { Message } from "./components/ui/chat-message";
import { OpenAIClient } from "./integration/openai/client";
import { SecretsStorage } from "./integration/storage/secrets";

const apiKey = (await SecretsStorage.get("openai_api_key")) as string;
console.log("apiKey", apiKey);
function App() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [input, setInput] = useState("");

	return (
		<div className="w-full h-full">
			<TrafficLights />
			{/* <form
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					const key = formData.get("apiKey") as string;
					if (key) {
						SecretsStorage.set("openai_api_key", key).finally(() => {
							e.currentTarget.reset();
						});
					}
				}}
			>
				<input
					defaultValue={apiKey}
					type="password"
					name="apiKey"
					placeholder="Enter OpenAI API key"
					className="px-2 py-1 mr-2 border rounded"
				/>
				<button type="submit">Set key</button>
			</form>
			<button
				type="button"
				onClick={async () => {
					const key = (await SecretsStorage.get("openai_api_key")) as string;
				}}
			>
				RUN
			</button> */}
			{/* <div>{message}</div> */}
			<Chat
				append={(message) => {
					console.log("append", message);
					setMessages((prev) => [...prev, message as Message]);
				}}
				messages={messages}
				handleInputChange={(e) => {
					setInput(e.target.value);
				}}
				handleSubmit={async (e) => {
					e?.preventDefault?.();
					setIsGenerating(true);
					const response = await OpenAIClient.streamingWithFunctionCalling(
						apiKey,
						setMessages,
						[
							...messages,
							{ role: "user", content: input, id: crypto.randomUUID() },
						],
						[],
						"gpt-4.1-nano",
					);
					console.log("Response", response);
					setMessages(response);
					setIsGenerating(false);
				}}
				isGenerating={isGenerating}
				input={input}
				setMessages={(msgs) => {
					console.log("setMessages", msgs);
					setMessages(msgs);
				}}
				suggestions={[]}
			/>
		</div>
	);
}

export default App;
