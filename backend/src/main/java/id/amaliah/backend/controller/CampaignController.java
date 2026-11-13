package id.amaliah.backend.controller;

import id.amaliah.backend.dto.CampaignDto;
import id.amaliah.backend.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    public ResponseEntity<List<CampaignDto.CampaignResponse>> getAllCampaigns(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(campaignService.getAllCampaigns(category, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignDto.CampaignResponse> getCampaignById(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getCampaignById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<CampaignDto.CampaignResponse> getCampaignBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(campaignService.getCampaignBySlug(slug));
    }

    @PostMapping
    public ResponseEntity<CampaignDto.CampaignResponse> createCampaign(@Valid @RequestBody CampaignDto.CreateCampaignRequest request) {
        return ResponseEntity.ok(campaignService.createCampaign(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampaignDto.CampaignResponse> updateCampaign(
            @PathVariable Long id,
            @Valid @RequestBody CampaignDto.CreateCampaignRequest request) {
        return ResponseEntity.ok(campaignService.updateCampaign(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok().build();
    }
}
