/** @type {import('tailwindcss').Config} */
export default {
  // Esta es la parte más importante:
  // Le dice a Tailwind qué archivos debe escanear
  // para encontrar las clases que estás usando.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Busca en todos los archivos de React dentro de src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}