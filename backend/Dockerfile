# Use the official Python image.
FROM python:3.9

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY requirements.txt ./

# Install dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# Copy local code to the container image.
COPY . .

# Run the web service on container startup.
CMD [ "python", "./app.py" ]

# Expose the port the app runs on.
EXPOSE 5000