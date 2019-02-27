# jacinto-casemanager

[Jacinto](https://github.com/datasci4health/jacinto)'s API for managing users and clinical cases.


## System Requirements

**For running natively:**

* [node.js >= 8.0.0]()
* [npm     >= 6.8.0]()
* [mysql >= 5.7]() or [postgresql >= 7.0.0]()

**For running as linux/windows Docker containers:**

* [docker]()
* [docker-compose]()


### NPM Dependencies/Packages

* [adonisjs 4.1.0](https://adonisjs.com/docs/4.1/i) ***
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


*** In *api mode*. Please refer to [this repository](https://github.com/adonisjs/adonis-api-app) for more details or that a look at the `-api-only` directive in the [AdonisJS installation guide](https://adonisjs.com/docs/4.1/installation#_installing_adonisjs).

## Installation 

Please see the [system-requirements](#system-requirements).

```bash
sudo npm i npm # updating npm just in case
sudo npm i -g @adonisjs/cli

npm install  
``` 

## Running a local instance using Docker ()

```bash
sudo docker-compose --url https://github.com/datasci4health/jacinto/blob/master/docker-compose.yml up
```


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
