# wouldyourather-client
WYR up and running from scratch:

1. Create base folders:
wouldyourather
/wouldyourather-client
/wouldyourather-server

2. Clone client and server repos into appropriate subfolders:

3. Install command line tools:
	xcode-select --install

4. Install homebrew (easy way to install postgres database and python):
	ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

5. Make sure you have python (2.7 should be ok...): 
	python --version
	if not install:
		brew install python
		or got to https://www.python.org/downloads/ for a specific version

6. Install pip (python package manager) if you don't have it:
	sudo easy_install pip

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

9. Install psycopg2 (PostgreSQL adapter for python):
	sudo pip install psycopg2

10. Install virtualenv (creates an environment that has its own installation directories):
	sudo pip install virtualenv

11. Install Django:
	sudo pip install django

12. Install Django Rest Framework:
	sudo pip install djangorestframework

13. Install Django Auth Token:
	sudo pip install django-rest-auth

14. Install Django Cors Headers:
	sudo pip install django-cors-headers

15. Install node and node package manager:
	Node & npm:
		brew install node
		or http://nodejs.org/
	Update npm:
		sudo npm install npm -g
	Check node version:
		node -v

16. Install node packages from package.json:
	cd into wouldyourather-client directory
	npm install

17. Install Grunt:
	sudo npm install -g grunt-cli
	Check version:
		grunt --version

18. Install Karma:
	npm install -g karma