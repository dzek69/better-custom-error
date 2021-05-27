All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [4.0.3] - 2021-05-27
### Fixed
- typings issue when instanceof with custom error would narrow to Error

## [4.0.2] - 2021-05-27
### Fixed
- typings issue when `details` and other props were unrecognized on custom errors

## [4.0.1] - 2021-04-15
### Fixed
- possible fix for TypeScript issues when using library, see: https://github.com/microsoft/TypeScript/issues/15300
### Dev
- some deps version bump

## [4.0.0] - 2021-02-15
### Added
- TypeScript support
### Fixed
- cleaning up stack traces for newer Node versions
### Changed
- named exports instead of default
- default options are now changed via function instead of overriding property of createError

## [3.0.1] - 2020-03-13
### Fixed
- CommonJS fallback
### Changed
- better support for native ESM

## [3.0.0] - 2020-03-12
### Changed
- library is now native ESM with CommonJS fallback

## [2.0.1] - 2020-02-28
### Fixed
- `dist` directory was missing from npm

## [2.0.0] - 2018-11-06
### Changed
- `dist` directory now contains code transpiled for > 3% browsers
### Fixed
- audit warnings by upgrading dev deps

## [1.0.0] - 2018-11-06
### Added
- first version
