pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage("Environment Setup") {
            steps {
               script {
                    withCredentials([file(credentialsId: 'ENV_PRODUCTION_CALM_SLEEP', variable: 'ENV_FILE_CALM')]) {
                        // Ensure the .env file exists and has the correct permissions
                        sh 'touch .env.production'
                        sh 'chown jenkins:jenkins .env.production'
                        sh 'chmod 664 .env.production'

                        // Copy the entire .env file instead of echoing a single variable
                        sh 'cp $ENV_FILE_CALM .env.production'
                    }
               }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t calm-api:${BUILD_NUMBER} -t calm-api:latest .'
            }
        }
        
        stage('Deploy') {
            steps {
               sh 'docker stop calm-api || true'
               sh 'docker rm calm-api || true'
               sh 'docker run -d --name calm-api -p 6969:6969 calm-api:latest'
            }
        }
    }

    post {
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}
