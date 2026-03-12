# Quick Docker Commands

## Start Everything
```bash
docker-compose up -d
```

## Stop Everything
```bash
docker-compose down
```

## View Logs
```bash
docker-compose logs -f app      # App logs
docker-compose logs -f mongodb  # MongoDB logs
```

## Rebuild Application
```bash
docker-compose build --no-cache app
docker-compose up -d app
```

## MongoDB Operations
```bash
# Connect to MongoDB CLI
docker exec -it clinic-mongodb mongosh -u admin -p mongodb_password

# Inside MongoDB:
# show databases
# use clinic
# db.clinic_configs.find()
# etc.
```

## Check Status
```bash
docker-compose ps  # View all containers and their status
```

## Clean Up (Remove all data)
```bash
docker-compose down -v  # -v removes volumes
```
