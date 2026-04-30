@REM Maven Wrapper for Windows
@echo off
setlocal

set MAVEN_PROJECTBASEDIR=%~dp0
set PROPERTIES_FILE=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties

for /f "tokens=1,* delims==" %%a in ('findstr "distributionUrl" "%PROPERTIES_FILE%"') do set DIST_URL=%%b
for %%i in (%DIST_URL%) do set DIST_NAME=%%~ni
set DIST_NAME=%DIST_NAME:-bin=%

set MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\%DIST_NAME%

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo Downloading Maven %DIST_NAME%...
    if not exist "%USERPROFILE%\.m2\wrapper\dists" mkdir "%USERPROFILE%\.m2\wrapper\dists"
    powershell -Command "Invoke-WebRequest -Uri '%DIST_URL%' -OutFile '%TEMP%\maven.zip'"
    powershell -Command "Expand-Archive -Path '%TEMP%\maven.zip' -DestinationPath '%USERPROFILE%\.m2\wrapper\dists' -Force"
    del "%TEMP%\maven.zip"
)

"%MAVEN_HOME%\bin\mvn.cmd" %*
