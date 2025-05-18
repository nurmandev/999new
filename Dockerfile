# Use the official Node.js image as the base image
FROM node:18 as build

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && ./aws/install
 
# Set the working directory inside the container  
WORKDIR /app  

# Copy package.json and package-lock.json to the container
COPY package.json ./

# Install dependencies
RUN yarn install

# Copy the entire project to the container
COPY . .

COPY env.example .env

# # Build
RUN yarn build

RUN ls -l

# Set your AWS access key, secret key, and default region as build arguments
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_DEFAULT_REGION

# Copy your file into the container (this assumes it's in the same directory as the Dockerfile)
RUN aws s3 cp ./out s3://bonenza-s3-bucket-cdn --recursive


# Expose the port on which your app listens
# EXPOSE 3000

# Start the app
# CMD [ "yarn", "dev" ]

# FROM nginx:stable-alpine
# COPY --from=build /app/out /usr/share/nginx/html
# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
