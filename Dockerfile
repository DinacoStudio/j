FROM node:latest
RUN git clone https://github.com/DinacoStudio/youtube.git /home/dinaco/youtube

WORKDIR /home/dinaco/youtube

RUN npm install


CMD ["node", "index.js"]