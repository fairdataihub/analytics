<div align="center">

<img src="https://freesvg.org/img/1653682897science-svgrepo-com.png" alt="logo" width="200" height="auto" />

<br />

<h1>Kombucha</h1>

<p>
A free and open-source analytics platform offering valuable insights as an alternative to Umami and Google Analytics. 🍄🚜🛖
</p>

<br />

<p>
  <a href="https://github.com/fairdataihub/analytic/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/fairdataihub/analytics.svg?style=flat-square" alt="contributors" />
  </a>
  <a href="https://github.com/fairdataihub/analytics/stargazers">
    <img src="https://img.shields.io/github/stars/fairdataihub/analytics.svg?style=flat-square" alt="stars" />
  </a>
  <a href="https://github.com/fairdataihub/analytics/issues/">
    <img src="https://img.shields.io/github/issues/fairdataihub/analytics.svg?style=flat-square" alt="open issues" />
  </a>
  <a href="https://github.com/fairdataihub/analytics/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/fairdataihub/analytics.svg?style=flat-square" alt="license" />
  </a>
</p>
   
<h4>
    <a href="#">Documentation</a>
  <span> · </span>
    <a href="#">Changelog</a>
  <span> · </span>
    <a href="https://github.com/fairdataihub/analytics/issues/">Report Bug</a>
  <span> · </span>
    <a href="#">Request Feature</a>
  </h4>
</div>

<br />

---

## Description

Kombucha is a specialized platform designed as an alternative to Umami and Google Analytics, providing a comprehensive solution for users within the FairdataiHub organization. It offers valuable insights and data-driven information to optimize application performance and usage. With robust sign-in and application-related capabilities, Kombucha serves as an all-in-one solution. Additionally, it incorporates event-based alert monitoring and combines logs and events into a unified platform. Kombucha aims to merge two products into one, creating a free and open-source platform that can be easily hosted on Netlify or Vercel. It is important to note that Kombucha is not intended for user or web tracking purposes. Rather, it operates as a REST web endpoint, allowing developers to intentionally store data from any source that accesses the internet. By default, Kombucha does not automatically track click events, page navigation, or similar user interactions. Developers must intentionally send this information if they wish to store it on the platform.

## Getting Started

### Prerequisites/Dependencies

[Node.js](https://nodejs.org/en/) (v18 or higher)

**Front-end Framework:** The front-end of the application is built with TypeScript and Next.js, which provides a fast and efficient way to develop modern web applications.

**Styling:** The app's UI is styled using Tailwind.css, a highly customizable CSS framework that enables rapid development and consistent design.

**Database:** MongoDB is used as the database for this project, providing a flexible and scalable solution for data storage.

**User Authentication:** The app authenticates users using OAuth2 and integrates with the GitHub API. This allows users to securely log in to the application using their GitHub credentials.


### Installing

To set up the project locally, follow these steps:

Clone the repository:
```bash
git clone [repository URL]
```

Install the required dependencies:
```bash
yarn install
```

Configure the OAuth2 authentication with the FairdataiHub organization's credentials (or your own Oauth2 credentials), and obtain the client ID and client secret.
Create a `.env.local` file in the root directory of the project and add the following environment variables:
```bash
MONGODB_URI
MONGODB_DBNAME
GITHUB_ID
GITHUB_SECRET
GITHUB_ORG
```

Start the application:
```bash
yarn dev
```

Access the application in your browser at http://localhost:3000

>**Note**:
>Signing in to the application requires a GitHub account that is a member of the FairdataiHub organization. To change to a different organization, update the `GITHUB_ORG` environment variable in the `.env.local` file.

### Contributing

<a href="https://github.com/fairdataihub/analytics/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=fairdataihub/analytics" />
</a>

If you are interested in reporting/fixing issues and contributing directly to the code base, please see [CONTRIBUTING.md](CONTRIBUTING.md) for more information on what we're looking for and how to get started.

For any developmental standards to follow, add them directly to the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## Issues and Feedback

To report any issues with the web application, suggest improvements, or request a new feature, please open a new issue via the [Issues](https://github.com/fairdataihub/analytics/issues) tab. Provide adequate information (browser, steps leading to error, screenshots) so we can help you efficiently.

## License

This work is licensed under
[MIT](https://opensource.org/licenses/mit). See [LICENSE](https://github.com/fairdataihub/analytics/blob/main/LICENSE) for more information.

<a href="https://fairdataihub.org/" >
  <img src="https://www.channelfutures.com/files/2017/04/3_0.png" height="30" />
</a>

## How to cite

If you are using this software or reusing the source code from this repository for any purpose, please cite:

```bash
    ADD Citation here
```

## Acknowledgements

This project is funded by the NIH under award number 1OT2OD032644. The content is solely the responsibility of the authors and does not necessarily represent the official views of the NIH.

Add any other acknowledgements here.

<br />

---

<br />

<div align="center">

<a href="https://fairdataihub.org/">
  <img src="https://fairdataihub.org/logo.svg" alt="logo" width="600" height="auto" />
</a>

</div>
