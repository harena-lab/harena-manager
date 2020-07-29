<a name="unreleased"></a>
## [Unreleased]

### Features
- 🎸 Auth mechanism with `refresh token`: From now on, `POST auth/login/` responds with a pair of `<<token, refresh token>>`. `refresh_token` must be used to re-signin the user
whose `token` was revoked by `harena-manager` server.
    
     ✅ Closes issue #70

- 🎸 Enable `logout` through endpoint `POST auth/logout`
- 🎸 Newly created REST endpoint `POST /admin/institution` for create a new institution
- 🎸 Newly created REST endpoints: `GET auth/quest/cases` and `GET play/quest/cases`
    
	 ✅ Closes: #71

- 🎸 Migrate database - Related issue: [#62](https://github.com/datasci4health/harena-manager/issues/23)
- 🎸 Share cases: Allows the author associate more contributors to her case
- 🎸 Auth: Implement adonis ACL to control roles and permissions - Closes issue: #40
- 🎸 Provide quest services 
     ✅ Closes issue #37

### Fix
- Error on delete case. Related issue: [#23](https://github.com/datasci4health/harena-manager/issues/23)
- Enable upload of .jpeg files

### Chore
- 🤖 dependency update: Apply suggestions made by dependabot alerts
- 🤖 docker: Provide a develop environment to be  used by collaborators team.
Thecontainer orchastrate the whole environment (harenamanager, database,
and database-ui).

### Docs
- ✏️ Add auth sequence diagram
- ✏️ Add a schema versioning mechanism. It keeps the track of 3 such files: schema.dia,
schema.pdf, schema.png. They are representations of the schema defined
on database/migrations. Schemas are located at https://github.com/datasci4health/harena-manager/tree/development/src/adonisjs/database/schema_design)
- ✏️ Added a CHANGELOG in the project.


<!-- ### Performance Improvements
- ⚡️ improvement on auth mechanism: Enable `logout` through the endpoint `POST auth/logout`
 -->
### Refactor
<!-- - 💡 improvements on REST endpoints: Refactoring code related to REST endpoints -->
- 💡 Implements hooks through `file.method`

### BREAKING CHANGE

`POST /case/list` was replaced by two new endpoints: `GET /cases` and
`GET /user/:id/cases`

<a name="v1.0.8"></a>
## [v1.0.8] - 2020-03-22

### Error
- There was an error connecting to http://localhost:10020/api/v1/quest.

### Feat
- 🎸 Provide quest services

<a name="v1.0.7"></a>
## [v1.0.7] - 2019-08-05
### Build
- **docker:** A docker image of develop environment avaivable

### Fix
- **artifact:** Enable upload of .jpeg files
- **artifact:** Fix error at artifact upload

<a name="v1.0.5"></a>
## [v1.0.5] - 2019-07-07
### Bug
- Error on delete case - [#23](https://github.com/datasci4health/harena-manager/issues/23)

### Docs
-  ✏️ Add a CHANGELOG.

<a name="v0.0.1"></a>
## v0.0.1 - 2019-04-15

[Unreleased]: https://github.com/datasci4health/harena-manager/compare/v1.0.11...HEAD
[v1.0.11]: https://github.com/datasci4health/harena-manager/compare/v1.0.10...v1.0.11
[v1.0.10]: https://github.com/datasci4health/harena-manager/compare/v1.0.9...v1.0.10
[v1.0.9]: https://github.com/datasci4health/harena-manager/compare/v1.0.8...v1.0.9
[v1.0.8]: https://github.com/datasci4health/harena-manager/compare/v1.0.7...v1.0.8
[v1.0.7]: https://github.com/datasci4health/harena-manager/compare/v1.0.6...v1.0.7
[v1.0.6]: https://github.com/datasci4health/harena-manager/compare/v1.0.5...v1.0.6
[v1.0.5]: https://github.com/datasci4health/harena-manager/compare/v1.0.4...v1.0.5
[v1.0.4]: https://github.com/datasci4health/harena-manager/compare/v1.0.3...v1.0.4
[v1.0.3]: https://github.com/datasci4health/harena-manager/compare/v1.0.1...v1.0.3
[v1.0.1]: https://github.com/datasci4health/harena-manager/compare/v1.0.2...v1.0.1
[v1.0.2]: https://github.com/datasci4health/harena-manager/compare/v1.0.0...v1.0.2
[v1.0.0]: https://github.com/datasci4health/harena-manager/compare/v0.1.0...v1.0.0
[v0.1.0]: https://github.com/datasci4health/harena-manager/compare/v0.0.1...v0.1.0
