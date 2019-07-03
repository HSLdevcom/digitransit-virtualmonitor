#!/bin/bash
ORG=${ORG:-hsldevcom}
DOCKER_IMAGE=digitransit-virtualmonitor

DOCKER_TAG="ci-${TRAVIS_BRANCH}-${TRAVIS_COMMIT}"
# Set these environment variables
#DOCKER_USER=
#DOCKER_AUTH=

function tagandpush {
  docker tag $ORG/$DOCKER_IMAGE:$DOCKER_TAG $ORG/$DOCKER_IMAGE:$1
  docker push $ORG/$DOCKER_IMAGE:$1
}

if [ "$TRAVIS_PULL_REQUEST" = "false" ]; then
  docker login -u $DOCKER_USER -p $DOCKER_AUTH
  echo "processing master build $TRAVIS_COMMIT"
  #master branch, build and tag as latest
  docker build --tag="$ORG/$DOCKER_IMAGE:$DOCKER_TAG" .
  docker push $ORG/$DOCKER_IMAGE:$DOCKER_TAG
  tagandpush $TRAVIS_BRANCH
else
  echo "processing pr $TRAVIS_PULL_REQUEST"
  docker build --tag="$ORG/$DOCKER_IMAGE:$DOCKER_TAG" .
fi
