# ==========================================
# Stage 1: Build JAR with Maven & JDK 21
# ==========================================
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /workspace

# Copy pom.xml to cache dependencies
COPY pom.xml ./
RUN mvn dependency:resolve -B || true

# Copy source code and build production package
COPY src/ src/
RUN mvn clean package -DskipTests -B

# ==========================================
# Stage 2: Lightweight JRE 21 Runtime
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add non-root application user
RUN addgroup -S amaliah && adduser -S amaliah -G amaliah

# Create storage upload directory and log directory
RUN mkdir -p /opt/amaliah_project/storage/uploads /app/logs \
    && chown -R amaliah:amaliah /opt/amaliah_project /app

# Copy executable jar from builder stage
COPY --from=builder /workspace/target/*.jar app.jar
RUN chown amaliah:amaliah app.jar

USER amaliah

EXPOSE 8081

# JVM memory management tailored for efficiency
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
