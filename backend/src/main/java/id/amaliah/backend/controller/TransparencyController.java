package id.amaliah.backend.controller;

import id.amaliah.backend.dto.TransparencyDto;
import id.amaliah.backend.service.TransparencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller publik transparansi real-time untuk audit donasi, mutasi bank live, pencairan & LPJ
 */
@RestController
@RequestMapping("/api/v1/transparency")
@RequiredArgsConstructor
public class TransparencyController {

    private final TransparencyService transparencyService;

    @GetMapping("/summary")
    public ResponseEntity<TransparencyDto.PublicSummary> getPublicSummary() {
        return ResponseEntity.ok(transparencyService.getPublicSummary());
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<TransparencyDto.CampaignTransparencyDetail> getCampaignTransparency(
            @PathVariable Long campaignId) {
        return ResponseEntity.ok(transparencyService.getCampaignTransparency(campaignId));
    }

    @GetMapping("/activities")
    public ResponseEntity<List<TransparencyDto.ActivityLogDto>> getRecentActivities() {
        return ResponseEntity.ok(transparencyService.getRecentActivities());
    }

    @GetMapping("/mutations")
    public ResponseEntity<List<TransparencyDto.BankMutationDto>> getRecentMutations() {
        return ResponseEntity.ok(transparencyService.getRecentBankMutations());
    }
}
