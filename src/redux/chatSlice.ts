import { createSlice } from "@reduxjs/toolkit";
import { ChatMessage, ChatState } from "../interfaces/chatState";
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid';

const initialState: ChatState = {
  messages: [],
};

export const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages(state, { payload }: { payload: ChatMessage }) {
      const newMessage: ChatMessage = {
        author: payload.author,
        createdAt: format(new Date(), 'HH:mm'),
        id: uuidv4(),
        message: payload.message
      }
      state.messages.push(newMessage);
    },
  },
});

export const { setMessages } = slice.actions;

export const selectChat = (state: any): ChatState => state.chat;

export default slice.reducer;
