export interface ChatState {
  messages: ChatMessage[];
}

export interface ChatMessage {
  id?: string,
  author: string,
  message: string,
  createdAt?: string | Date;
}