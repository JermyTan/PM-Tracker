## Setup

Ensure you have [python 3.10](https://www.python.org/downloads/) installed on your local machine.

Then execute:

For mac, **`python3 -m venv venv`**

For windows, **`py -m venv venv`**

To create a virtual environment.

Next, depending on the platform and shell used in your local machine, execute the corresponding command to activate the virtual environment.

| Platform | Shell           | Command to activate venv           |
| -------- | --------------- | ---------------------------------- |
| POSIX    | bash/zsh        | \$ source venv/bin/activate        |
|          | fish            | \$ . venv/bin/activate.fish        |
|          | csh/tcsh        | \$ source venv/bin/activate.csh    |
|          | PowerShell Core | \$ venv/bin/Activate.ps1           |
| Windows  | cmd.exe         | C:\\> venv\Scripts\activate.bat    |
|          | PowerShell      | PS C:\\> venv\Scripts\Activate.ps1 |

For e.g. on Mac, run **`source venv/bin/activate`**

Finally, execute:

**`pip install --upgrade pip`**

**`pip install -r requirements.txt`**

To install all app dependencies.

## Commands

### Run Development Server

**`python pigeonhole/manage.py runserver`**

### Create migration

**`python pigeonhole/manage.py makemigrations`**

### Run migration

**`python pigeonhole/manage.py migrate`**

### Create new service

**`python pigeonhole/manage.py startapp <service_name>`**

Then move `<service_name>` folder from root into `pigeonhole` folder,
and add `<service_name>` to `INSTALLED_APPS` in `pigeonhole/pigeonhole/settings.py`.

### Create superuser

**`python pigeonhole/manage.py initsuperuser --username=<username> --email=<email> --password=<password>`**
