#!/bin/sh

yarn cti create './src/@seedwork/application' -i '*spec.ts' -b &&
yarn cti create './src/@seedwork/domain' -i '*spec.ts' -e 'tests' -b &&
yarn cti create './src/@seedwork/infra' -i '*spec.ts' -b &&

yarn cti create './src/category/application' -i '*spec.ts' -b &&
yarn cti create './src/category/domain' -i '*spec.ts' -b &&
yarn cti create './src/category/infra' -i '*spec.ts' -b