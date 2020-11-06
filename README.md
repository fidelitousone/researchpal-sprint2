# ResearchPal
## Description
An all-in-one research gathering app, complete with citation generators and other tools to make the research process a breeze. 

## Project Team
Final Project for **CS 490: Design in Software Engineering**

Robert Argasinski, Eugene Cha, Mark Galesi, Jatinder Singh



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

## Local Deployment
1. Build the app for production: `npm run watch`
2. Create a `.env` file in the root directory with the following content:
```sh
DATABASE_URL=postgresql://<your-username>:<your-password>@localhost/
```
- Remember to replace `<your-username>` and `<your-password>`.
3. In a separate terminal, run: `python app.py`
