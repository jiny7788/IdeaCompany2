FROM stakater/oracle-jdk:8u152-alpine-3.7

ADD target/etm-infra-gateway*.jar /etm-infra-gateway

ENTRYPOINT ["java", "-XX:MetaspaceSize=128M", "-XX:MaxMetaspaceSize=256m", "-Xms2048M", "-Xmx2048M", "-XX:+UseG1GC", "-XX:+DisableExplicitGC", "-XX:+UseLargePagesInMetaspace", "-jar", "/etm-infra-gateway"]

EXPOSE 8080
