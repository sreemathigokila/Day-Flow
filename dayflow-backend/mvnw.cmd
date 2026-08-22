@echo off
if "%JAVA_HOME%"=="" set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.12"
set "MAVEN_OPTS=-Djavax.net.ssl.trustStoreType=WINDOWS-ROOT -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true"
set MAVEN_VERSION=3.9.6
set WRAPPER_DIR=%~dp0.mvn\wrapper
set MAVEN_HOME=%WRAPPER_DIR%\apache-maven-%MAVEN_VERSION%\apache-maven-%MAVEN_VERSION%

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo Downloading Apache Maven %MAVEN_VERSION%...
    mkdir "%WRAPPER_DIR%" 2>NUL
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile '%WRAPPER_DIR%\maven.zip'"
    powershell -Command "Expand-Archive -Path '%WRAPPER_DIR%\maven.zip' -DestinationPath '%WRAPPER_DIR%\apache-maven-%MAVEN_VERSION%' -Force"
    del "%WRAPPER_DIR%\maven.zip" 2>NUL
)

call "%MAVEN_HOME%\bin\mvn.cmd" %*
