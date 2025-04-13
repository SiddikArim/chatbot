// lib/langchain.ts
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// 1. Chat model: local Ollama with Mistral
const model = new ChatOllama({
  baseUrl: "http://localhost:11434", // your running ollama instance
  model: "mistral", // or mistral:instruct if specified
});

// 2. Prompt Template
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant who responds based on the business data provided.",
  ],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

// 3. Combine into a chain
export const chain = RunnableSequence.from([
  prompt,
  model,
  new StringOutputParser(),
]);

//
