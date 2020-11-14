# ResearchPal
Heroku link: https://secure-peak-36471.herokuapp.com/

## Description
An all-in-one research gathering app, complete with citation generators and other tools to make the research process a breeze. 

## Project Team
Final Project for **CS 490: Design in Software Engineering**

Robert Argasinski, Eugene Cha, Mark Galesi, Jatinder Singh

## MVP Work Completed
#### Robert Argasinski
* Facebook OAuth
* Add Bootstrap integration to front-end
* Add navigation and multi-page support
* Pull profile picture on login
* Detect empty project name and notify user

#### Eugene Cha
* Set up PostgreSQL database
* Build database models
* Set up Python back-end, including SocketIO and SQLAlchemy
* Set up back-end unit testing
* Deploy production on gunicorn
* Set up coverage tests on CircleCI

#### Mark Galesi
* Google and Microsoft OAuth
* Add support for project creation and retrieval
* Login and logout flow with sessions
* Pull email on login

#### Jatinder Singh
* Set up GitHub and Heroku
* Set up CircleCI for automatic deployment and integration testing
* Add support for source input and retrieval
* Link each project button to a unique project page with corresponding sources
* Create basic React app
* Add error handling to OAuth buttons

## MVP Pending Work
#### Dashboard functionality
* Detect duplicate project name and notify user
* Detect invalid project names
* Improve styling and layout

#### Project Page functionality
* Provide the option of a bulk import (comma or whitespace separated list of URLs)
* Detect duplicate sources and notify user
* Detect invalid source URLs
* Improve styling and layout

## Known Issues
* Facebook authentication is not behaving properly.  It works, but it takes two login attempts back-to-back (without logging out) in order for the session to be set.  It seems to be specifically related to the Facebook button, since the same issue does not exist on either the Google or Microsoft button.  We will be actively looking into fixing this bug for the next project milestone.

## Deviations from MVP Proposal
* In the original mockups, the logout option was supposed to be placed in a dropdown menu, but in our current implementation, it is a standalone button.
* Our Dashboard interface is a little different, but the same basic functionality is there.
* Our navigation to the Project Page interface is very different in this implementation.  What you have to do is first select the button, then click the "Project" button.  This will take you to the Project Page for the specified project.  In future iterations, we will improve this workflow so that users are redirected automatically after selecting their desired project.
* Bulk import support is missing, although it will likely be added in future iterations.

## Setup the App
1. Clone the repository:
```bash
git clone "https://github.com/fidelitousone/researchpal.git"
```
2. Install the Node.js dependencies:
```bash
npm install
```
3. Install the Python dependencies:
```bash
pip install -r dev-requirements.txt
pip install -r requirements.txt
```
- Note: `dev-requirements.txt` is not needed for production.

## Setup PostgreSQL
1. Install PostgreSQL:
- Amazon Linux/CentOS: `sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs`
- Ubuntu/Debian: `sudo apt install postgresql libpq-dev`
2. Initialize PostgreSQL: `sudo service postgresql initdb`
3. Start PostgreSQL: `sudo service postgresql start`
4. Add yourself as a superuser on PostgreSQL: `sudo -u postgres createuser --superuser $USER`
- If you get an error saying "could not change directory", that's okay.
5. Create a new database: `sudo -u postgres createdb $USER`
- If you get an error saying "could not change directory", that's okay.  
6. Make sure your user shows up:
- a) `psql`
- b) `\du` look for your username
- c) `\l` look for your username as a database
7. Edit the authentication method from `ident` to `md5`: `sudo vim /var/lib/pgsql9/data/pg_hba.conf`
8. Restart PostgreSQL: `sudo service postgresql restart`
9. Add a password to the user you added in step 4: `psql -c "ALTER ROLE $USER WITH PASSWORD '<your-password>'"`
- Remember to replace `<your-password>`. You will need to remember it for local deployment.


## Setup Google Authentication
1. Create your google API account [here](https://console.developers.google.com/apis/dashboard)
2. Credentials>Create Credentials
- OAuth client ID
- Application type>Web App
- Name your client
- create
- copy your Client ID
- Open scripts/GoogleButton.jsx
- inside the GoogleAuth() function, replace `clientId=<client id>` with `clientId=<your client id">`

## Local Deployment
1. Build the React app for production: `npm run watch`
2. Create a `.env` file in the root directory with the following content:
```sh
DATABASE_URL=postgresql://<your-username>:<your-password>@localhost/
```
- Remember to replace `<your-username>` and `<your-password>`.
3. In a separate terminal, run: `python app.py`
