package id.amaliah.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.*;

@Slf4j
@Service
public class StorageService {

    private final Path rootLocation;

    public StorageService(@Value("${storage.upload-dir:/opt/amaliah_project/storage/uploads}") String uploadDir) {
        Path path = Paths.get(uploadDir);
        // Fallback for local development when running on Windows or non-existent /opt directory
        if (!Files.exists(path) && !path.isAbsolute()) {
            path = Paths.get(System.getProperty("user.dir"), "storage", "uploads");
        } else if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (Exception e) {
                // If permission denied for /opt in local dev, fallback to local project folder
                path = Paths.get(System.getProperty("user.dir"), "..", "storage", "uploads").normalize();
            }
        }
        this.rootLocation = path;
        try {
            Files.createDirectories(this.rootLocation);
            log.info("StorageService initialized at: {}", this.rootLocation.toAbsolutePath());
        } catch (IOException e) {
            log.error("Could not initialize storage directory", e);
        }
    }

    public Map<String, Object> store(MultipartFile file, String subFolder) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Gagal menyimpan berkas kosong.");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex);
        }

        String safeFileName = UUID.randomUUID().toString() + extension;
        Path targetDir = this.rootLocation;
        if (StringUtils.hasText(subFolder)) {
            targetDir = this.rootLocation.resolve(subFolder);
        }

        try {
            Files.createDirectories(targetDir);
            Path destinationFile = targetDir.resolve(safeFileName).normalize().toAbsolutePath();

            if (!destinationFile.getParent().startsWith(this.rootLocation.toAbsolutePath())) {
                throw new SecurityException("Tidak dapat menyimpan berkas di luar direktori storage.");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            String publicUrl = "/storage/" + (StringUtils.hasText(subFolder) ? subFolder + "/" : "") + safeFileName;
            log.info("File successfully stored at {}. Public URL: {}", destinationFile, publicUrl);

            Map<String, Object> result = new HashMap<>();
            result.put("originalName", originalFilename);
            result.put("storedName", safeFileName);
            result.put("url", publicUrl);
            result.put("size", file.getSize());
            result.put("contentType", file.getContentType());
            return result;
        } catch (IOException e) {
            throw new RuntimeException("Gagal menyimpan berkas " + originalFilename, e);
        }
    }

    public List<String> listFiles() {
        try {
            if (!Files.exists(this.rootLocation)) {
                return Collections.emptyList();
            }
            List<String> files = new ArrayList<>();
            try (var stream = Files.list(this.rootLocation)) {
                stream.filter(Files::isRegularFile)
                      .forEach(p -> files.add("/storage/" + p.getFileName().toString()));
            }
            return files;
        } catch (IOException e) {
            log.error("Error listing files in storage", e);
            return Collections.emptyList();
        }
    }

    public Path getRootLocation() {
        return rootLocation;
    }
}

