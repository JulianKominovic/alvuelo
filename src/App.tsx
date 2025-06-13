import { useState } from "react";
import { SecretsStorage } from "./integration/storage/secrets";

const apiKey = (await SecretsStorage.get("openai_api_key")) as string;
function App() {
	const [message, setMessage] = useState("");
	return (
		<div>
			<form
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
			</button>
			<div>{message}</div>
		</div>
	);
}

export default App;
