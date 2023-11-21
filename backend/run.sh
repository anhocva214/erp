#!/bin/bash
docker image rm erp_api:latest
docker build -t erp_api:latest .
docker rm -f erp_api
docker run -it -d --name erp_api --network apps --env TZ=Asia/Ho_Chi_Minh -p 4000:4000 erp_api:latest