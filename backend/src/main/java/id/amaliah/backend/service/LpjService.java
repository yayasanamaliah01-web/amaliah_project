package id.amaliah.backend.service;

import id.amaliah.backend.dto.LpjDto;
import id.amaliah.backend.exception.ResourceNotFoundException;
import id.amaliah.backend.model.ActivityLog;
import id.amaliah.backend.model.Campaign;
import id.amaliah.backend.model.Lpj;
import id.amaliah.backend.repository.ActivityLogRepository;
import id.amaliah.backend.repository.CampaignRepository;
import id.amaliah.backend.repository.LpjRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class LpjService {

    private final LpjRepository lpjRepository;
    private final CampaignRepository campaignRepository;
    private final ActivityLogRepository activityLogRepository;

    @Transactional
    public LpjDto.LpjResponse createLpj(LpjDto.CreateLpjRequest request, String preparerName) {
        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Program donasi tidak ditemukan dengan ID: " + request.getCampaignId()));

        String lpjNumber = "LPJ-" + LocalDateTime.now().getYear() + "-" + (System.currentTimeMillis() % 100000);

        Lpj lpj = Lpj.builder()
                .lpjNumber(lpjNumber)
                .campaignId(campaign.getId())
                .campaignTitle(campaign.getTitle())
                .disbursementId(request.getDisbursementId())
                .title(request.getTitle())
                .summary(request.getSummary())
                .totalSpent(request.getTotalSpent())
                .remainingFunds(request.getRemainingFunds())
                .beneficiaryCount(request.getBeneficiaryCount())
                .location(request.getLocation())
                .documentationUrls(request.getDocumentationUrls())
                .breakdownItemsJson(request.getBreakdownItemsJson())
                .preparedBy(preparerName != null ? preparerName : request.getPreparedBy())
                .verifiedBy(request.getVerifiedBy() != null ? request.getVerifiedBy() : "Tim Auditor Amaliah")
                .status("PUBLISHED")
                .reportDate(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();

        Lpj saved = lpjRepository.save(lpj);

        // Record Activity Log
        ActivityLog logEntry = ActivityLog.builder()
                .actionType("LPJ_DITERBITKAN")
                .title("LPJ Diterbitkan: " + request.getTitle())
                .description("Laporan pertanggungjawaban penyaluran dana untuk " + campaign.getTitle() + " telah diverifikasi dan dipublikasikan.")
                .amount(request.getTotalSpent())
                .campaignId(campaign.getId())
                .campaignTitle(campaign.getTitle())
                .actorName(saved.getPreparedBy())
                .iconType("file-text")
                .timestamp(LocalDateTime.now())
                .build();
        activityLogRepository.save(logEntry);

        log.info("Published LPJ report {} for campaign {}", lpjNumber, campaign.getTitle());
        return toResponse(saved);
    }

    public List<LpjDto.LpjResponse> getCampaignLpjReports(Long campaignId) {
        return lpjRepository.findByCampaignIdOrderByReportDateDesc(campaignId)
                .stream().map(this::toResponse).toList();
    }

    public List<LpjDto.LpjResponse> getAllPublishedLpj() {
        return lpjRepository.findByStatusOrderByReportDateDesc("PUBLISHED")
                .stream().map(this::toResponse).toList();
    }

    public LpjDto.LpjResponse getLpjById(Long id) {
        Lpj lpj = lpjRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LPJ tidak ditemukan dengan ID: " + id));
        return toResponse(lpj);
    }

    public LpjDto.LpjResponse toResponse(Lpj l) {
        return LpjDto.LpjResponse.builder()
                .id(l.getId())
                .lpjNumber(l.getLpjNumber())
                .campaignId(l.getCampaignId())
                .campaignTitle(l.getCampaignTitle())
                .disbursementId(l.getDisbursementId())
                .title(l.getTitle())
                .summary(l.getSummary())
                .totalSpent(l.getTotalSpent())
                .remainingFunds(l.getRemainingFunds())
                .beneficiaryCount(l.getBeneficiaryCount())
                .location(l.getLocation())
                .documentationUrls(l.getDocumentationUrls())
                .breakdownItemsJson(l.getBreakdownItemsJson())
                .preparedBy(l.getPreparedBy())
                .verifiedBy(l.getVerifiedBy())
                .status(l.getStatus())
                .reportDate(l.getReportDate())
                .createdAt(l.getCreatedAt())
                .build();
    }
}
