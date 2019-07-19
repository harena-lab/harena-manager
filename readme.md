[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/datasci4health/harena-manager/blob/master/LICENSE)
[![Docker Automated](https://img.shields.io/docker/cloud/automated/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)
[![Docker Build](https://img.shields.io/docker/cloud/build/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)
[![Docker Pulls](https://img.shields.io/docker/pulls/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)
[![Docker Stars](https://img.shields.io/docker/stars/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)

# harena-manager

[Harena](https://github.com/datasci4health/harena)'s API for managing users and clinical cases.

## Table of Contents 


  * [Table of Contents](#table-of-contents)
  * [Getting Started](#getting-started)
     * [Running as a Docker container - Linux](#running-as-docker-containers---linux)
     * [Running locally - Linux](#running-locally---linux)
  * [System Requirements](#system-requirements)
     * [For running as Docker containers](#for-running-as-linuxwindows-docker-containers)
     * [For running locally](#for-running-locally)
  * [Configuration](#configuration)
     * [Virtualenvs: AdonisJS](#virtualenvs-adonisjs)
     * [Virtualenvs: Database](#virtualenvs-database)
  * [Contributing](#contributing)
     * [Project organization](#project-organization)
     * [Branch organization (future CI/CD)](#branch-organization-future-cicd)
  * [Available REST Calls](#rest-calls) 
     * [Authentication](#project-organization)
     * [Cases](#project-organization)
     * [Models](#project-organization)
     * [Templates](#project-organization)
   

## Getting Started

### Running as a Docker container - Linux

At the root of the project folder ```harena-manager/```, run the command to start the docker container:

```bash
docker-compose up
```

After starting the container, go to http://localhost:10010/ to see the welcome page.
```

<small> Make sure you have **docker-compose** and **docker** already installed on your system (see [system requirements](#system-requirements) for more details). </small>

### Running locally - Linux

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
sudo npm install                     # installing dependencies based on the package.json file
cp .env.example .env                 # creating the .env file that will be used by adonis
``` 

Edit the .env file with your own [configuration](#Configuration). Then, run adonis<sup>2</sup>:

```bash
adonis  serve --dev --debug  # adjust flags according to you needs
```

<b><sup>1</sup></b> Make sure you have **node.js** and **npm** already installed (see [system requirements](#system-requirements) for more details).

<b><sup>2</sup></b> Run `adonis serve --help` to see alternative flag options.

## System Requirements

### For running as Docker containers

* [docker]()
* [docker-compose]()

### For running locally

##### System dependencies

* [node.js >= 8.0.0]()
* [npm     >= 6.8.0]()
* [mysql   >= 5.7]() or [postgresql >= 7.0.0]()


##### NPM packages<sup>4</sup> 

* [adonisjs 4.1.0](https://adonisjs.com/docs/4.1/i) <b><sup>3</sup></b>
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


<b><sup>3</sup></b> In *api mode*. Please refer to [this repository](https://github.com/adonisjs/adonis-api-app) for more details or take a look at the `-api-only` directive in the [AdonisJS installation guide](https://adonisjs.com/docs/4.1/installation#_installing_adonisjs).

<b><sup>4</sup></b> Stored in the `src/adonisjs/package.json` file.

## Configuration

### Virtualenvs: AdonisJS 

* HOST= host ip/name
* PORT= host port
* NODE_ENV= dynamic behavior (production, development)
* APP_URL= allowed incomming URLS (e.g., http://${HOST}:${PORT} )
* CACHE_VIEWS= enable/disable caching (true || false)
* APP_KEY= app private key
* ENV_SILENT= enable/disable looking for a .env file (true || false)
* HASH_DRIVER=bcrypt
* MOMENT_LOCALE=pt-br

### Virtualenvs: Database

* DB_CONNECTION= database (pg, maria, mysql, sqlite)
* DB_HOST= host/ipname
* DB_PORT= host port
* DB_USER= username
* DB_PASSWORD= password
* DB_DATABASE= target database
* DB_SEARCH_PATH= database schema (if supported -- e.g., postgresql)


## Contributing

### Project organization

//to do

### Branch organization (future CI/CD)
* **feature/< label >:**
    * new features.
* **development:**
    * Protected. Must use _pull request_ to merge new features.
* **master:**
    * Version running at http://cloud.lis.ic.unicamp.br/harena/latest .
    * Protected. Must use _pull request_ to merge evolutions of the _development_ branch.
* **tags:**
    * Are used for creating Dockerhub image versions at https://cloud.docker.com/u/datasci4health/repository/docker/datasci4health/harena-manager .    

## REST Calls

### Authentication
* **Register User**
   * **URL:**    `/api/v1/auth/register`
   * **Method:**  `POST`
   *  **Required POST Params:**
      * `username=[string]`
      * `email=[string]`
      * `password=[string]`
   * **Success Response:**
      * **Code:** 200 <br />
        **Content:** User json created <br />
   * **Error Responses:**
     * **Code:** `409 Dup_entry` <br />
       **Troubleshooting:** Username or email not available
* **Login**
   * **URL:**    `/api/v1/auth/login`
   * **Method:**  `POST`
   *  **Required body Params:**
      * `email=[string]`
      * `password=[string]`
   * **Success Response:**
      * **Code:** 200 <br />
        **Content:** JSON user that has a _token_, which must be sent in the Authorization field of the header of every rest call that requires authentication, in the following format: Bearer [token jwt string] <br />  
   * **Error Responses:**
     * **Code:** `409 Dup_entry` <br />
       **Troubleshooting:** Username or email not available
### Users
* **User List**
   * **URL:**    `/api/v1/user/`
   * **Method:**  `GET`
   * **Success Response:**
      * **Code:** 200 <br />
        **Content:** User json created <br />
   * **Error Responses:**
     * **Code:** `409 Dup_entry` <br />
       **Troubleshooting:** Username or email not available
* **Get User**
   * **URL:**    `/api/v1/user/:id`
   * **Method:**  `GET`
   * **Success Response:**
      * **Code:** 200 <br />
        **Content:** User json created <br />
   * **Error Responses:**
     * **Code:** `409 Dup_entry` <br />
       **Troubleshooting:** Username or email not available
* **Update User**
   * **URL:**    `/api/v1/user1/:id`
   * **Method:**  `PUT`
   *  **Optional body Params:**
      * `username=[string]`
      * `email=[string]`
      * `password=[string]`
   * **Success Response:**
   * **Error Responses:**
* **Delete User**
   * **URL:**    `/api/v1/user/:id`
   * **Method:**  `DELETE`
   * **Success Response:**
   * **Error Responses:**
* **Get cases created by a user**
   * **URL:**    `/api/v1/user/:id/cases`
   * **Method:**  `GET`
   * **Success Response:**
      * **Content:** List of cases{title, description, created_at} <br />
   * **Error Responses:**

### Cases
* **New Case**
   * **URL:**    `/api/v1/cases/new`
   * **Method:**  `POST`
   * **Success Response:**
   * **Error Responses:**
* **Save Case**
   * **URL:**    `/api/v1/cases/`
   * **Method:**  `POST`
   *  **Required body Params:**
      * `caseName=[string]`
      * `caseText=[string]`
   * **Success Response:**
   * **Error Responses:**
* **New Case**
   * **URL:**    `/api/v1/cases/new`
   * **Method:**  `POST`
   * **Success Response:**
   * **Error Responses:**
   
### Models 
### Templates 
