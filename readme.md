
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/datasci4health/jacinto-casemanager/blob/master/LICENSE)
[![Docker Automated](https://img.shields.io/docker/cloud/automated/datasci4health/jacinto-casemanager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/jacinto-casemanager)
[![Docker Build](https://img.shields.io/docker/cloud/build/datasci4health/jacinto-casemanager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/jacinto-casemanager)
[![Docker Pulls](https://img.shields.io/docker/pulls/datasci4health/jacinto-casemanager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/jacinto-casemanager)
[![Docker Stars](https://img.shields.io/docker/stars/datasci4health/jacinto-casemanager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/jacinto-casemanager)


# herena-manager

## Table of Contents 

[Harena](https://github.com/datasci4health/harena)'s API for managing users and clinical cases.

## Getting Started

### Running locally as Docker containers (linux)

```bash
sudo apt-get install -y docker-compose wget
wget https://github.com/datasci4health/harena-casemanager/blob/master/docker-compose.yml
sudo docker-compose up
```

### Running locally as Docker containers (windows)

//to do

### Running locally (linux)

First, clone this repository and enter the folder:

```bash
git clone https://github.com/datasci4health/harena-manager 
cd harena-manager
```
Then install the [adonis cli](https://adonisjs.com/docs/4.0/installation#_cli_tool) and other project dependencies<sup>1</sup>:

```bash
cd src/adonisjs                      # entering the source folder
sudo npm i npm                       # updating npm (just in case)
sudo npm i -g @adonisjs/cli          # installing adonis cli
npm install                          # installing dependencies based on the package.json file
cp .env.example .env                 # creating the .env file that will be used by adonis
``` 

Edit the .env file with your own [configuration](#Configuration). Then, run adonis:

```bash
adonis  serve --dev --debug  # adjust flags according to you needs<sup>2</sup>
```



<sup>1</sup> Make sure you have **node.js** and **npm** already installed (see [system requirements](#system-requirements) for more details).

<sup>2</sup> Run `adonis serve --help` for flag options.


## Detailed System Requirements

### For running as linux/windows Docker containers:

* [docker]()
* [docker-compose]()

### For running locally:

* [node.js >= 8.0.0]()
* [npm     >= 6.8.0]()
* [mysql   >= 5.7]() or [postgresql >= 7.0.0]()


#### NPM Dependencies/Packages

* [adonisjs 4.1.0](https://adonisjs.com/docs/4.1/i) <sup>3</sup>
* [adonisjs/ace ^5.0.2]()
* [adonisjs/bodyparser]()
* [adonisjs/auth]()
* [adonisjs/cors ^1.0.6]()
* [adonisjs/fold ^4.0.8]()
* [adonisjs/framework ^5.0.7]()
* [adonisjs/ignitor ^2.0.6]()
* [adonisjs/lucid ^5.0.4]()
* [moment 2.22.2]()
* [moment-timezone 0.5.21]()
* [pg 7.4.3]() 
* [mysql ^2.16.0]()


<sup>3</sup> In *api mode*. Please refer to [this repository](https://github.com/adonisjs/adonis-api-app) for more details or take a look at the `-api-only` directive in the [AdonisJS installation guide](https://adonisjs.com/docs/4.1/installation#_installing_adonisjs).

## Configuration

### Virtualenvs

#### AdonisJS Project (nodejs, moment)

* HOST= host ip/name
* PORT= host port
* NODE_ENV= dynamic behavior (production, development)
* APP_URL= allowed incomming URLS (e.g., http://${HOST}:${PORT} )
* CACHE_VIEWS= enable/disable caching (true || false)
* APP_KEY= app private key
* ENV_SILENT= enable/disable looking for a .env file (true || false)
* HASH_DRIVER=bcrypt
* MOMENT_LOCALE=pt-br

#### Service Database

* DB_CONNECTION= database (pg, maria, mysql, sqlite)
* DB_HOST= host/ipname
* DB_PORT= host port
* DB_USER= username
* DB_PASSWORD= password
* DB_DATABASE= target database
* DB_SEARCH_PATH= database schema (if supported -- e.g., postgresql)




## Contributing

### Branch organization (future CI/CD)
* **feature/< label >:**
    * new features.
* **development:**
    * Protected. Must use _pull request_ to merge new features.
* **master:**
    * Version running at http://cloud.lis.ic.unicamp.br/jacinto/latest .
    * Protected. Must use _pull request_ to merge evolutions of the _development_ branch.
* **tags:**
    * Are used for creating Dockerhub image versions at https://cloud.docker.com/u/datasci4health/repository/docker/datasci4health/jacinto-casemanager .    
