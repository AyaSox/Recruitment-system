@echo off
echo Cleaning npm cache and removing package-lock.json...

cd atsrecruitsys.client

rem Remove node_modules
if exist node_modules (
    echo Removing node_modules folder...
    rmdir /s /q node_modules
)

rem Remove package-lock.json
if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
)

rem Clean npm cache
echo Cleaning npm cache...
npm cache clean --force

echo Done! Now run 'npm install' to reinstall dependencies.
pause