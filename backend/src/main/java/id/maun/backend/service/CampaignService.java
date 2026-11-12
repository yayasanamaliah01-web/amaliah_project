package id.maun.backend.service;

import id.maun.backend.dto.CampaignDto;
import id.maun.backend.exception.ResourceNotFoundException;
import id.maun.backend.model.Campaign;
import id.maun.backend.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CampaignService {

    private final CampaignRepository campaignRepository;

    public List<CampaignDto.CampaignResponse> getAllCampaigns(String category, String status) {
        List<Campaign> list;
        if (category != null && !category.equalsIgnoreCase("Semua") && !category.isBlank()) {
            list = campaignRepository.findByCategoryIgnoreCase(category);
        } else if (status != null && !status.isBlank()) {
            list = campaignRepository.findByStatus(status);
        } else {
            list = campaignRepository.findAll();
        }
        return list.stream().map(this::toResponse).toList();
    }

    public CampaignDto.CampaignResponse getCampaignById(Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Program donasi tidak ditemukan dengan ID: " + id));
        return toResponse(campaign);
    }

    public CampaignDto.CampaignResponse getCampaignBySlug(String slug) {
        Campaign campaign = campaignRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Program donasi tidak ditemukan dengan slug: " + slug));
        return toResponse(campaign);
    }

    @Transactional
    public CampaignDto.CampaignResponse createCampaign(CampaignDto.CreateCampaignRequest request) {
        String slug = request.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = request.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        }

        Campaign campaign = Campaign.builder()
                .title(request.getTitle())
                .slug(slug)
                .category(request.getCategory())
                .targetAmount(request.getTargetAmount())
                .collectedAmount(BigDecimal.ZERO)
                .donorCount(0)
                .remainingDays(request.getRemainingDays() != null ? request.getRemainingDays() : 30)
                .image(request.getImage())
                .description(request.getDescription())
                .isUrgent(Boolean.TRUE.equals(request.getIsUrgent()))
                .isVerified(true)
                .location(request.getLocation() != null ? request.getLocation() : "Semarang")
                .organizer(request.getOrganizer() != null ? request.getOrganizer() : "MAUN Foundation")
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Campaign saved = campaignRepository.save(campaign);
        log.info("Campaign created successfully: {} (ID: {})", saved.getTitle(), saved.getId());
        return toResponse(saved);
    }

    @Transactional
    public CampaignDto.CampaignResponse updateCampaign(Long id, CampaignDto.CreateCampaignRequest request) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Program donasi tidak ditemukan dengan ID: " + id));

        if (request.getTitle() != null) campaign.setTitle(request.getTitle());
        if (request.getCategory() != null) campaign.setCategory(request.getCategory());
        if (request.getTargetAmount() != null) campaign.setTargetAmount(request.getTargetAmount());
        if (request.getRemainingDays() != null) campaign.setRemainingDays(request.getRemainingDays());
        if (request.getImage() != null) campaign.setImage(request.getImage());
        if (request.getDescription() != null) campaign.setDescription(request.getDescription());
        if (request.getIsUrgent() != null) campaign.setIsUrgent(request.getIsUrgent());
        if (request.getLocation() != null) campaign.setLocation(request.getLocation());
        if (request.getOrganizer() != null) campaign.setOrganizer(request.getOrganizer());
        campaign.setUpdatedAt(LocalDateTime.now());

        Campaign updated = campaignRepository.save(campaign);
        log.info("Campaign updated successfully: ID {}", updated.getId());
        return toResponse(updated);
    }

    @Transactional
    public void deleteCampaign(Long id) {
        if (!campaignRepository.existsById(id)) {
            throw new ResourceNotFoundException("Program donasi tidak ditemukan dengan ID: " + id);
        }
        campaignRepository.deleteById(id);
        log.info("Campaign deleted: ID {}", id);
    }

    public CampaignDto.CampaignResponse toResponse(Campaign campaign) {
        double progress = 0.0;
        if (campaign.getTargetAmount() != null && campaign.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
            progress = campaign.getCollectedAmount()
                    .divide(campaign.getTargetAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal(100))
                    .doubleValue();
            progress = Math.min(100.0, Math.round(progress * 10.0) / 10.0);
        }

        return CampaignDto.CampaignResponse.builder()
                .id(campaign.getId())
                .title(campaign.getTitle())
                .slug(campaign.getSlug())
                .category(campaign.getCategory())
                .targetAmount(campaign.getTargetAmount())
                .collectedAmount(campaign.getCollectedAmount())
                .donorCount(campaign.getDonorCount())
                .remainingDays(campaign.getRemainingDays())
                .image(campaign.getImage())
                .description(campaign.getDescription())
                .isUrgent(campaign.getIsUrgent())
                .isVerified(campaign.getIsVerified())
                .location(campaign.getLocation())
                .organizer(campaign.getOrganizer())
                .status(campaign.getStatus())
                .progressPercentage(progress)
                .createdAt(campaign.getCreatedAt())
                .build();
    }
}
