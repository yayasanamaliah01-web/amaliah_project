package id.amaliah.backend.controller;

import id.amaliah.backend.dto.DonationDto;
import id.amaliah.backend.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    public ResponseEntity<DonationDto.DonationResponse> createDonation(@Valid @RequestBody DonationDto.CreateDonationRequest request) {
        return ResponseEntity.ok(donationService.createDonation(request));
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<DonationDto.DonationResponse> getDonation(@PathVariable String transactionId) {
        return ResponseEntity.ok(donationService.getDonation(transactionId));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<DonationDto.DonationResponse>> getCampaignDonations(@PathVariable Long campaignId) {
        return ResponseEntity.ok(donationService.getCampaignDonations(campaignId));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<DonationDto.DonationResponse>> getRecentDonations() {
        return ResponseEntity.ok(donationService.getRecentSuccessfulDonations());
    }
}
