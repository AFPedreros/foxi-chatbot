"use client";

import { useChat } from "ai/react";

export default function Chat() {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		maxSteps: 3,
	});
	return (
		<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
			<div className="space-y-4">
				{messages.map((m) => (
					<div key={m.id} className="whitespace-pre-wrap">
						<div className="flex gap-2">
							<div className="font-bold">
								{m.role === "assistant" ? "🦊" : "You"}:
							</div>
							<p>
								{m.content.length > 0 ? (
									m.content
								) : (
									<span className="italic font-light">
										{"calling tool: " + m?.toolInvocations?.[0].toolName}
									</span>
								)}
							</p>
						</div>
					</div>
				))}
			</div>

			<form onSubmit={handleSubmit}>
				<input
					className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
					value={input}
					placeholder="Say something to Foxi..."
					onChange={handleInputChange}
				/>
			</form>
		</div>
	);
}
