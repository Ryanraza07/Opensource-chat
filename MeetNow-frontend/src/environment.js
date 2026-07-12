// Vite exposes env flags on import.meta.env instead of process.env in the browser.
const server = import.meta.env.PROD
    ? 'https://apnacollegebackend.onrender.com'
    : 'http://localhost:8000'

export default server;
