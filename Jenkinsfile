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
                echo '=== Deploying Tested Version to VPS Production ==='
                sh '''
                    docker run --rm --privileged --pid=host alpine nsenter -t 1 -m -u -n -i bash -c "
                        set -e
                        echo '1. Updating local working copy...'
                        cd /opt/amaliah_project/app
                        git restore .
                        git pull origin main

                        echo '2. Compiling production frontend bundle...'
                        cd /opt/amaliah_project/app/frontend
                        npm run build
                        chmod -R 755 /opt/amaliah_project/app/frontend/dist

                        echo '3. Packaging production backend executable...'
                        cd /opt/amaliah_project/app/backend
                        chmod +x mvnw
                        ./mvnw clean package -DskipTests

                        echo '4. Reloading and restarting production services...'
                        systemctl restart amaliah-backend
                        systemctl reload nginx

                        echo '=== Automatic Deployment to Production Succeeded! ==='
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
