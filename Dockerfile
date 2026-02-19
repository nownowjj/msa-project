## 1단계: 빌드 스테이지
#FROM eclipse-temurin:21-jdk-jammy AS build
#COPY . .
## 권한 부여 (혹시 모르니 유지)
#RUN chmod +x gradlew
#RUN ./gradlew :backend:monolith-launcher:bootJar --no-daemon
#
## 2단계: 실행 스테이지
#FROM eclipse-temurin:21-jre-jammy
#WORKDIR /app
#
## ⭐ 경로 수정: 멀티 모듈 프로젝트의 실제 빌드 경로로 변경
## 빌드는 루트가 아닌 하위 모듈 폴더 내의 build/libs에 생성됩니다.
#COPY --from=build /backend/monolith-launcher/build/libs/*.jar app.jar
#
## 실행
#ENTRYPOINT ["java", "-Xmx400M", "-Xms400M", "-jar", "-Dspring.profiles.active=deploy", "app.jar"]
#-----------------------------------------------------
# 1단계(빌드)는 GitHub Actions 서버가 대신 하므로 생략합니다.
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# GitHub Actions에서 빌드된 JAR 파일을 이 위치로 복사합니다.
# 경로: backend/monolith-launcher/build/libs/ 내의 jar 파일
COPY backend/monolith-launcher/build/libs/*.jar app.jar

# 실행 옵션
# -Xmx: 오라클 서버 메모리가 스왑 포함 5GB이므로,
# 기존 400M에서 1G~2G 정도로 늘려도 아주 넉넉합니다!
ENTRYPOINT ["java", "-Xmx1G", "-Xms1G", "-jar", "-Dspring.profiles.active=deploy", "app.jar"]