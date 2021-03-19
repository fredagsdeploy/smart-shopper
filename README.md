Create these folders
`mkdir -p confluent/{kafka_data,zookeeper,zookeeper_log}`


## neo4j integration
In `neo4j-connector`, run:
```shell
curl -X POST http://localhost:8083/connectors \                                                                              personal/smart-shopper (feature/neo4j-db ⚡) 29ms  
    -H 'Content-Type:application/json' \
    -H 'Accept:application/json' \
    -d @neo4j-kafka-sink-connector.json
```

To test-publish addNode event:
```shell
kafkacat -P -b localhost:9092 -t addNode -l -D "\n" nodeData.json
```

To test-publish addEdge event:
```shell
kafkacat -P -b localhost:9092 -t addEdge edgeData.json
```

Visit [http://localhost:7474/browser/](http://localhost:7474/browser/), select "No authentication".  In the repl, write:
```cypher
MATCH p = (:Food) return p
```