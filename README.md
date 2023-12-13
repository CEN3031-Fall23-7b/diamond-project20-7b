# CaSMM

> Computation and Science Modeling through Making

Cloud-based programming interface

![Deploy Staging](https://github.com/STEM-C/CaSMM/workflows/Deploy%20Staging/badge.svg)
![Deploy Production](https://github.com/STEM-C/CaSMM/workflows/Deploy%20Production/badge.svg)

<br/>

## Application

### `client` 
[client](/client#client) is the frontend of the application. It is powered by [React](https://reactjs.org/) and [Blockly](https://developers.google.com/blockly).

### `server`

[server](/server#server) is the web server and application server. It is powered by [Node](https://nodejs.org/en/) and [Strapi](https://docs-v3.strapi.io/developer-docs/latest/getting-started/introduction.html).

### `compile`

  [compile](/compile#compile) is an arduino compiler service. It is an unofficial fork of [Chromeduino](https://github.com/spaceneedle/Chromeduino).

<br/>

## Environments

> The project is divided into three conceptual environments.

### Development
#### Structure

The development environment is composed of five servers. The first one is run with the [Create React App](https://create-react-app.dev/docs/getting-started/) dev server. The later four are containerized with docker and run with [docker compose](https://docs.docker.com/compose/).

* `casmm-client-dev` - localhost:3000

* `casmm-server-dev` - localhost:1337/admin

* `casmm-compile-dev` 

* `casmm-db-dev` - localhost:5432

  > The first time the db is started, the [init_db.sh](/scripts/init_db.sh) script will run and seed the database with an environment specific dump. Read about Postgres initialization scripts [here](https://github.com/docker-library/docs/blob/master/postgres/README.md#initialization-scripts). To see how to create this dump, look [here](https://github.com/DavidMagda/CaSMM_fork_2023/blob/develop/scripts/readme.md).

* `casmm-compile_queue-dev`

#### Running

`casmm-client-dev`

1. Follow the [client](/client#setup) setup
2. Run `yarn start` from `/client`

`casmm-server-dev`, `casmm-compile-dev`, `casmm-db-dev`, and `casmm-compile_queue-dev`

1. Install [docker](https://docs.docker.com/get-docker/)

2. Run `docker compose up` from `/`

   > Grant permission to the **scripts** and **server** directories if you are prompted
   

### Staging

#### Structure

The staging environment is a Heroku app. It is composed of a web dyno, compile dyno, Heroku Postgres add-on, and Heroku Redis add-on.

* `casmm-staging` - [casmm-staging.herokuapp.com](https://casmm-staging.herokuapp.com/)
  * The web dyno runs `server`
  * The compile dyno runs `compile`

#### Running

`casmm-staging` is automatically built from the latest commits to branches matching `release/v[0-9].[0-9]`. Heroku runs the container orchestration from there.

### Production

#### Structure

The production environment is a Heroku app. It is composed of a web dyno, compile dyno, Heroku Postgres add-on, and Heroku Redis add-on.

* `casmm` - [www.casmm.org](https://www.casmm.org/)
  * The web dyno runs `server`
  * The compile dyno runs `compile`

#### Running

`casmm` is automatically built from the latest commits to `master`. Heroku runs the container orchestration from there.

<br/>

## Maintenance

All three components of the application have their own dependencies managed in their respective `package.json` files. Run `npm outdated` in each folder to see what packages have new releases. Before updating a package (especially new major versions), ensure that there are no breaking changes. Avoid updating all of the packages at once by running `npm update` because it could lead to breaking changes. 

### Strapi

This is by far the largest and most important dependency we have. Staying up to date with its [releases](https://github.com/strapi/strapi/releases) is important for bug/security fixes and new features. When it comes to actually upgrading Strapi make sure to follow the [migration guides](https://docs-v3.strapi.io/developer-docs/latest/update-migration-guides/migration-guides.html#v3-guides)!

<br/>

## CI/CD

All of the deployments and releases are handled automatically with [GitHub Actions](https://docs.github.com/en/actions). The workflows implement custom [Actions](https://github.com/STEM-C/CaSMM/actions) that live in the [auto](https://github.com/STEM-C/auto) repo.

<br/>

## Contributing

### Git Flow 

> We will follow this git flow for the most part — instead of individual release branches, we will have one to streamline staging deployment 

![Git Flow](https://nvie.com/img/git-model@2x.png)

### Branches

#### Protected

> Locked for direct commits — all commits must be made from a non-protected branch and submitted via a pull request with one approving review

- **master** - Production application

#### Non-protected

> Commits can be made directly to the branch

- **release** - Staging application
- **develop** - Working version of the application
- **feature/<`scaffold`>-<`feature-name`>** - Based off of develop
  - ex. **feature/cms-strapi**
- **hotfix/<`scaffold`>-<`fix-name`>** - Based off of master
  - ex. **hotfix/client-cors**

### Pull Requests

Before submitting a pull request, rebase the feature branch into the target branch to resolve any merge conflicts.

- PRs to **master** should squash and merge
- PRs to all other branches should create a merge commit

### New Features Implemented

Workspaces - Lesson View Updates/Features

> Workspace visible with view code replay visibility enabled and split screen enabled, simultaneous display of both sandbox and lesson view

![image](https://github.com/CEN3031-Fall23-7b/diamond-project20-7b/assets/109041590/99435307-1f1e-4601-8340-ce1a1126f8cc)
- Lesson pages can be loaded into the workspace and displayed in a viewing pane
- Lesson page can be viewed simultaneously side-by-side with the sandbox page
- View Code Replay button created that links to code replay
- Updated sandbox icons to have better responsiveness
- Lesson page properly displays and plays imbedded video replays


> Code Replay Screen (no replay has been loaded)

![image](https://github.com/CEN3031-Fall23-7b/diamond-project20-7b/assets/109041590/a9c0116d-f8e9-46bc-b2bd-1c4391ec848b)
![image](https://github.com/CEN3031-Fall23-7b/diamond-project20-7b/assets/109041590/0df91393-34e3-4f56-bc71-31cc27c9a4bc)
- Created typical features such as speed up, slow down, seek, play, pause, back, and forward for video playback
- Code replay video can be loaded under "Code Replay" box
- Logs section to display the code replay logs of the code changes


> Slider functionality displayed for split screen

![image](https://github.com/CEN3031-Fall23-7b/diamond-project20-7b/assets/109041590/095f738b-3126-4c31-91fe-638806b9ef95)
- Lesson page size can be adjusted/resized with a slider


> Workspace view with lesson view page closed

![image](https://github.com/CEN3031-Fall23-7b/diamond-project20-7b/assets/109041590/b2c6d920-748a-4d7f-bfa9-ca0c9d1d90b1)
- Lesson page can be opened and closed with a split screen button


> Lesson and Activity Editor view in content creator account for enabling split screen visibility to students for Boggart lesson, where checkbox is clicked

![image](https://github.com/CEN3031-Fall23-7b/diamond-project20-7b/assets/109041590/12a2d4a8-3be6-49f7-b947-3a1d36a2de41)
![image](https://github.com/CEN3031-Fall23-7b/diamond-project20-7b/assets/109041590/6543a1cc-b228-4d3c-bd42-da123c8dedf0)
- Split screen visibility button created to allow for the enabling or disabling of the split screen function in a given activity
- Code replay, if added, should allow for code replay visibility in a given activity; however not implemented as code replay functionality is not implemented within our project scope, thus unable to save and turn on code replay
- Updates backend of Strapi API to change boolean values for student_vis and replay_vis to then be called to change student view of workspace

> Updated Strapi API for Activities section to have new boolean values: student_vis & replay_vis

![image](https://github.com/CEN3031-Fall23-7b/diamond-project20-7b/assets/109041590/b7481974-2884-44fc-b9e7-d9413465937b)

> Workspace view when split screen functionality is disabled and code replay is not available

![image](https://github.com/CEN3031-Fall23-7b/diamond-project20-7b/assets/109041590/26b5147b-740d-49be-8262-3a5b66b676af)

> Workspace view when split screen functionality is disabled and code replay is available

![image](https://github.com/CEN3031-Fall23-7b/diamond-project20-7b/assets/109041590/2e13bff2-f1e4-4f6c-b15f-a0281e021803)

> Workspace view when split screen functionality is enabled and code replay is not available

![image](https://github.com/CEN3031-Fall23-7b/diamond-project20-7b/assets/109041590/ecf24dc0-f865-4aa0-9eac-6bd0e863d641)

#### Features Developed By
Raymond Chen, Ethan Cheung, Sebastian Deschler, Andy Millian, Sai Chandu Naru, and Natalie Sesodia


### Instructions to run and view Workspace - Lesson View updates

`casmm-server-dev`
1. Follow the [client](/client#setup) setup
2. Run `yarn start` from `/client`

`casmm-server-dev`, `casmm-compile-dev`, `casmm-db-dev`, and `casmm-compile_queue-dev`

1. Install [docker](https://docs.docker.com/get-docker/)

2. Run `docker compose up` from `/`

   > Grant permission to the **scripts** and **server** directories if you are prompted

3. Log in to [localhost:1337/admin/auth/login](http://localhost:1337/admin/auth/login) with the Strapi Super Admin account > Activities > Click any activity > check if student_vis and replay_vis are there
   > If student_vis and replay_vis are not visible on the page, go to Content-Types Builder click "ADD ANOTHER FIELD TO THIS COLLECTION TYPE" and add boolean fields student_vis and replay_vis

4. Log in to [localhost:3000/teacherlogin](http://localhost:3000/teacherlogin) with the Content Creator Account
5. Update any activity to enable split screen functionality
   - Ex. Click The Boggart, Check off "Visible to students", click next, click Activity 1, select "Split Screen Visible to Student"
6. Add Code Replay does not yet update the Strapi API to enable code replay, so go back to Activities collection in the Strapi API and manually turn on replay_vis to enable to display Code Replay functionality in workspace
   - Ex. Activities > ID 948 > Select Replay_vis "ON"

7. Log in to [localhost:3000](https://localhost:3000) under a student account and view activity workspace to see changes
   - Ex. Log into any Defense Against the Dark Arts student account (Join Code: 1997) > Select The Boggart: Activity 1
  
