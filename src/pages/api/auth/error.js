export default function accessDenied(req, res) {
  const { error } = req.query;
  console.log(error);

  if (error === 'AccessDenied') {
    res.status(401).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Access Denied</title>
        <!-- Include the tailwind styles here -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
      </head>
      <body class="bg-gray-100">
        <div class="container mx-auto p-4">
          <h1 class="text-4xl font-bold text-gray-800 mb-8">Access Denied</h1>
          <p class="text-lg text-gray-700 mb-4">
            You are not authorized to access this page.
          </p>
          <a href="/" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Return Home
          </a>
        </div>
      </body>
    </html>
    `);
  } else {
    // Handle other error codes or return a default error page
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Error</title>
          <link rel="stylesheet" href="https://cdn.tailwindcss.com" />
        </head>
        <body class="bg-gray-100 h-screen flex flex-col justify-center items-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Error</h1>
          <p class="text-lg text-gray-700 mb-8">Something went wrong.</p>
        </body>
      </html>
    `);
  }
}