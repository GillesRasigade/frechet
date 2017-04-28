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
 * @returns
 */
function d(a, b) {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
    Math.pow(a[1] - b[1], 2)
  );
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
   * Refactor the combine them all
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

    const xa = xA[iA] === xA[iA - 1] ? xA[iA] : xA[iA-1] +(t - tA[iA-1]) / (tA[iA] - tA[iA-1]) * (xA[iA] - xA[iA-1]);
    const ya = yA[iA] === yA[iA - 1] ? yA[iA] : yA[iA-1] +(t - tA[iA-1]) / (tA[iA] - tA[iA-1]) * (yA[iA] - yA[iA-1]);

    const xb = xB[iB] === xB[iB - 1] ? xB[iB] : xB[iB-1] +(t - tB[iB-1]) / (tB[iB] - tB[iB-1]) * (xB[iB] - xB[iB-1]);
    const yb = yB[iB] === yB[iB - 1] ? yB[iB] : yB[iB-1] +(t - tB[iB-1]) / (tB[iB] - tB[iB-1]) * (yB[iB] - yB[iB-1]);

    steps.push(t);
    alpha.push([xa, ya]);
    beta.push([xb, yb]);
  }

  return { t: steps, A: alpha, B: beta};
}

function distances(A, B) {
  const distances = [];
  const len = A.length;

  for (let i = 0; i < len; i++) {
    distances.push(d(A[i], B[i]));
  }

  return distances;
}

function min(A, B) {
  return Math.min(...distances(A, B));
}

function mean(A, B) {
  return _.mean(distances(A, B));
}

module.exports = {
  distances,
  min,
  mean,

  timeNormalize,

  d,
  dim
};
