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

9. Create database user admin:
	createuser admin

10. Install psycopg2 (PostgreSQL adapter for python):
	sudo pip install psycopg2

11. Install virtualenv (creates an environment that has its own installation directories):
	sudo pip install virtualenv

12. Install Django:
	sudo pip install django

13. Install Django Rest Framework:
	sudo pip install djangorestframework

14. Install Django Auth Token:
	sudo pip install django-rest-auth

15. Install Django Cors Headers:
	sudo pip install django-cors-headers

16. Apply database migrations:
	python manage.py migrate auth
	python manage.py migrate
	(now can verify tables look good in app like Postico)

17. Create a Django admin user to access 127.0.0.1:8080/admin:
	python manage.py createsuperuser
	Username: admin
	Email: your email
	Password: password of choice

18. Install node and node package manager:
	Node & npm:
		brew install node
		or http://nodejs.org/
	Update npm:
		sudo npm install npm -g
	Check node version:
		node -v

19. Install node packages from package.json:
	cd into wouldyourather-client directory
	npm install

20. Install Grunt:
	sudo npm install -g grunt-cli
	Check version:
		grunt --version

21. Install Karma:
	npm install -g karma

22. Run server and client
	Server:
		cd to wouldyourather-server
		python manage.py runserver 8080
		default is 127.0.0.1:8080
	Client:
		cd to wouldyourather-client
		default is 127.0.0.1:8000
		grunt