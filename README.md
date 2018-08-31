# QuizJS

Unofficial web app for Quiz. The app runs completely client-side in the user’s browser. Supports creating new accounts, playing and creating games.
To communicate with the official servers, the app needs a server side proxy script (due to CORS not being enabled): `proxy.cgi`.
The account information is stored in the browser’s localStorage.

Before building the app, create your own `settings.ts` file in `src/` by copying `settings.sample.ts`.

Build app:

    npm install
    npm run build

Copy the files in `dist/` to your webspace and open index.html in your browser.

## Develop
After first clone and after updating:

    npm install

Start watcher to compile ts and run dev webserver:

    npm start

## License

Copyright: AsamK 2018

Licensed under the GPLv3: http://www.gnu.org/licenses/gpl-3.0.html
