# Start the project

using docker-compose

```bash
docker-compose up -d
```

## Matches service

This service is a REST API that allows you to create, update and get matches.

> Any modification or creation of a match will publish an event on redis

Default port **3000**

If launched in local, you can access to the swagger documentation at http://localhost:3000/docs

## Live Matches service

This service provide an endpoint to get all the live matches.

Default port **3001**

If launched in local, you can access to the swagger documentation at http://localhost:3001/docs

## Events History service

This service provide an endpoint to get all the events history by matches.

Default port **3002**

If launched in local, you can access to the swagger documentation at http://localhost:3002/docs

## Favorites service

This service provide an endpoint to manage all the favorites matches of a user

Default port **3003**

If launched in local, you can access to the swagger documentation at http://localhost:3003/docs

## Postman

If you prefer, you can find a postman.json configuration file in the root of the project to test the API endpoints.

## How to test the project

For example one could follow does steps:

- To see all the notifications that are sent to users you can access the notification service in docker with the following commands:

```bash
docker ps # to get the container id
```

```bash
docker logs -f {notification_service_container_id}
```

- Create a match
  => POST /matches

- Create a user and add a favorite match with the id returned by the previous request
  => POST /match-favorites/{id}

- Update the match to "LIVE" with the id returned by the first request
  => PUT /matches/{id}

- Get the live matches
  => GET /live-matches

- Get the events history of the match
  => GET /match-history/{id}
