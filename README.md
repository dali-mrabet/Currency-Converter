# Currency Converter

EUR/USD converter app I made for a test. It shows exchange rates that update automatically and you can convert between the two currencies.

## Features

- Real-time rate that changes every 3 seconds
- Convert EUR to USD or USD to EUR
- Can set custom rate manually
- Shows last 5 conversions
- Responsive design

## How to run

Need Node.js installed first.

```bash
npm install
npm run dev
```

Open http://localhost:5173 in browser

Build:
```bash
npm run build
```

## How it works

Rate starts at 1.1 and randomly goes up/down every 3 seconds. 

You can set your own rate but it turns off automatically if the difference gets too big (more than 2%).

When you switch between EUR and USD, the converted amount becomes the new input.

## Tech used

- React
- TypeScript
- Vite
- CSS

## License

MIT
