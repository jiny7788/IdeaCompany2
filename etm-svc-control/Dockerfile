FROM stakater/oracle-jdk:8u152-alpine-3.7

ADD /target/etm-svc-control*.jar /etm-svc-control.jar

ENTRYPOINT ["java", "-XX:MetaspaceSize=128M", "-XX:MaxMetaspaceSize=256m", "-Xms2048M", "-Xmx2048M", "-XX:+UseG1GC", "-XX:+DisableExplicitGC", "-XX:+UseLargePagesInMetaspace", "-jar", "/etm-svc-control.jar"]

EXPOSE 8090
