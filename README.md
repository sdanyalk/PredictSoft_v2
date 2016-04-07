# PredictSoft v2.00

This is the online prediction application originally built for the Nepalese Northwest Arkansas folks. The code has been forked off of the NWA Online Fantasy App (NoFApp v1.00) which was piloted for the Twenty 20 Cricket Tournament 2016.

# Pre-requisites

This application needs the following to be installed before it can be deployed:
* MySQL server
* node
* npm

# Installation

## Clone the github directory on server

```bash
  # mkdir psoft2
  # cd psoft2
  # git clone https://github.com/grv2k8/PredictSoft_v2.git
```
## Run npm install on main folder and inside /app folder
```bash
  npm install
  cd app
  npm install
```

## Import the database and tables from SQL file in [???] into MySQL

## Run the server

```bash
  node psoft2.js
```

## You're all set when you see a message similar to the following

```bash
  [Apr 07 2016 00:46:00] Loaded Sequelize modules...
  [Apr 07 2016 00:46:00] PredictSoft v2.00 started on port 8080
```
