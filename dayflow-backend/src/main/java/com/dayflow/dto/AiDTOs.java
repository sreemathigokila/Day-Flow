package com.dayflow.dto;

public class AiDTOs {

    public static class AiChatRequest {
        private String prompt;

        public String getPrompt() { return prompt; }
        public void setPrompt(String prompt) { this.prompt = prompt; }
    }

    public static class AiChatResponse {
        private String response;
        private String source;
        private boolean success;

        public AiChatResponse(String response, String source, boolean success) {
            this.response = response;
            this.source = source;
            this.success = success;
        }

        public String getResponse() { return response; }
        public String getSource() { return source; }
        public boolean isSuccess() { return success; }
    }
}
