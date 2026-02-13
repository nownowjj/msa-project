# 1단계: 빌드 스테이지
FROM eclipse-temurin:21-jdk-jammy AS build
COPY . .
RUN ./gradlew :backend:monolith-launcher:bootJar --no-daemon

# 2단계: 실행 스테이지
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /build/libs/app.jar app.jar

# 실행
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=deploy", "app.jar"]