[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/datasci4health/harena-manager/blob/master/LICENSE)
[![Docker Automated](https://img.shields.io/docker/cloud/automated/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)
[![Docker Build](https://img.shields.io/docker/cloud/build/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)
[![Docker Pulls](https://img.shields.io/docker/pulls/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)
[![Docker Stars](https://img.shields.io/docker/stars/datasci4health/harena-manager.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-manager)


# Harena Manager

Harena's backend module.

Check [Harena Docs Repository](https://github.com/datasci4health/harena-docs/tree/master/manager) to get documentation

## Available Services

Check https://documenter.getpostman.com/view/12184223/TzK2ZE4d to discover available endpoints provided by `harena manager api`.

## Getting Started

We provide a `docker container` to locally run `harena-manager` code. Containers guarantee the required minimal configuration to run the code. Read [docker](https://docs.docker.com/install/) e [docker-compose](https://docs.docker.com/compose/install/) documentations to install docker and learn further about containers.

> In order to execute `docker` without `sudo`, read this link: https://docs.docker.com/engine/install/linux-postinstall/, which shows another optional and valuable configurations in docker environment.

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
## Contributing

### Branch organization
* `master`:
    * The code used by our production cloud server: http://harena.ds4h.org/
    * Protected. Must use _pull request_ to merge evolutions from _development_ branch
* `development`:
    * The latest code contaning the most recent updates made by the development team
    * [Changelog file](https://github.com/datasci4health/harena-manager/blob/development/CHANGELOG.md) show unreleased features which will be merged into `master` from `development` branch in the next release
    * Version running at http://harena.ds4h.org/development .
    * Protected. Must use _pull request_ to merge new features.
<!--* `feature/< github-issue >`:
    * new feature registered on the issue list https://github.com/datasci4health/harena-manager/issues.
 * `bug/< github-issue >`:
    * new bugs registered on the issue list https://github.com/datasci4health/harena-manager/issues.
* `tags`:
    * Are used for creating Dockerhub image versions at https://cloud.docker.com/u/datasci4health/repository/docker/datasci4health/harena-manager .    
-->

## Change log

Release updates can be found at [CHANGELOG.md file](https://github.com/datasci4health/harena-manager/blob/development/CHANGELOG.md).
