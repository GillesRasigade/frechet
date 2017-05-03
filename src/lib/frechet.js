const _ = require('lodash');

/**
 * Extract the dimension `dim` of the array
 *
 * @param {array} points
 * @param {integer} dim
 * @returns {array}
 */
function dim(points, dim) {
  return _.map(points, point => point[dim]);
}

/**
 * Compute the euclidean distance between a and b
 *
 * @param {array} a
 * @param {array} b
 * @returns {number}
 */
function d(a, b) {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
    Math.pow(a[1] - b[1], 2)
  );
}

/**
 * Regress the linear part between (i, t) and (X, T)
 *
 * @param {any} i
 * @param {any} t
 * @param {any} X
 * @param {any} T
 * @returns
 */
function regress(i, t, X, T) {
  return X[i] === X[i - 1] ? X[i] : X[i-1] +(t - T[i-1]) / (T[i] - T[i-1]) * (X[i] - X[i-1]);
}

/**
 * Normalize a time based array for a given time step
 *
 * @param {array} A
 * @param {array} B
 * @param {number} [step=0.1]
 * @returns {array}
 */
function timeNormalize(A, B, step = 0.1) {
  /**
   * @todo Refactor the combine them all
   */
  const tA = dim(A, 0);
  const tB = dim(B, 0);
  const xA = dim(A, 1);
  const xB = dim(B, 1);
  const yA = dim(A, 2);
  const yB = dim(B, 2);

  const minT = Math.max(Math.min(...tA), Math.min(...tB));
  const maxT = Math.min(Math.max(...tA), Math.max(...tB));

  const steps = [];
  const alpha = [];
  const beta = [];
  for (let t = minT; t < maxT; t+=step) {
    const iA = _.findIndex(tA, i => i > t);
    const iB = _.findIndex(tB, i => i > t);

    const xa = regress(iA, t, xA, tA);
    const ya = regress(iA, t, yA, tA);

    const xb = regress(iB, t, xB, tB);
    const yb = regress(iB, t, yB, tB);

    steps.push(t);
    alpha.push([xa, ya]);
    beta.push([xb, yb]);
  }

  return { t: steps, A: alpha, B: beta};
}

/**
 * Compute distances between points of A and B defined by `alpha(t)` and
 * `beta(t)`.
 *
 * @param {array} A [...[x, y]] positions array
 * @param {array} B [...[x, y]] positions array
 * @returns {array}
 */
function distances(A, B) {
  const distances = [];
  const len = A.length;

  for (let i = 0; i < len; i++) {
    let di = null;
    for (let j = 0; j < len; j++) {
      const dij = d(A[i], B[j]);
      if (di === null || di > dij) {
        di = dij;

        if (di === 0) {
          // no better candidate
          break;
        }
      }
    }

    distances.push(di);
  }

  return distances;
}

/**
 * Returns the minimal value of distances between points, exact Fréchet distance.
 *
 * @param {array} A [...[x, y]] positions array
 * @param {array} B [...[x, y]] positions array
 * @returns {array}
 */
function min(A, B) {
  return Math.min(...distances(A, B));
}

/**
 * Returns the maximal value of distances between points, exact Fréchet distance.
 *
 * @param {array} A [...[x, y]] positions array
 * @param {array} B [...[x, y]] positions array
 * @returns {array}
 */
function max(A, B) {
  return Math.max(...distances(A, B));
}

/**
 * Returns the mean value of distances between points.
 *
 * @param {array} A [...[x, y]] positions array
 * @param {array} B [...[x, y]] positions array
 * @returns {array}
 */
function mean(A, B) {
  return _.mean(distances(A, B));
}

module.exports = {
  distances,
  min,
  mean,
  max,

  timeNormalize,

  d,
  dim
};
