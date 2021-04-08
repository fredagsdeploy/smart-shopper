# Development

You don't need to run all services yourself to do development.
The whole system is already running on smartcart.tejpb.it.
You only need to run kafka and neo4j or such things if you are developing on them.

## Setup .env.local for the oauth proxy

Needed for development on the backend. The oauth proxy adds the user id to the proxied request.

`cp .env.sample .env.local`
Fill .env.local. Either ask another developer or get them from the google console.

## Backend

If you are developing on the backend you only need to run the backend and oauth

```
docker-compose up backend
docker-compose up oauth
```

## Frontend

You don't need docker for this. You do need expo.

```
cd frontend && npm install && npm start
```

Create these folders
`mkdir -p confluent/{kafka_data,zookeeper,zookeeper_log}`

## neo4j integration

In `neo4j-connector`, run:

```shell
curl -X POST http://localhost:8083/connectors \
    -H 'Content-Type:application/json' \
    -H 'Accept:application/json' \
    -d @neo4j-kafka-sink-connector.json
```

To test-publish checkItem event:

```shell
kafkacat -P -b localhost:9092 -t checkItem -l -D "\n" checkItem.json
```

To test-publish uncheckItem event:

```shell
kafkacat -P -b localhost:9092 -t uncheckItem -l -D "\n" uncheckItem.json
```

Visit [http://localhost:7474/browser/](http://localhost:7474/browser/), select "No authentication". In the repl, write:

```cypher
MATCH p = (:Item) return p
```
