import { createSlice } from '@reduxjs/toolkit';

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    messages: [
      {
        id: 1,
        sender: 'ai',
        text: 'Hello! I am your personal Dayflow AI HR Assistant. You can ask me about your leave balance, recent attendance, salary breakdown, or company HR policies.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
    loading: false,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { addMessage, setLoading } = aiSlice.actions;
export default aiSlice.reducer;
