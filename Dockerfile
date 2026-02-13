# 1단계: 빌드 스테이지
FROM eclipse-temurin:21-jdk-jammy AS build
COPY . .
# 권한 부여 (혹시 모르니 유지)
RUN chmod +x gradlew
RUN ./gradlew :backend:monolith-launcher:bootJar --no-daemon

# 2단계: 실행 스테이지
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# ⭐ 경로 수정: 멀티 모듈 프로젝트의 실제 빌드 경로로 변경
# 빌드는 루트가 아닌 하위 모듈 폴더 내의 build/libs에 생성됩니다.
COPY --from=build /backend/monolith-launcher/build/libs/*.jar app.jar

# 실행
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=deploy", "app.jar"]