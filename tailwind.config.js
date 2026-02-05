export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "black-primary": "#071026",
        "black-secondary": "#1E293B",
        "border-color": "#E9ECEF",

        "disabled-color": "#9AA6B2",

        "primary-color": "#FDA655",
        "primary-slight-color": "#FEE4CC",
        "primary-strong-color": "#FC7A03",

        "main-dark-color": "#222222",
        "main-gray-color": "#838383",
        "specific-icon-color": "#C4C4C4",
        "disabled-text-color": "#9DA3AE",

        "light-background-color": "#F5F5F5",
        "page-background-color": "#F8F9FB",
        "main-stroke-color": "#E9ECEF",

        "red-color": "#FF4C4C",
        "green-color": "#25C418",
        "blue-color": "#1B6BE4",
      },
    },
  },
  plugins: [],
}
