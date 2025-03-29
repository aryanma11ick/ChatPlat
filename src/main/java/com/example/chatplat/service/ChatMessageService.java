package com.example.chatplat.service;

import com.example.chatplat.model.ChatMessage;
import com.example.chatplat.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;

    public ChatMessageService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    public List<ChatMessage> getChatHistory(String sender, String receiver) {
        return chatMessageRepository.findBySenderAndReceiver(sender, receiver);
    }

    public void saveMessage(ChatMessage message) {
        chatMessageRepository.save(message);
    }
}
