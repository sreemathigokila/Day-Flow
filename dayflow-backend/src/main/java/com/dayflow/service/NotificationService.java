package com.dayflow.service;

import com.dayflow.entity.Notification;
import com.dayflow.entity.User;
import com.dayflow.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void sendNotification(User recipient, String title, String message, String type) {
        Notification notification = new Notification(recipient, title, message, type);
        notificationRepository.save(notification);
        
        // Simulating Firebase Cloud Messaging (FCM) & Email dispatch log
        System.out.println("[FCM/Email Notification Dispatched] To: " + recipient.getEmail() + " | Title: " + title + " | Content: " + message);
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
