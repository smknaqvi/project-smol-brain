# **CSCC09 Beta Update**

## Beta Features Completed

- Users will be able to copy and paste a YouTube video URL into the search bar in order to start a party
- ~~Users will be able to type in a chat box while watching the video. The chat box messages will have the time stamp attached.~~ _(not supported)_
- Once a user starts a party, they will be able to invite other users to the party by sharing a unique party link
- Users will be able to navigate to different timestamps in the video and all users in the party should automatically jump to that timestamp
- Volume controls/captions will be independent
- Users will be able to play/pause the video and other viewers will also have their videos stopped/started.

## Final Features

- ~~Video playback speed will be synchronized~~ _(completed in beta)_
- Users will be able to optionally set a password on their parties
- <span style="color:red">Add REDIS for storing room information.</span>
- <span style="color:red">Users will be able to type in a chat box while watching the video. The chat box messages will have the time stamp attached.</span>

## Tech Stack

**Frontend**
The frontend UI will be built with ReactJS since we want to use a technology that has lots of community support, to make it easier for us to find resources and learn. We'll be using many smaller JS libraries that we'll add as required throughout development (Things like routers, component libraries, etc...). We'll be using TypeScript because statically typed languages are becoming an industry standard.

**Backend**
The backend infrastructure will be built with NodeJS and ExpressJS. We'll also be using TypeScript on the backend as well. For our database, we'll be using MongoDB and interacting with our database using the mongoose library. <span style="color:red">We will use REDIS to store data that should not exist on our database _(e.g. Socket information, session data)_. It will also double as a message broker to allow us to scale socket.io.</span>

**Devops**
To deploy our application, we'll use Docker and Docker compose. This will allow us to deploy our application on any environment that supports docker. We will also use nginx as a reverse proxy. If a domain isn't provided by the instructors, ~~we can deploy on Daniel's domain (dnelw)~~ <span style="color:red">we deployed this at https://ytparty.ml. You can monitor the availability at https://status.ytparty.ml</span>

**Websockets**
Because our application relies heavily on synchronizing users, we'll also need to take advantage of websockets for much of the functionality. We may consider using some NodeJS wrappers around Websockets if we find them to be of use.

## Technical Challenges

- The most challenging part of our application will be learning how to use websockets in order to synchronize video
- Since we're using many libraries, there will likely be a steep learning curve when we begin development in order to familiarize ourselves with all the technologies
- Making sure the application is safe and secure will be challenging, since we don't want unauthorized users joining parties.
- Learning React and NodeJS with TypeScript will be a new challenge for our team, since we've never used TypeScript before
- Learning how to use Docker and Docker compose to deploy our application will be more challenging than simply hosting on Heroku or a similar platform.
- <span style="color:red">Learning how tow use REDIS and also integrate it with Socket.io.</span>
