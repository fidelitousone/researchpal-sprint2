# ResearchPal
https://rocky-sea-29898.herokuapp.com/

## Description
An all-in-one research gathering app, complete with citation generators and other tools to make the research process a breeze. 

## Project Team
Final Project for **CS 490: Design in Software Engineering**

Robert Argasinski, Eugene Cha, Mark Galesi, Jatinder Singh

## Sprint 2 Work Completed
#### Robert Argasinski
* Download sources button
* Bulk import file upload
* Loading spinners
* Bibliography page front-end
* Log-out dropdown menu
* NavBar
* Source/Project deletion confirmation windows
* URL validation
* Delete Project Buttons
* Duplicate source and project detection
#### Eugene Cha
* React Cleanup
* Citation deactivation/activation
* Bulk source upload back-end
* Unit Tests
* Restructure front-end directory
* Server logging
* Mocking Metascraper
* DB schema for citations
#### Mark Galesi
* Citation deactivation/activation
* Bulk source upload back-end
* Citation download button
* Bibliography page
* Citation generation
* Metascraper API implimentation
* Add source info to db
#### Jatinder Singh
* React Linting
* Bulk source upload back-end
* Source deletion front-end
* Refactor React
* Rewrite React with create-react-app template

## Deviations from Proposal
* The user cannot set a citation style on project creation, instead, a citation will be created for each style, and the user can select the style when the download their citations.
* The user cannotcompletely delete a citation without deleting the source information, instead, a citation can be deactivated before downloading, deactivated citations will not be inclued in the download.

## Linting

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
pip install -r requirements.txt
pip install -r dev-requirements.txt
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
1. Create your Google API account [here](https://console.developers.google.com/apis/dashboard)
2. Go to Credentials > Create Credentials
- OAuth client ID
- Application type>Web App
- Name your client
- create
- copy your Client ID
- Open scripts/GoogleButton.jsx
- inside the GoogleAuth() function, replace `clientId=<client id>` with `clientId=<your client id">`

## Local Development - Front End
1. Run `npm run start`
- Warning: Run the Flask server in a separate terminal, otherwise the app will not function.
2. When it is ready for production, run `npm run build`

## Local Development - Back End
1. Create a `.env` file in the root directory with the following:
```sh
DATABASE_URL=postgresql://<your-username>:<your-password>@localhost/
SECRET_KEY=<some-secret-key>
```
- Remember to replace `<some-secret-key>`, `<your-username>` and `<your-password>`.
2. In a separate terminal, run: `python app.py`
