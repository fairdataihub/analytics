<div align="center">

<img src="https://freesvg.org/img/1653682897science-svgrepo-com.png" alt="logo" width="200" height="auto" />

<br />

<h1>Kombucha</h1>

<p>
A lightweight, open-source, and privacy-friendly app-usage tracking platform for tracking logs and events.
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

Kombucha Analytics is a lightweight, open-source, and privacy-friendly app-usage tracking platform tool that supports both logging logs and events, providing a comprehensive solution for all your usage tracking needs. With Kombucha Analytics, the only requirement is a MongoDB database, making it easy to integrate into your existing infrastructure.

The platform can be easily deployed on platforms like Vercel and Netlify, leveraging serverless functions for efficient operation. This flexibility allows you to seamlessly incorporate Kombucha Analytics into your preferred hosting environment.

Visualize your tracked data with the built-in frontend, which can be customized to suit your specific preferences. Gain valuable insights into user behavior and app performance without compromising on privacy.
Kombucha Analytics also offers advanced alert monitoring capabilities, ensuring proactive issue resolution based on tracked events. By promptly addressing any concerns in your app, you can deliver an exceptional user experience.

It is important to note that Kombucha is not intended for user or web tracking purposes. Rather, it operates as a REST web endpoint, allowing developers to intentionally store data from any source that accesses the internet. By default, Kombucha does not automatically track click events, page navigation, or similar user interactions. Developers must intentionally send this information if they wish to store it on the platform.
Choose Kombucha Analytics as your go-to solution for powerful, privacy-conscious, and user-friendly app usage tracking.


## Getting Started

### Prerequisites/Dependencies

[Node.js](https://nodejs.org/en/) (v18 or higher)

[Yarn package manager](https://yarnpkg.com/getting-started/install) (v1.22 or higher)

**Front-end Framework:** The front-end of the application is built with TypeScript and Next.js, which provides a fast and efficient way to develop modern web applications.

**Styling:** The app's UI is styled using Tailwind.css, a highly customizable CSS framework that enables rapid development and consistent design.

**Database:** MongoDB is used as the database for this project, providing a flexible and scalable solution for data storage.

**User Authentication:** The app authenticates users using OAuth2 and integrates with the GitHub API. This allows users to securely log in to the application using their GitHub credentials.


### Installing

To set up the project locally, follow these steps:

Clone the repository:
```bash
git clone https://github.com/fairdataihub/analytics.git
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
NEXTAUTH_SECRET
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
