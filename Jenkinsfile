pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
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
    }

    post {
        success {
            echo '✅ Pipeline Succeeded! All tests passed and build artifacts are ready.'
            archiveArtifacts artifacts: 'backend/target/*.jar, frontend/dist/**', fingerprint: true, allowEmptyArchive: true
        }
        failure {
            echo '❌ Pipeline Failed! Please check test logs or build errors above.'
        }
        always {
            cleanWs deleteDirs: false, notFailBuild: true
        }
    }
}

