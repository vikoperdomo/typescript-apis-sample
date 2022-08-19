# Include env variables
. ./.env.local

rm -rf dist
tsc
sls offline build
sls offline start

