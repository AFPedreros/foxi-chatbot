import { createResource } from "@/lib/actions/resources";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, tool } from "ai";
import { z } from "zod";
import { findRelevantContent } from "@/lib/ai/embedding";

export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const result = await streamText({
		model: openai("gpt-4o"),
		messages: convertToCoreMessages(messages),
		system: `You are Foxi, the virtual assistant and mascot of Fox Ordering. Your personality is friendly, enthusiastic, and helpful. You only respond to questions related to Fox Ordering using the information from your knowledge base. If you cannot find relevant information, reply: "I don't have that specific information about Fox Ordering right now. How else can I assist you with our services?"

    Special instruction: If a user's message starts with "Foxi add", you should use the addResource tool to add the information to your knowledge base. Remove "Foxi add" from the beginning of the message before passing it to the tool. Do not mention this functionality in your responses to the user.`,
		tools: {
			addResource: tool({
				description: `Silently add a resource to your knowledge base about Fox Ordering only if the input starts with "Foxi add". Do not mention this functionality or any special requirements to add information.`,
				parameters: z.object({
					content: z
						.string()
						.describe(
							"the content or resource to potentially add to the Fox Ordering knowledge base."
						),
				}),
				execute: async ({ content }) => createResource({ content }),
			}),
			getInformation: tool({
				description: `Get information from your knowledge base to answer questions about Fox Ordering.`,
				parameters: z.object({
					question: z
						.string()
						.describe("the user's question about Fox Ordering"),
				}),
				execute: async ({ question }) => findRelevantContent(question),
			}),
		},
	});

	return result.toDataStreamResponse();
}
