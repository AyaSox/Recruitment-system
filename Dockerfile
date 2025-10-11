# Use .NET 8 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ATSRecruitSys.Server/ATSRecruitSys.Server.csproj ATSRecruitSys.Server/
RUN dotnet restore ATSRecruitSys.Server/ATSRecruitSys.Server.csproj

# Copy everything else and build
COPY ATSRecruitSys.Server/ ATSRecruitSys.Server/
WORKDIR /src/ATSRecruitSys.Server
RUN dotnet build -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Use runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port (Railway will set PORT environment variable)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ATSRecruitSys.Server.dll"]