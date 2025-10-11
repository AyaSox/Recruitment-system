# Use .NET 8 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy only the server project files
COPY ["ATSRecruitSys.Server/", "ATSRecruitSys.Server/"]

# Remove the problematic ProjectReference to React app
WORKDIR "/src/ATSRecruitSys.Server"
RUN grep -v "atsrecruitsys.client.esproj" ATSRecruitSys.Server.csproj > temp.csproj && \
    mv temp.csproj ATSRecruitSys.Server.csproj

# Restore packages
RUN dotnet restore "ATSRecruitSys.Server.csproj"

# Build
RUN dotnet build "ATSRecruitSys.Server.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "ATSRecruitSys.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage - Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Railway provides PORT environment variable
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "ATSRecruitSys.Server.dll"]