## CIS 422 Project 2 - Math Culture 

#### Building and Running the web app (Development):

1. Install Docker Desktop for Mac or Windows, or Docker (and Docker Compose) for linux:
    - https://docs.docker.com/get-docker/
    - https://docs.docker.com/compose/install/ (Linux only)
2. Run Docker Desktop (Mac and Windows) or the Docker daemon (Linux) in the background
3. Build and run the application stack using docker-compose:

    - If you are on macOS or Linux, enter the following commands into your terminal:

        1. docker-compose build
        2. docker-compose up -d 

        - Note: (As an alternative to these commands, you can run the bash script `run.sh`)

    - If you are on Windows, enter the following commands into Microsoft PowerShell: 
    
        1. docker-compose build
        2. docker-compose up -d 

4. Visit `localhost:5000` in your web browser to view the web app

##### Software dependencies? Required versions of components?

- Requirement: The latest release of Docker
    - Docker handles all dependencies needed to build and run the web app

#### Testing the handwriting classifier:

    docker exec -it project2_flaskwebservice_1 bash -c "python3 classifier/main.py"    

#### Accessing the web app (Production)

    //TODO

#### (DEVELOPMENT) Neural Network Training and Testing (Google Colab)

- For now, the code that trains the neural network will not be in the Github repository.
- Instead, it is hosted on Google Colab and utilizes Google's free Cloud GPUs:
    - https://colab.research.google.com/drive/1Y_qcrWQf-x3NgfWXg4BpRVaF1hyDCSjs?usp=sharing

#### (DEVELOPMENT) Making changes:

Using the docker-compose script will automatically push changes to the web app immediately after changes are made (without having to run any further commands or scripts).

#### (DEVELOPMENT) Debugging the Flask server:

    docker logs -f project2-flaskwebservice-1    

### Resources:

Docker: https://docs.docker.com/get-started/
Flask: https://flask.palletsprojects.com/en/2.0.x/
