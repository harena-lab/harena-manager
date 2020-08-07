[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/datasci4health/harena-manager/blob/master/LICENSE)
[![Docker Automated](https://img.shields.io/docker/cloud/automated/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)
[![Docker Build](https://img.shields.io/docker/cloud/build/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)
[![Docker Pulls](https://img.shields.io/docker/pulls/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)
[![Docker Stars](https://img.shields.io/docker/stars/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)


# Harena Manager

Harena's database management module
> It provides an api for data access

## Available end points

Check https://documenter.getpostman.com/view/7243662/T1Ds8ag7?version=latest to discover available endpoints provided by `harena manager api`.

## Getting Started

We provide a `docker container` to locally run `harena-manager` code. Containers guarantee the required minimal configuration to run the code. Read [docker](https://docs.docker.com/install/) e [docker-compose](https://docs.docker.com/compose/install/) documentations to install docker and learn further about containers.

#### Instructions (for Linux users)

Clone `harena-manager` repository, get into it, checkout `development` branch, and build the manager docker image:
```bash
git clone https://github.com/datasci4health/harena-manager.git
cd harena-manager
git checkout -b development
git pull origin development

docker build . -t manager
cd ..
```

Start up the docker container:

```bash
docker-compose -f docker-compose-dev.yml up
```

Once the start up process is done, access http://localhost:10020/ to check if the system is working.

If you want to get the command line of the container, then run the command:

```bash
docker exec -it harena-manager_harena-manager_1 bash
```

<!-- ## Dependencies

### System-wide

* [node.js >= 8.0.0]()
* [npm     >= 6.8.0]()
* [mysql   >= 5.7]() or [postgresql >= 7.0.0]()


### NPM packages

* [adonisjs 4.1.0](https://adonisjs.com/docs/4.1/i) <b><sup>1</sup></b>
* [adonisjs/ace ^5.0.8]()
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
-->

## Contributing

### Branch organization
* `master`:
    * Version running at http://harena.ds4h.org/latest .
    * Protected. Must use _pull request_ to merge evolutions of the _development_ branch.
* `development`:
    * Version running at http://harena.ds4h.org/development . 
    * Protected. Must use _pull request_ to merge new features.
* `feature/< github-issue >`:
    * new feature registered on the issue list https://github.com/datasci4health/harena-manager/issues.
* `bug/< github-issue >`:
    * new bugs registered on the issue list https://github.com/datasci4health/harena-manager/issues.
* `tags`:
    * Are used for creating Dockerhub image versions at https://cloud.docker.com/u/datasci4health/repository/docker/datasci4health/harena-manager .    

## Change log

Release updates can be found at [CHANGELOG.md](https://github.com/datasci4health/harena-manager/blob/development/CHANGELOG.md) file.
