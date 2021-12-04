## CIS 422 Project 2 - Math Culture 

#### Building and Running the web app (Development):

1. Install Docker Desktop for Mac or Windows, or Docker (and Docker Compose) for linux:
    - https://docs.docker.com/get-docker/
    - https://docs.docker.com/compose/install/ (Linux only)
    - NOTE: M1 MacBooks can build and run the Docker container. However, they are not compatible with the PyTorch library. Therefore, M1 MacBook's cannot use the equation prediction feature.
2. Run Docker Desktop (Mac and Windows) or the Docker daemon (Linux) in the background
3. Build and run the application stack using docker-compose:
<br>(NOTE: this may take a few minutes. The PyTorch python library is large.)

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

#### (DEVELOPMENT) Neural Network Training and Testing (Google Colab)

- By default, our object detector is already trained so it can be used to predict equations.
- If you would like to train the object detector yourself, you may run the Jupyter Notebook found at: /flask_app/draw/detector/CustomDatasetFasterRCNNFineTuning.ipynb
- /flask_app/draw/detector/dataset.tar.gz must be uploaded into the /content/ folder of Google Colab
- We trained the neural network using Google Colab and Google's free Cloud GPUs:
    - https://colab.research.google.com

- NOTE: Training the network with a CPU is very slow. It may take days. A GPU is highly recommended.

#### (DEVELOPMENT) Making changes:

Using the docker-compose script will automatically push changes to the web app immediately after changes are made (without having to run any further commands or scripts).

#### (DEVELOPMENT) Debugging the Flask server:

    docker logs -f project2_flaskwebservice_1    

### Resources:

Docker: https://docs.docker.com/get-started/
Flask: https://flask.palletsprojects.com/en/2.0.x/
Firebase: https://firebase.google.com/docs
PyTorch: https://pytorch.org/
Google Colab: https://colab.research.google.com/ 
