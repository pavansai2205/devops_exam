pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                
                git branch: 'master', url: 'https://github.com/pavansai2205/devops_exam.git'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Repository cloned successfully.'

                echo 'Deployment step goes here.'
            }   
        }
    }
}