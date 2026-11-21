package id.amaliah.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Object;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.*;
import java.util.*;

@Slf4j
@Service
public class StorageService {

    private final Path rootLocation;
    private final String storageProvider;
    private final String s3Endpoint;
    private final String s3AccessKey;
    private final String s3SecretKey;
    private final String s3Bucket;
    private final String s3Region;
    private final String s3PublicUrlPrefix;

    private S3Client s3Client;
    private boolean isS3Active = false;

    public StorageService(
            @Value("${storage.upload-dir:/opt/amaliah_project/storage/uploads}") String uploadDir,
            @Value("${storage.provider:local}") String storageProvider,
            @Value("${storage.s3.endpoint:http://localhost:3900}") String s3Endpoint,
            @Value("${storage.s3.access-key:}") String s3AccessKey,
            @Value("${storage.s3.secret-key:}") String s3SecretKey,
            @Value("${storage.s3.bucket:amaliah-uploads}") String s3Bucket,
            @Value("${storage.s3.region:garage}") String s3Region,
            @Value("${storage.s3.public-url-prefix:/storage/}") String s3PublicUrlPrefix) {

        this.storageProvider = storageProvider;
        this.s3Endpoint = s3Endpoint;
        this.s3AccessKey = s3AccessKey;
        this.s3SecretKey = s3SecretKey;
        this.s3Bucket = s3Bucket;
        this.s3Region = s3Region;
        this.s3PublicUrlPrefix = s3PublicUrlPrefix;

        // Local storage directory initialization (fallback or local mode)
        Path path = Paths.get(uploadDir);
        if (!Files.exists(path) && !path.isAbsolute()) {
            path = Paths.get(System.getProperty("user.dir"), "storage", "uploads");
        } else if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (Exception e) {
                path = Paths.get(System.getProperty("user.dir"), "..", "storage", "uploads").normalize();
            }
        }
        this.rootLocation = path;
        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException ignored) {}

        // Initialize S3 / Garage client if configured
        if ("s3".equalsIgnoreCase(storageProvider) && StringUtils.hasText(s3AccessKey) && StringUtils.hasText(s3SecretKey)) {
            try {
                this.s3Client = S3Client.builder()
                        .endpointOverride(URI.create(s3Endpoint))
                        .credentialsProvider(StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(s3AccessKey, s3SecretKey)))
                        .region(Region.of(StringUtils.hasText(s3Region) ? s3Region : "garage"))
                        .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build())
                        .build();
                this.isS3Active = true;
                log.info("StorageService S3/Garage active. Endpoint: {}, Bucket: {}", s3Endpoint, s3Bucket);
            } catch (Exception e) {
                log.error("Failed to initialize S3/Garage client, falling back to local filesystem: {}", e.getMessage());
                this.isS3Active = false;
            }
        } else {
            log.info("StorageService initialized with LOCAL filesystem storage at: {}", this.rootLocation.toAbsolutePath());
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
        String relativeKey = StringUtils.hasText(subFolder) ? (subFolder.trim() + "/" + safeFileName) : safeFileName;

        if (isS3Active && s3Client != null) {
            try {
                PutObjectRequest putReq = PutObjectRequest.builder()
                        .bucket(s3Bucket)
                        .key(relativeKey)
                        .contentType(file.getContentType())
                        .build();

                s3Client.putObject(putReq, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
                String publicUrl = (s3PublicUrlPrefix.endsWith("/") ? s3PublicUrlPrefix : s3PublicUrlPrefix + "/") + relativeKey;
                log.info("File successfully uploaded to S3/Garage [{}/{}]. Public URL: {}", s3Bucket, relativeKey, publicUrl);

                Map<String, Object> result = new HashMap<>();
                result.put("originalName", originalFilename);
                result.put("storedName", safeFileName);
                result.put("url", publicUrl);
                result.put("size", file.getSize());
                result.put("contentType", file.getContentType());
                result.put("provider", "s3-garage");
                return result;
            } catch (Exception e) {
                log.error("Failed to upload to S3/Garage, falling back to local file storage: {}", e.getMessage());
            }
        }

        // Local storage execution
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

            String publicUrl = "/storage/" + relativeKey;
            log.info("File successfully stored locally at {}. Public URL: {}", destinationFile, publicUrl);

            Map<String, Object> result = new HashMap<>();
            result.put("originalName", originalFilename);
            result.put("storedName", safeFileName);
            result.put("url", publicUrl);
            result.put("size", file.getSize());
            result.put("contentType", file.getContentType());
            result.put("provider", "local");
            return result;
        } catch (IOException e) {
            throw new RuntimeException("Gagal menyimpan berkas " + originalFilename, e);
        }
    }

    public List<String> listFiles() {
        if (isS3Active && s3Client != null) {
            try {
                ListObjectsV2Request listReq = ListObjectsV2Request.builder()
                        .bucket(s3Bucket)
                        .build();
                ListObjectsV2Response listRes = s3Client.listObjectsV2(listReq);
                List<String> files = new ArrayList<>();
                for (S3Object s3Obj : listRes.contents()) {
                    String prefix = s3PublicUrlPrefix.endsWith("/") ? s3PublicUrlPrefix : s3PublicUrlPrefix + "/";
                    files.add(prefix + s3Obj.key());
                }
                return files;
            } catch (Exception e) {
                log.error("Failed to list files from S3/Garage: {}", e.getMessage());
            }
        }

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
            log.error("Error listing files in local storage", e);
            return Collections.emptyList();
        }
    }

    public Path getRootLocation() {
        return rootLocation;
    }

    public boolean isS3Active() {
        return isS3Active;
    }
}
