package org.example.supply_gate_26514.contoller;

import jakarta.validation.Valid;
import org.example.supply_gate_26514.dto.ReviewDto;
import org.example.supply_gate_26514.dto.ReviewResponseDto;
import org.example.supply_gate_26514.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping("/reviews")
    public List<ReviewResponseDto> getAllReviews() {
        return reviewService.retrieveAllReviews();

    }
    @PostMapping("/createReview")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponseDto AddReview(@RequestBody ReviewDto reviewDto) {
        return reviewService.addAReview(reviewDto);
    }
    @PutMapping("/{id}")
    public ReviewResponseDto updateReview(@PathVariable("id") UUID id, @Valid @RequestBody ReviewDto reviewDto) {
        return reviewService.updateAReview(id,reviewDto);
    }
    @DeleteMapping("/deleteReview/{id}")
    public void deleteReview(@PathVariable("id") UUID id) {
        reviewService.deleteAReview(id);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        var errors = new HashMap<String, String>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            var fieldName = ((FieldError) error).getField();
            var errorMsg = error.getDefaultMessage();
            errors.put(fieldName, errorMsg);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

}
