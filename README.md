# CarlVision

Welcome to CarlVision! A hands-on image processing application built to make computer vision a little less intimidating.

Built with React, Python, and OpenCV, CarlVision provides a fun, interactive lab where users can experiment with common image processing techniques they might encounter in their day-to-day lives.

## Simple overview

I wanted to create this project to give people with minimal experience in computer vision a chance to understand how computers see, interpret, and interact with visual information.

This project is aimed toward people who struggle with OpenCV documentation, prefer a more hands-on experience, or want to test out aspects of image processing that they haven't been able to before.

Fit into any of these? Well, **WELCOME!**

## Current Features

- Image Uploading
- Gaussian blur
- Median blur
- Bilateral filtering
- Canny edge detection
- Threshold Configuration
- Dynamic filter Configuration
- Live filter previews with debounced updates
- OpenCV image processing
- More to come in later versions!

## Future Improvements

- Additional image processing operations.
- Image export/download functionality.

## Technologies

### Frontend

- React
- Vite
- Tailwind CSS
- Axios

### Backend

- Python
- Flask
- OpenCV
- NumPy

## How This Works

1. The user selects an image, either by selecting or dragging and dropping, into the React frontend.
2. The image and processing configuration are sent to the Flask API.
3. Flask decodes the image using OpenCV.
4. The configured processing operations are applied.
5. The processed image is encoded and returned to the frontend.
6. React displays the processed image.

## What I learned

- Connecting a React frontend to a Python backend.
- Sending images and configuration data using FormData.
- Creating Flask API endpoints.
- Encoding and decoding images with OpenCV.
- Passing processed image data back to a browser.
- Working with OpenCV image dimensions and channels.
- Building configurable image processing pipelines.
- Managing frontend state and user configuration.
- Improving responsive layouts and mobile configurations.
- Implementing drag-and-drop file handling.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Shamuel69/CarlVision.git
cd CarlVision
```

### 2. Set up the python backend

Navigate to the server directory in the terminal and use type this:
```cd server```

Create a virtual environment:
```python -m venv venv```

Activate it on Windows:
```venv\Scripts\activate```

Install the required Python packages:
```pip install -r ..\requirements.txt```

Start the Flask server:

```bash
python main.py
```

### 3. Set up the React frontend

Open a second terminal and navigate to the frontend:

`cd CarlVision/client`

Open a second terminal and install the frontend dependencies:

`npm install`

Start the development server:

`npm run dev`

Vite will show you the local address to open in your browser.
