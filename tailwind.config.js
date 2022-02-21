module.exports = {
  content: ['./index.html', './src/App.vue', './src/main.ts', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        stocks: {
          red: '#f56c6c',
          green: '#4eb61b'
        }
      }
    }
  },
  plugins: []
};
