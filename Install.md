WYR up and running:

1. Create base folders:
wouldyourather
/wouldyourather-client
/wouldyourather-server

2. Clone client and server repos into appropriate subfolders:

3. Install command line tools:
	xcode-select --install

4. Install homebrew (easy way to install postgres database and python):
	ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

5. Make sure you have python: 
	python --version
	if not install:
		brew install python
		or got to https://www.python.org/downloads/ for a specific version

6. Install postgres using homebrew:
	brew install postgres

7. Initialize the database:
	initdb /usr/local/var/postgres
	
	If you get an error that starts with "initdb: directory "/usr/local/var/postgres" exists but is not empty
	If you want to create a new database system..." I believe you can skip to the next step

	Run the following to start db on load:
		mkdir -p ~/Library/LaunchAgents
		ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents
		launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist
	Or use these commands to start and stop manually:
		Start: pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start
		Stop: pg_ctl -D /usr/local/var/postgres stop -s -m fast

8. Create the database:
	createdb -h localhost wouldyourather_db
	List the databases to ensure it was created properly:
		psql -l