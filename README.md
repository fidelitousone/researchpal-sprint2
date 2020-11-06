# ResearchPal
## Description
An all-in-one research gathering app, complete with citation generators and other tools to make the research process a breeze. 

## Project Team
Final Project for <b>CS 490: Design in Software Engineering</b>

Robert Argasinski, Eugene Cha, Mark Galesi, Jatinder Singh



## Setup Process
<b>(1)</b>
Clone the repository:
```bash
git clone https://github.com/fidelitousone/researchpal
```

<b>(2)</b>
Install the Python packages by running the following:
```bash
pip install flask
pip install flask-socketio
pip install python-dotenv
```

<b>(3)</b>
Setup a postgresql database by running the following:
1. Install PostGreSQL: `sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs`    
    Enter yes to all prompts.    
2. Initialize PSQL database: `sudo service postgresql initdb`    
3. Start PSQL: `sudo service postgresql start`    
4. Make a new superuser: `sudo -u postgres createuser --superuser $USER`    
    If you get an error saying "could not change directory", that's okay. 
5. Make a new database: `sudo -u postgres createdb $USER`    
        If you get an error saying "could not change directory", that's okay.  
6. Make sure your user shows up:    
    a) `psql`
    b) `\du` look for ec2-user as a user    
    c) `\l` look for ec2-user as a database    
7. Make a new user:    
    a) `psql` (if you already quit out of psql)    
    ## REPLACE THE [VALUES] IN THIS COMMAND! Type this with a new (short) unique password.   
    b) I recommend 4-5 characters - it doesn't have to be very secure. Remember this password!  
        `create user [some_username_here] superuser password '[some_unique_new_password_here]';`
    c) `\q` to quit out of sql    
8. `cd` into `researchpal` and make a new file called `sql.env` and add the following:
    d)`export SQLALCHEMY_DATABASE_URI='postgresql://<your sql username>:<your sql password>@localhost/<your db>'`
9. Fill in those values with the values you put in 7. b)

<b>(4)</b>
Install the JavaScript packages by running the following:
```bash
npm install
```

## Running the Application
### Local Deployment
Build the JavaScript packages using:
```bash
npm run watch
```
Then, in a separate terminal, run:
```bash
python app.py
```
