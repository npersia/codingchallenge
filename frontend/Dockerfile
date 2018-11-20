FROM node

RUN mkdir -p /usr/src/frontend
WORKDIR /usr/src/frontend

COPY package.json /usr/src/frontend
RUN npm install

COPY . /usr/src/frontend

#RUN npm run webpack

EXPOSE 3000

CMD [ "npm", "start" ]
