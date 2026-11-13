package id.amaliah.backend.controller;

import id.amaliah.backend.service.StorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/storage")
@RequiredArgsConstructor
@Tag(name = "Storage & Upload", description = "Endpoints untuk mengunggah dan mengelola berkas media di /opt/amaliah_project/storage")
public class StorageController {

    private final StorageService storageService;

    @Operation(summary = "Upload berkas media (gambar/dokumen)")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "subFolder", required = false) String subFolder) {
        Map<String, Object> response = storageService.store(file, subFolder);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Daftar berkas yang tersimpan di storage")
    @GetMapping("/files")
    public ResponseEntity<List<String>> listFiles() {
        return ResponseEntity.ok(storageService.listFiles());
    }

    @Operation(summary = "Cek info direktori storage aktif")
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getStorageInfo() {
        return ResponseEntity.ok(Map.of(
                "status", "ACTIVE",
                "uploadDirectory", storageService.getRootLocation().toAbsolutePath().toString(),
                "totalFiles", storageService.listFiles().size()
        ));
    }
}

