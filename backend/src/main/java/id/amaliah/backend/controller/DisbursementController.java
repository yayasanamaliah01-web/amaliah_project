package id.amaliah.backend.controller;

import id.amaliah.backend.dto.DisbursementDto;
import id.amaliah.backend.service.DisbursementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/disbursements")
@RequiredArgsConstructor
public class DisbursementController {

    private final DisbursementService disbursementService;

    @GetMapping
    public ResponseEntity<List<DisbursementDto.DisbursementResponse>> getAllDisbursements() {
        return ResponseEntity.ok(disbursementService.getAllDisbursements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisbursementDto.DisbursementResponse> getDisbursementById(@PathVariable Long id) {
        return ResponseEntity.ok(disbursementService.getDisbursementById(id));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<DisbursementDto.DisbursementResponse>> getCampaignDisbursements(@PathVariable Long campaignId) {
        return ResponseEntity.ok(disbursementService.getCampaignDisbursements(campaignId));
    }

    @PostMapping
    public ResponseEntity<DisbursementDto.DisbursementResponse> createDisbursement(
            @Valid @RequestBody DisbursementDto.CreateDisbursementRequest request,
            Authentication authentication) {
        String approver = (authentication != null) ? authentication.getName() : "Bendahara Amaliah";
        return ResponseEntity.ok(disbursementService.createDisbursement(request, approver));
    }
}
