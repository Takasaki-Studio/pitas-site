build: 
	- rm -rf dist
	- yarn --cwd frontend
	- yarn --cwd frontend build
	- cargo build --release
	- mkdir dist
	- cp target/release/core dist/core
	- mkdir dist/static
	- cp -r frontend/build/* dist/static/

start:
	- cd dist && ./core