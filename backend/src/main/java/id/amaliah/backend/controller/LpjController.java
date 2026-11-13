package id.amaliah.backend.controller;

import id.amaliah.backend.dto.LpjDto;
import id.amaliah.backend.service.LpjService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lpj")
@RequiredArgsConstructor
public class LpjController {

    private final LpjService lpjService;

    @GetMapping
    public ResponseEntity<List<LpjDto.LpjResponse>> getAllPublishedLpj() {
        return ResponseEntity.ok(lpjService.getAllPublishedLpj());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LpjDto.LpjResponse> getLpjById(@PathVariable Long id) {
        return ResponseEntity.ok(lpjService.getLpjById(id));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<LpjDto.LpjResponse>> getCampaignLpjReports(@PathVariable Long campaignId) {
        return ResponseEntity.ok(lpjService.getCampaignLpjReports(campaignId));
    }

    @PostMapping
    public ResponseEntity<LpjDto.LpjResponse> createLpj(
            @Valid @RequestBody LpjDto.CreateLpjRequest request,
            Authentication authentication) {
        String preparer = (authentication != null) ? authentication.getName() : request.getPreparedBy();
        return ResponseEntity.ok(lpjService.createLpj(request, preparer));
    }
}
