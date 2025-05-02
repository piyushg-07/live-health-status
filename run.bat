@echo off
REM ------------------------------------------------------------
REM run_all.bat — Choose to run via Docker or Locally with RabbitMQ
REM ------------------------------------------------------------

echo =====================================================
echo  Start Health Records App: Docker or Local
echo =====================================================

echo.
echo Choose how to run the application:
echo 1. Run via Docker
echo 2. Run locally
echo.

choice /C 12 /N /M "Select an option (1 = Docker, 2 = Local): "
set RUN_MODE=%ERRORLEVEL%

IF %RUN_MODE%==1 (
    echo.
    echo ✅ Running via Docker...
    choice /M "Do you want to start Docker services now?"
    IF %ERRORLEVEL%==1 (
        echo Starting Docker Compose...
        docker-compose up -d

        echo Waiting for services to initialize...
        timeout /t 10 /nobreak >nul

        echo Opening API logs...
        start "API Logs" cmd /k "docker compose logs -f api"
    ) ELSE (
        echo ❌ Skipping Docker startup.
    )
) ELSE IF %RUN_MODE%==2 (
    echo.
    echo ✅ Running locally...

    REM Start RabbitMQ server
    echo Starting RabbitMQ server...
    start "RabbitMQ" cmd /k "call rabbitmq-server"

    REM Wait for RabbitMQ to be ready
    echo Waiting for RabbitMQ on port 5672...
:wait_rabbitmq
    powershell -Command "(New-Object Net.Sockets.TcpClient).Connect('localhost', 5672)" 2>nul
    IF ERRORLEVEL 1 (
        timeout /t 2 >nul
        goto wait_rabbitmq
    )
    echo ✅ RabbitMQ is running.

    REM Start local Node.js server
    echo Starting local server...
    start "Local Server" cmd /k "call npm run dev"

    REM Give some time for both services to launch
    timeout /t 3 >nul
) ELSE (
    echo .
)

REM Prompt to open dashboard
echo.
choice /M "Do you want to open the Health Records Dashboard in the browser?"
IF %ERRORLEVEL%==1 (
    echo Opening Health Records Dashboard...
    start "" "http://localhost:5500/server/public/tester/login.html"
) ELSE (
    echo Skipping dashboard launch.
)

echo.
echo ✅ All Services are running!

REM Prevent script from exiting automatically
:loop
echo.
echo Press CTRL+C to exit this script window manually.
timeout /t 60 >nul
goto loop

:end
pause
