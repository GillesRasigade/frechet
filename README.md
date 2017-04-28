# Fréchet

Computes the [Fréchet distance](https://en.wikipedia.org/wiki/Fr%C3%A9chet_distance)
for 2 different paths.

## Time based paths

```js
/**
 * Array of time positions: t, x, y
 */
const tA = [[0, 0, 0], [0.25, 0, 0.75], [1, 0, 1]];
const tB = [[0, 0, 0], [0.5, 0, 0.5], [1, 0, 2]];

const normalized = frechet.timeNormalize(tA, tB);

const D = frechet.mean(normalized.A, normalized.B);
// 0.38787878787878777
```

## Mean Fréchet distance computation

```js
const alpha = t => 1 + 2 * t;
const fA = x => x * x;

const beta = t => 1 + 2 * t;
const fB = x => x;

tv = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
const A = _.map(tv, t => [alpha(t), fA(alpha(t))]);
const B = _.map(tv, t => [beta(t), fB(beta(t))]);

const D = frechet.mean(A, B);
// 2.4
```