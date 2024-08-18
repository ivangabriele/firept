<p align="center">
  <img alt="FirePT Logo" height="128" src="public/images/logo.png" />
</p>
<h1 align="center">FirePT</h1>
<h3 align="center">APIfy your project workspace, allowing AI to interact with it.</h3>

---

> [!NOTE]  
> This is a work in progress and is still under heavy testing. This doesn't work out of the box yet.

- [Introduction](#introduction)
- [Features](#features)
  - [Features](#features-1)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running FirePT](#running-firept)
- [Contributing](#contributing)

---

## Introduction

FirePT is designed to enhance the capabilities of AI LLMs that accepts API actions (like custom GPTs) by providing an
API to interact with the current working directory. It allows for performing various tasks like reading or editing
files, running shell commands, and more to come.

You'll need to publicly expose the local FirePT via a domain and a secure HTTPS. FirePT already integrates
[PublicHost](https://publichost.org) which does just that by tunneling your local server to a public domain with HTTPS.
PublicHost is fully open-source and can be self-hosted. You can also use other similar services like
[Ngrok](https://ngrok.com) or [LocalTunnel](https://localtunnel.github.io/www/).

## Features

### Features

All features can only be run within the declared project directory.

- [x] OpenAPI documentation
- [x] List files
- [x] Read files
- [x] Create files and directories
- [x] Edit files
- [x] Delete files and directories
- [x] Move (rename) files and directories
- [x] Run shell commands
- [ ] Local, per-project config file
- [ ] Read and comment Github issues
- [ ] Read and comment Github pull requests
- [ ] Partially read files (from line to line)
- [ ] Partially edit files (from line to line)
- [ ] Fine-grained feature control (to enable/disable features)

> [!IMPORTANT]  
> I'm not among AI-Will-Take-Over-The-World believers. However, the file created as well as the shell commands could
> definitely do whatever they want to your system. Carefully watch FirePT logs and generated source code.
>
> **A good practice is to run FirePT in a sandboxed environment (container, VM, etc.) and to never run it as root.**

## Getting Started

### Prerequisites

Before installing FirePT, ensure you have the following:

- Node.js (version 20 or later)
- npm (usually comes with Node.js)

### Installation

Install FirePT globally using npm:

```sh
npm i -g firept
```

### Running FirePT

To start the FirePT server, run:

```sh
firept
```

## Contributing

We welcome contributions to FirePT! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of
conduct and the process for submitting pull requests.

---
