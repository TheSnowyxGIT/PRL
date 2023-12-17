## Start the project

using docker-compose

```bash
docker-compose up -d
```

### Matches service

This service is a REST API that allows you to create, update and get matches.

> Any modification or creation of a match will publish an event on redis

Default port **3000**

If launched in local, you can access to the swagger documentation at http://localhost:3000/docs

### Live Matches service

This service provide an endpoint to get all the live matches.

Default port **3001**

If launched in local, you can access to the swagger documentation at http://localhost:3001/docs

### Events History service

This service provide an endpoint to get all the events history by matches.

Default port **3002**

If launched in local, you can access to the swagger documentation at http://localhost:3002/docs
