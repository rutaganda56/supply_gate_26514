package org.example.supply_gate_26514.service;

import org.example.supply_gate_26514.dto.DashboardStatsDto;
import org.example.supply_gate_26514.model.User;
import org.example.supply_gate_26514.model.UserEnum;
import org.example.supply_gate_26514.repository.MessageRepository;
import org.example.supply_gate_26514.repository.NotificationRepository;
import org.example.supply_gate_26514.repository.ProductRepository;
import org.example.supply_gate_26514.repository.ReviewRepository;
import org.example.supply_gate_26514.repository.StoreRepository;
import org.example.supply_gate_26514.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DashboardService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    public DashboardStatsDto getSupplierDashboardStats(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Calculate real stats from database
        
        // Total Followers: Count of unique message senders (people who contacted the supplier)
        long totalFollowers = messageRepository.findBySupplier_UserIdOrderByCreatedAtDesc(userId, 
                org.springframework.data.domain.Pageable.unpaged())
                .stream()
                .map(m -> m.getSenderEmail().toLowerCase())
                .distinct()
                .count();
        
        // Total Customers: Same as followers (unique message senders)
        long totalCustomers = totalFollowers;
        
        // Total Impressions: Count of products owned by this supplier
        long totalImpressions = productRepository.countByStore_User_UserId(userId);
        
        // Total Notifications: Unread notifications count
        long totalNotifications = notificationRepository.countByUser_UserIdAndIsReadFalse(userId);

        // Calculate changes (for now, set to 0 as we don't have historical data)
        // In production, you could compare with previous period
        double followersChange = 0.0;
        double customersChange = 0.0;
        double impressionsChange = 0.0;
        double notificationsChange = 0.0;

        return new DashboardStatsDto(
                totalFollowers,
                totalCustomers,
                totalImpressions,
                totalNotifications,
                followersChange,
                customersChange,
                impressionsChange,
                notificationsChange
        );
    }

    public DashboardStatsDto getIndustryDashboardStats() {
        // For industry workers, show verification-related stats
        long pendingVerifications = 0; // Will be calculated in controller
        long approvedVerifications = 0;
        long rejectedVerifications = 0;
        long totalNotifications = 0;

        return new DashboardStatsDto(
                pendingVerifications,
                approvedVerifications,
                rejectedVerifications,
                totalNotifications,
                0, 0, 0, 0
        );
    }
}

