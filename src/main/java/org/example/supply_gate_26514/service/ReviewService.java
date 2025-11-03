package org.example.supply_gate_26514.service;

import org.example.supply_gate_26514.dto.ReviewDto;
import org.example.supply_gate_26514.dto.ReviewResponseDto;
import org.example.supply_gate_26514.mapper.ReviewMapper;
import org.example.supply_gate_26514.model.Product;
import org.example.supply_gate_26514.model.Review;
import org.example.supply_gate_26514.model.User;
import org.example.supply_gate_26514.repository.ProductRepository;
import org.example.supply_gate_26514.repository.ReviewRepository;
import org.example.supply_gate_26514.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewMapper reviewMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    public List<ReviewResponseDto> retrieveAllReviews() {
        return reviewRepository.findAll().stream().map(reviewMapper::transformToReviewResponseDto).collect(Collectors.toList());
    }
    public ReviewResponseDto addAReview(ReviewDto reviewDto) {
        var review=reviewMapper.transformToReviewDto(reviewDto);
        var savedReview= reviewRepository.save(review);
        return reviewMapper.transformToReviewResponseDto(savedReview);
    }
    public ReviewResponseDto updateAReview(UUID id, ReviewDto reviewDto) {
        var existingReview=reviewRepository.findById(id).orElse(new Review());
        existingReview.setMessage(reviewDto.message());
        var newUser= userRepository.findById(reviewDto.userId()).orElse(new User());
        existingReview.setUser(newUser);
        var newProduct=productRepository.findById(reviewDto.productId()).orElse(new Product());
        existingReview.setProduct(newProduct);
        var updatedReview= reviewRepository.save(existingReview);
        return reviewMapper.transformToReviewResponseDto(reviewRepository.save(updatedReview));

    }
    public String deleteAReview(UUID id) {
        reviewRepository.deleteById(id);
        return "Review deleted successfully";
    }
}
