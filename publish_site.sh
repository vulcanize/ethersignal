#!/bin/bash

# !!!!!!!!!!
# !!DANGER!! This script publishes whatever branch you're in to gh-pages
# !!!!!!!!!!

# if [ "$#" -ne 1 ]
# then
#   echo "Usage: please specify branch"
#   exit 1
# fi

BRANCH=`git rev-parse --abbrev-ref HEAD`
echo "stashing current branch, 'git stash pop' after push to retrieve."
git stash save -u

git checkout gh-pages -f 
git rm `git ls-tree -r HEAD --name-only | grep -v .git`

mv dist/* .
rm -rf dist

git add .
VERSION=`git rev-parse $BRANCH`
echo "Making commit..."
git commit -m"From branch $BRANCH commit $VERSION"
git push origin HEAD
