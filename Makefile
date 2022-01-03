build:
	- yarn --cwd core
	- yarn --cwd core build
	- yarn --cwd core prisma migrate deploy
	- mkdir -p dist
	- mkdir -p dist/server
	- mkdir -p dist/videos
	- mkdir -p dist/images
	- cp -r core/node_modules dist/server/node_modules
	- cp -r core/dist/* dist/server/
	- mkdir -p dist/server/prisma
	- cp -r core/prisma/db dist/server/prisma/db
	- mkdir -p dist/static
	- mkdir -p dist/bin
	- yarn --cwd frontend
	- yarn --cwd frontend build
	- cp -r frontend/build/* dist/static/

start: 
	- cd dist/ ; node server/index.js
