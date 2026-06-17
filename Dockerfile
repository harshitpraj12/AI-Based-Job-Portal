FROM openjdk:27-ea-trixie
ADD target/job-portal.jar job-portal.jar
ENTRYPOINT ["java", "-jar", "/job-portal.jar"]