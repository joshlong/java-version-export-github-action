#!/usr/bin/env bash

npm --global install  "@vercel/ncc"  
ncc build index.js --license licenses.txt

VERSION=$((`cat VERSION`+1))
echo $VERSION > VERSION
echo $VERSION

git add *
git commit -m "updating..."
git tag -a -m "My first action release" v${VERSION}
git push --follow-tags




