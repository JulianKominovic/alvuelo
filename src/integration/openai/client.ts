import type { Message } from "@/components/ui/chat-message";
import OpenAI from "openai";
import type {
	ChatCompletionAssistantMessageParam,
	ChatCompletionChunk,
	ChatCompletionMessage,
	ChatCompletionMessageParam,
	ChatCompletionTool,
} from "openai/resources/chat/index.mjs";
import CONSTANTS from "../../constants";

// async function streamingWithFunctionCalling(
// 	key: string,
// 	onChunk: (chunk: string) => Promise<void>,
// 	messages: ChatCompletionMessageParam[],
// 	tools: (ChatCompletionTool & {
// 		fn: (args: unknown) => string | Promise<string>;
// 	})[],
// 	model = CONSTANTS.OPENAI_CHEAP_MODEL,
// 	functionCallsLimit = 3,
// ) {
// 	const openai = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });

// 	async function callFunction(
// 		function_call: ChatCompletionMessage.FunctionCall,
// 	): Promise<string> {
// 		const args = JSON.parse(function_call.arguments || "{}");
// 		const tool = tools.find((f) => f.function.name === function_call.name);
// 		if (!tool) {
// 			throw new Error(`No function found: ${function_call.name}`);
// 		}
// 		return await tool.fn(args);
// 	}

// 	function messageReducer(
// 		previous: ChatCompletionMessage,
// 		item: ChatCompletionChunk,
// 	): ChatCompletionMessage {
// 		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// 		const reduce = (acc: any, delta: any) => {
// 			// biome-ignore lint/style/noParameterAssign: <explanation>
// 			acc = { ...acc };
// 			for (const [key, value] of Object.entries(delta)) {
// 				if (acc[key] === undefined || acc[key] === null) {
// 					acc[key] = value;
// 				} else if (typeof acc[key] === "string" && typeof value === "string") {
// 					(acc[key] as string) += value;
// 				} else if (typeof acc[key] === "object" && !Array.isArray(acc[key])) {
// 					acc[key] = reduce(acc[key], value);
// 				}
// 			}
// 			return acc;
// 		};

// 		return reduce(previous, item.choices[0]?.delta) as ChatCompletionMessage;
// 	}

// 	console.log(messages[0]);
// 	console.log(messages[1]);
// 	console.log();

// 	let functionCallsNumber = 0;

// 	while (functionCallsNumber < functionCallsLimit) {
// 		const stream = await openai.chat.completions.create({
// 			model,
// 			messages,
// 			tools,
// 			stream: true,
// 		});

// 		let message = {} as ChatCompletionMessage;
// 		for await (const chunk of stream) {
// 			message = messageReducer(message, chunk);
// 			if (message.content) await onChunk(message.content);
// 		}
// 		messages.push(message);

// 		// If there is no function call, we're done and can exit this loop
// 		const toolCall = message.tool_calls?.[0];
// 		if (!toolCall) {
// 			return;
// 		}
// 		console.log("function call", toolCall);
// 		// If there is a function call, we generate a new message with the role 'function'.
// 		const result = await callFunction(toolCall.function);
// 		const newMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
// 			role: "tool" as const,
// 			tool_call_id: toolCall.id,
// 			content: result,
// 		};
// 		messages.push(newMessage);

// 		console.log(newMessage);
// 		console.log();
// 		functionCallsNumber++;
// 	}
// 	return messages;
// }

async function streamingWithFunctionCalling(
	key: string,
	onMessagesUpdate: (uiMsgs: Message[]) => Promise<void> | void,
	uiMessages: Message[],
	tools: (ChatCompletionTool & {
		fn: (args: unknown) => string | Promise<string>;
	})[],
	model = CONSTANTS.OPENAI_CHEAP_MODEL,
	functionCallsLimit = 3,
): Promise<Message[]> {
	const messages: ChatCompletionMessageParam[] = uiMessages.flatMap((m) => {
		if (m.role === "user") {
			return {
				role: "user",
				content: m.content,
			};
		}
		return {
			role: "assistant",
			content: m.content,
			tool_calls: m.toolInvocations?.map((t) => {
				return {
					id: crypto.randomUUID(),
					function: {
						name: t.toolName,
					},
				};
			}),
		} as ChatCompletionAssistantMessageParam;
	});

	const openai = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });

	async function callFunction(
		function_call: ChatCompletionMessage.FunctionCall,
	): Promise<string> {
		const args = JSON.parse(function_call.arguments || "{}");
		const tool = tools.find((f) => f.function.name === function_call.name);
		if (!tool) {
			throw new Error(`No function found: ${function_call.name}`);
		}
		return await tool.fn(args);
	}

	function messageReducer(
		previous: ChatCompletionMessage,
		item: ChatCompletionChunk,
	): ChatCompletionMessage {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const reduce = (acc: any, delta: any) => {
			// biome-ignore lint/style/noParameterAssign: <explanation>
			acc = { ...acc };
			for (const [key, value] of Object.entries(delta)) {
				if (acc[key] === undefined || acc[key] === null) {
					acc[key] = value;
				} else if (typeof acc[key] === "string" && typeof value === "string") {
					(acc[key] as string) += value;
				} else if (typeof acc[key] === "object" && !Array.isArray(acc[key])) {
					acc[key] = reduce(acc[key], value);
				}
			}
			return acc;
		};

		return reduce(previous, item.choices[0]?.delta) as ChatCompletionMessage;
	}

	console.log(messages[0]);
	console.log(messages[1]);
	console.log();

	let functionCallsNumber = 0;

	while (functionCallsNumber < functionCallsLimit) {
		const stream = await openai.chat.completions.create({
			model,
			messages,
			tools,
			stream: true,
		});

		let message = {} as ChatCompletionMessage;
		let uiMsg = {} as Message;
		for await (const chunk of stream) {
			message = messageReducer(message, chunk);
			uiMsg = {
				...uiMsg,
				content: message.content || "",
			};
		}
		uiMessages.push(uiMsg);
		messages.push(message);
		await onMessagesUpdate?.(uiMessages);

		// If there is no function call, we're done and can exit this loop
		const toolCall = message.tool_calls?.[0];
		if (!toolCall) {
			return uiMessages;
		}
		console.log("function call", toolCall);
		// If there is a function call, we generate a new message with the role 'function'.
		const result = await callFunction(toolCall.function);
		const newMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
			role: "tool" as const,
			tool_call_id: toolCall.id,
			content: result,
		};
		uiMessages[uiMessages.length - 1] = {
			...uiMessages[uiMessages.length - 1],
			content: uiMessages[uiMessages.length - 1].content + result,
			toolInvocations: [
				{
					state: "call",
					toolName: toolCall.function.name,
				},
			],
		};
		messages.push(newMessage);
		await onMessagesUpdate?.(uiMessages);

		console.log(newMessage);
		console.log();
		functionCallsNumber++;
	}
	return uiMessages;
}

export const OpenAIClient = {
	streamingWithFunctionCalling,
};
