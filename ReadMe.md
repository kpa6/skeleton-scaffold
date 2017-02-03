# A skeleton starting point

Intended as a basic scaffold for static sites that includes:

- Pug (Jade) templating
- Clean URL generation based on folder stucture within `src/pages`
- SASS pipeline
- Javascript pipeline
- Static site deployment pipeline to Netlify


## Development

After forking this repo, install the dependencies with NPM.

`npm install`

### Run development build

This compiles the site, serves it on a local web server and recompiles if it sees code changes

`gulp dev` or `gulp`


### Deploy

- `gulp build` To generate a production build
- `netlify deploy` To push the build output to Netlify

Continuous deployments can be set up by linking the git repo for the project to a site in Neltify and then deplying via

`git push`
