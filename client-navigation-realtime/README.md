# Client navigation realtime experiment

## Debugging
To debug against a local checkout of the sdk:

```
## to run dev
DIR=$PWD; (cd ~/rw/sdk/sdk && pnpm debug:sync $DIR --dev)

## to build
DIR=$PWD; (cd ~/rw/sdk/sdk && pnpm debug:sync $DIR --build)
```