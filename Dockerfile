FROM node:20

WORKDIR /usr/app

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install dependencies
RUN apt-get update && \
    apt-get install -y \
    wget \
    gnupg \
    software-properties-common

# Add the Chromium repository and install Chromium
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
#     sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' && \
#     apt-get update && \
#     apt-get install -y chromium

# Clean up
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set environment variable to avoid errors related to running Chromium in Docker
ENV CHROME_BIN=/usr/bin/chromium

COPY . .

RUN npm install

RUN chmod 755 src/scripts/entrypoint.sh
