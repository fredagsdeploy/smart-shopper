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
