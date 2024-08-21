# Contributw

- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Install](#install)
  - [Run](#run)
  - [Test](#test)
- [Code of Conduct](#code-of-conduct)
- [Commit Message Format](#commit-message-format)

---

## Getting Started

### Requirements

- Node.js >= 20 (with corepack enabled)

### Install

```sh
git clone --recursive https://github.com/ivangabriele/firept-workspace-sample.git
yarn
```

Updating submodules: `git submodule update --remote --merge` (when `workspace-sample/` has new remote commits).

### Run

```sh
yarn dev
```

### Test

- Unit tests: `yarn test:unit`
- Unit tests (watch mode): `yarn test:unit:watch`
- E2E tests: `yarn test:e2e`
- E2E tests (watch mode): `yarn test:e2e:watch`

## Code of Conduct

Help us keep this project open and inclusive. Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Commit Message Format

This repository follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification and in
particular the [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit).
