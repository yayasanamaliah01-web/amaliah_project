pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    triggers {
        githubPush()
        pollSCM('H/2 * * * *')
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Environment Check') {
            steps {
                echo '=== Running Environment & Tooling Verification ==='
                sh 'java -version || java.exe -version'
                sh 'git --version || git.exe --version'
            }
        }

        stage('Backend Tests (JUnit 5)') {
            steps {
                echo '=== Executing Spring Boot Backend Unit Tests ==='
                dir('backend') {
                    sh 'chmod +x mvnw || true'
                    sh './mvnw test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Frontend Tests (Vitest)') {
            steps {
                echo '=== Executing React Frontend Unit Tests ==='
                dir('frontend') {
                    sh 'npm ci || npm install'
                    sh 'npm test'
                }
            }
        }

        stage('Build Artifacts') {
            parallel {
                stage('Build Backend JAR') {
                    steps {
                        echo '=== Building Backend Executable JAR ==='
                        dir('backend') {
                            sh './mvnw clean package -DskipTests'
                        }
                    }
                }
                stage('Build Frontend Bundle') {
                    steps {
                        echo '=== Building Production Frontend Vite Assets ==='
                        dir('frontend') {
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                echo '=== Deploying Tested Version to Docker Containers on VPS ==='
                sh '''
                    docker run --rm --privileged --pid=host alpine nsenter -t 1 -m -u -n -i bash -c "
                        set -e
                        echo '1. Updating local working copy...'
                        cd /opt/amaliah_project/app
                        git restore .
                        git pull origin main

                        echo '2. Ensuring conflicting native host services are stopped...'
                        systemctl stop amaliah-backend 2>/dev/null || true
                        systemctl disable amaliah-backend 2>/dev/null || true
                        systemctl stop postgresql 2>/dev/null || true
                        systemctl disable postgresql 2>/dev/null || true

                        echo '3. Building and spinning up Docker containers...'
                        docker compose up -d --build postgres backend frontend

                        echo '4. Syncing frontend static distribution assets...'
                        mkdir -p /opt/amaliah_project/app/frontend/dist
                        docker cp amaliah-frontend:/usr/share/nginx/html/. /opt/amaliah_project/app/frontend/dist/ 2>/dev/null || true
                        chmod -R 755 /opt/amaliah_project/app/frontend/dist

                        echo '5. Reloading host Nginx...'
                        systemctl reload nginx

                        echo '=== Automatic Deployment to Docker Containers Succeeded! ==='
                    "
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline Succeeded! All tests passed and code deployed to production.'
            archiveArtifacts artifacts: 'backend/target/*.jar, frontend/dist/**', fingerprint: true, allowEmptyArchive: true
        }
        failure {
            echo '❌ Pipeline Failed! Please check test logs or build errors above.'
        }
        cleanup {
            cleanWs deleteDirs: false, notFailBuild: true
        }
    }
}
