[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/datasci4health/harena-manager/blob/master/LICENSE)
[![Docker Automated](https://img.shields.io/docker/cloud/automated/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)
[![Docker Build](https://img.shields.io/docker/cloud/build/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)
[![Docker Pulls](https://img.shields.io/docker/pulls/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)
[![Docker Stars](https://img.shields.io/docker/stars/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)

# Harena Manager

[Harena](https://github.com/datasci4health/harena)'s API for managing users and clinical cases.

## Table of contents

<!-- MarkdownTOC autolink=true -->

- [Getting Started](#getting-started)
  - [Running locally - Linux](#running-locally---linux)
  - [Running as Docker containers - Linux](#running-as-docker-containers---linux)
- [Dependencies](#dependencies)
  - [System-wide](#system-wide)
  - [NPM packages](#npm-packages)
- [Configuration](#configuration)
  - [Virtual Envs - AdonisJS](#virtual-envs---adonisjs)
  - [Virtual Envs - Database](#virtual-envs---database)
- [Contributing](#contributing)
  - [Development Mode](#development-mode)
  - [Branch organization](#branch-organization)

<!-- /MarkdownTOC -->


## Getting Started

### Running locally - Linux

1. Installing system dependencies.
    
    1.1 Install [nodejs/npm](https://nodejs.org/en/download/):

    ```bash
    # Using Ubuntu
    curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # Using Debian, as root
    curl -sL https://deb.nodesource.com/setup_10.x | bash -
    apt-get install -y nodejs    
    ```
    1.2 Update npm (just in case):

    ```bash
    sudo npm i npm  
    ```
    


    1.3 Install [adonisjs](https://adonisjs.com/):

    ```bash
    sudo npm i -g @adonisjs/cli  
    ```

2. Clone this repository and enter the folder:

    ```bash
    git clone https://github.com/datasci4health/harena-manager 
    cd harena-manager
    ```

3. Move to the source folder and install the project dependencies (see the `package.json` file for more details):

    ```bash
    cd src/adonisjs                      
    npm install         
    ```

4. Create a .env file form the template and start the nodejs server:

    ```bash
    cp .env.local .env 
    adonis  serve --dev --debug  # adjust flags according to you needs
    ```


    Edit the .env file with your own [configuration](#Configuration). Then, run adonis again. Run `adonis serve --help` to see alternative options.

### Running as Docker containers - Linux

```bash
sudo apt-get install -y wget
wget https://github.com/datasci4health/harena-manager/blob/master/docker-compose.yml
sudo docker-compose up
```


## Dependencies

### System-wide

* [node.js >= 8.0.0]()
* [npm     >= 6.8.0]()
* [mysql   >= 5.7]() or [postgresql >= 7.0.0]()


### NPM packages

* [adonisjs 4.1.0](https://adonisjs.com/docs/4.1/i) <b><sup>1</sup></b>
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


<b><sup>1</sup></b> In *api mode*. Please refer to [this repository](https://github.com/adonisjs/adonis-api-app) for more details or take a look at the `-api-only` directive in the [AdonisJS installation guide](https://adonisjs.com/docs/4.1/installation#_installing_adonisjs).


## Configuration

### Virtual Envs - AdonisJS 

* HOST= host ip/name
* PORT= host port
* NODE_ENV= dynamic behavior (production, development)
* APP_URL= allowed incomming URLS (e.g., http://${HOST}:${PORT} )
* CACHE_VIEWS= enable/disable caching (true || false)
* APP_KEY= app private key
* ENV_SILENT= enable/disable looking for a .env file (true || false)
* HASH_DRIVER=bcrypt
* MOMENT_LOCALE=pt-br

### Virtual Envs - Database

* DB_CONNECTION= database (pg, maria, mysql, sqlite)
* DB_HOST= host/ipname
* DB_PORT= host port
* DB_USER= username
* DB_PASSWORD= password
* DB_DATABASE= target database
* DB_SEARCH_PATH= database schema (if supported -- e.g., postgresql)

## Contributing

### Development Mode



### Branch organization
* **feature/< github-issue >:**
    * new feature registered on the issue list https://github.com/datasci4health/harena-manager/issues.
* **development:**
    * Version running at http://harena.ds4h.org/development . 
    * Protected. Must use _pull request_ to merge new features.
* **master:**
    * Version running at http://harena.ds4h.org/latest .
    * Protected. Must use _pull request_ to merge evolutions of the _development_ branch.
* **tags:**
    * Are used for creating Dockerhub image versions at https://cloud.docker.com/u/datasci4health/repository/docker/datasci4health/harena-manager .    
