const { expect } = require('chai');
const frechet = require('../../index');

describe('functional', () => {
  describe('cos vs sin', () => {
    const N = 10;
    const cos = [];
    const sin = [];

    before(() => {
      for (let i = 0; i < N; i++) {
        const c = Math.cos(i / N * Math.PI / 180);
        const s = Math.sin(i / N * Math.PI / 180);
        cos.push([i, c, s]);
        sin.push([i, s, c]);
      }
    });

    it('computes the cos vs sin distance correctly', () => {
      const { A, B } = frechet.timeNormalize(cos, sin, 0.1);
      const d = frechet.max(A, B);

      expect(d).to.equal(1.4030628515417114); // ~ sqrt(1+1);
    });
  });
});