pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                
                git branch: 'master', url: ''
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