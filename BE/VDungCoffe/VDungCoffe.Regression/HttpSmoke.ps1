$ErrorActionPreference = 'Stop'
$backendDirectory = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../VDungCoffe'))
$backendDll = Join-Path $backendDirectory 'bin/Debug/net9.0/VDungCoffe.dll'
if (!(Test-Path -LiteralPath $backendDll)) { throw 'Build the backend before running this smoke test.' }
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
$listener.Start()
$port = $listener.LocalEndpoint.Port
$listener.Stop()
$baseUrl = "http://127.0.0.1:$port"
$logPath = Join-Path $env:TEMP "vdung-http-smoke-$port.log"
$errorPath = Join-Path $env:TEMP "vdung-http-smoke-$port.err.log"
$oldEnvironment = @{}
$testEnvironment = @{
    'ASPNETCORE_URLS' = $baseUrl
    'ASPNETCORE_ENVIRONMENT' = 'Development'
    'Jwt__Key' = [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
    'ConnectionStrings__DefaultConnection' = 'Server=127.0.0.1,1;Database=SmokeNeverConnect;User Id=smoke;Password=smoke;Connect Timeout=1;ConnectRetryCount=0;Encrypt=false'
    'InitialAdmin__Enabled' = 'false'
    'Logging__EventLog__LogLevel__Default' = 'None'
}
$process = $null
try {
    foreach ($name in $testEnvironment.Keys) {
        $oldEnvironment[$name] = [Environment]::GetEnvironmentVariable($name)
        [Environment]::SetEnvironmentVariable($name, $testEnvironment[$name])
    }
    $process = Start-Process -FilePath 'dotnet' -ArgumentList ('"' + $backendDll + '"') -WorkingDirectory $backendDirectory -WindowStyle Hidden -PassThru -RedirectStandardOutput $logPath -RedirectStandardError $errorPath
    $ready = $false
    for ($attempt = 0; $attempt -lt 60; $attempt++) {
        if ($process.HasExited) { throw "Backend exited. Inspect $logPath and $errorPath" }
        try {
            $probe = Invoke-WebRequest "$baseUrl/api/admin/products" -SkipHttpErrorCheck -TimeoutSec 1
            $ready = $true
            break
        } catch { Start-Sleep -Milliseconds 250 }
    }
    if (!$ready) { throw "Backend failed to start. Inspect $logPath and $errorPath" }
    function Assert-Http($method, $path, $status, $body = $null, $headers = @{}) {
        $request = @{ Uri = "$baseUrl$path"; Method = $method; SkipHttpErrorCheck = $true; TimeoutSec = 5; Headers = $headers }
        if ($null -ne $body) { $request.Body = $body; $request.ContentType = 'application/json' }
        $response = Invoke-WebRequest @request
        if ([int]$response.StatusCode -ne $status) { throw "$method $path expected $status, got $($response.StatusCode): $($response.Content)" }
        $envelope = $response.Content | ConvertFrom-Json
        if ($null -eq $envelope.success -or $null -eq $envelope.message) { throw "$method $path missing API error envelope" }
        Write-Output "PASS HTTP $method $path -> $status (envelope verified)"
    }
    Assert-Http GET '/api/admin/products' 401
    Assert-Http PATCH '/api/admin/products/00000000-0000-0000-0000-000000000001/price' 401 '{}'
    Assert-Http POST '/api/auth/login' 400 '{"email":"invalid","password":"","isAdmin":true}'
    Assert-Http POST '/api/auth/login' 400 '{'
    Assert-Http POST '/api/auth/login' 403 '{}' @{ Origin = 'https://attacker.example' }
    Assert-Http GET '/api/does-not-exist' 404
    Write-Output 'HTTP smoke checks: 6 passed. Database-independent paths only; authenticated policies are checked by the regression executable.'
} finally {
    if ($null -ne $process -and !$process.HasExited) { Stop-Process -Id $process.Id -Force }
    foreach ($name in $oldEnvironment.Keys) { [Environment]::SetEnvironmentVariable($name, $oldEnvironment[$name]) }
}
