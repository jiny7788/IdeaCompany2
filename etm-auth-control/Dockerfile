FROM stakater/oracle-jdk:8u152-alpine-3.7

ADD target/etm-auth-control*.jar /etm-auth-control.jar

ENTRYPOINT ["java", "-XX:MetaspaceSize=128M", "-XX:MaxMetaspaceSize=256m", "-Xms1024M", "-Xmx1024M", "-XX:+UseG1GC", "-XX:+DisableExplicitGC", "-XX:+UseLargePagesInMetaspace", "-jar", "/etm-auth-control.jar"]

EXPOSE 8091
