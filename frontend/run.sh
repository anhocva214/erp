#!/bin/bash
docker image rm erp_admin:latest
docker build -t erp_admin:latest .
docker rm -f erp_admin
docker run -it -d --name erp_admin --network apps --env TZ=Asia/Ho_Chi_Minh -p 3000:3000 erp_admin:latest