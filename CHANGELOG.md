All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [6.0.2] - 2023-11-17
### Fixed
- TS errors when interface-based data is passed to an error that was not defined with any specific data shape
### Dev
- dev deps update, yarn replaced with pnpm

## [6.0.1] - 2023-06-23
### Dev
- readme update
- dev deps update

## [6.0.0] - 2023-05-09
### Added
- `normalize` 2nd parameter, to choose normalization mode
### Dev
- deps update

## [5.0.0] - 2023-02-23
### Added
- `extend` method, for easier extending
- `parent` property, for accessing parent error
- `ancestors` property, for accessing all ancestors
- `normalize` method, for easy normalization of invalid values
### Breaking
- do not clean stack traces by default
- removed freedom to instantiate errors with any order of arguments
### Changed
- README cleanup
- tutorials carefully rewritten
### Fixed
- all typescript issues requiring typecasting
- `name` property on created error classes
### Dev
- added unit tests
- fixed jest warning
- typesafety for extended classes - subclasses details data must be a subtype of parent type

## [4.1.3] - 2023-01-07
### Dev
- deps upgrade to stop security warnings

## [4.1.2] - 2021-08-14
### Fixed
- added CustomErrorConstructor type export
### Dev
- deep deps upgrade to stop security warnings

## [4.1.1] - 2021-07-01
### Dev
- deep deps upgrade to stop security warnings

## [4.1.0] - 2021-07-01
### Added
- typings: possibility to define details object shape
### Changed
- upgraded docs
### Dev
- library template update

## [4.0.5] - 2021-05-30
### Added
- CustomError type export

## [4.0.4] - 2021-05-27
### Fixed
- typings issue when recent changes caused problems with creating custom error using another error as base

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
