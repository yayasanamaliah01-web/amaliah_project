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
                echo '=== Deploying Updated Backend and Frontend to VPS Host ==='
                sh '''
                    # 1. Salin JAR baru ke direktori produksi host
                    docker run --rm -v /opt/amaliah_project/app/backend/target:/host_target -v $(pwd)/backend/target:/workspace_target alpine sh -c "mkdir -p /host_target && cp /workspace_target/amaliah-backend-*.jar /host_target/"

                    # 2. Salin bundle frontend dist baru ke direktori produksi host
                    docker run --rm -v /opt/amaliah_project/app/frontend/dist:/host_dist -v $(pwd)/frontend/dist:/workspace_dist alpine sh -c "mkdir -p /host_dist && cp -r /workspace_dist/* /host_dist/"

                    # 3. Restart backend service & reload Nginx di host
                    docker run --rm --privileged --pid=host alpine nsenter -t 1 -m -u -n -i systemctl restart amaliah-backend
                    docker run --rm --privileged --pid=host alpine nsenter -t 1 -m -u -n -i systemctl reload nginx

                    echo "Deployment to Production completed successfully!"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline Succeeded! All tests passed and build artifacts are deployed.'
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
