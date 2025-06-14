import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = await getCurrentWindow();

const TrafficLights = () => {
	return (
		<div className="flex gap-2 py-2 px-2" data-tauri-drag-region>
			<button type="button" className="group" onClick={() => appWindow.close()}>
				<svg
					className="flex-shrink-0 size-3"
					enableBackground="new 0 0 85.4 85.4"
					viewBox="0 0 85.4 85.4"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Close icon</title>
					<g clipRule="evenodd" fillRule="evenodd">
						<path
							d="m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7 19.1 42.7 42.7 42.7z"
							fill="#e24b41"
						/>
						<path
							d="m42.7 81.8c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1 17.5 39.1 39.1 39.1z"
							fill="#ed6a5f"
							className="group-hover:fill-red-600"
						/>
					</g>
				</svg>
			</button>
			<button
				type="button"
				className="group"
				onClick={() => appWindow.minimize()}
			>
				<svg
					className="flex-shrink-0 size-3"
					enableBackground="new 0 0 85.4 85.4"
					viewBox="0 0 85.4 85.4"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Minimize icon</title>
					<g clipRule="evenodd" fillRule="evenodd">
						<path
							d="m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7 19.1 42.7 42.7 42.7z"
							fill="#e1a73e"
						/>
						<path
							d="m42.7 81.8c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1 17.5 39.1 39.1 39.1z"
							fill="#f6be50"
							className="group-hover:fill-yellow-600"
						/>
					</g>
				</svg>
			</button>
			<button
				disabled
				type="button"
				className="group opacity-30"
				onClick={() => {}}
			>
				<svg
					className="flex-shrink-0 size-3"
					enableBackground="new 0 0 85.4 85.4"
					viewBox="0 0 85.4 85.4"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Maximize icon</title>
					<g clipRule="evenodd" fillRule="evenodd">
						<path
							d="m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7 19.1 42.7 42.7 42.7z"
							fill="#2dac2f"
						/>
						<path
							d="m42.7 81.8c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1 17.5 39.1 39.1 39.1z"
							fill="#61c555"
						/>
					</g>
				</svg>
			</button>
		</div>
	);
};

export default TrafficLights;
