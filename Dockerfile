# Use .NET 8 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies (without React project reference)
COPY ["ATSRecruitSys.Server/ATSRecruitSys.Server.csproj", "ATSRecruitSys.Server/"]

# Remove the React project reference from csproj during build
RUN sed -i '/<ProjectReference.*atsrecruitsys\.client/d' ATSRecruitSys.Server/ATSRecruitSys.Server.csproj

# Restore packages
RUN dotnet restore "ATSRecruitSys.Server/ATSRecruitSys.Server.csproj"

# Copy the rest of the backend files
COPY ["ATSRecruitSys.Server/", "ATSRecruitSys.Server/"]

# Build
WORKDIR "/src/ATSRecruitSys.Server"
RUN dotnet build "ATSRecruitSys.Server.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "ATSRecruitSys.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Configure to listen on Railway's dynamic port
ENV ASPNETCORE_URLS=http://+:$PORT
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "ATSRecruitSys.Server.dll"]