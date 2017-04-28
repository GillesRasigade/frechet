const { expect } = require('chai');
const frechet = require('../../index');

describe('frechet', () => {
  describe('#dim', () => {
    it('returns the requested dimension', () => {
      expect(frechet.dim([[1, 2], [1, 2]], 1)).to.deep.equal([2, 2]);
    });
  });

  describe('#d', () => {
    it('computes the euclidean distance between 2 points', () => {
      expect(frechet.d([9, 0], [0, 0])).to.equal(9);
      expect(frechet.d([0, 9], [0, 0])).to.equal(9);
      expect(frechet.d([0, 0], [9, 0])).to.equal(9);
      expect(frechet.d([0, 0], [0, 9])).to.equal(9);

      expect(frechet.d([3, 0], [0, 4])).to.equal(5);
      expect(frechet.d([0, 3], [4, 0])).to.equal(5);

      expect(frechet.d([0, 3], [0, 3])).to.equal(0);
      expect(frechet.d([3, 0], [3, 0])).to.equal(0);
      expect(frechet.d([3, 3], [3, 3])).to.equal(0);
    });
  });

  describe('#timeNormalize', () => {
    it('normalizes time based array', () => {
      const tA = [[0, 0, 0], [0.25, 0, 0.75], [1, 0, 1]];
      const tB = [[0, 0, 0], [0.5, 0, 0.5], [1, 0, 2]];

      const { A, B } = frechet.timeNormalize(tA, tB);

      expect(A).to.deep.equal([
        [0, 0],
        [0, 0.30000000000000004],
        [0, 0.6000000000000001],
        [0, 0.7666666666666667],
        [0, 0.8],
        [0, 0.8333333333333334],
        [0, 0.8666666666666667],
        [0, 0.9],
        [0, 0.9333333333333333],
        [0, 0.9666666666666667],
        [0, 1]
      ]);

      expect(B).to.deep.equal([
        [0, 0],
        [0, 0.1],
        [0, 0.2],
        [0, 0.30000000000000004],
        [0, 0.4],
        [0, 0.5],
        [0, 0.7999999999999999],
        [0, 1.0999999999999999],
        [0, 1.4],
        [0, 1.6999999999999997],
        [0, 1.9999999999999996]
      ]);
    });

    it('normalizes time based array for a given step value', () => {
      const tA = [[0, 0, 0], [0.25, 0, 0.75], [1, 0, 1]];
      const tB = [[0, 0, 0], [0.5, 0, 0.5], [1, 0, 2]];

      const { A, B } = frechet.timeNormalize(tA, tB, 0.5);

      expect(A).to.deep.equal([ [ 0, 0 ], [ 0, 0.8333333333333334 ] ]);
      expect(B).to.deep.equal([ [ 0, 0 ], [ 0, 0.5 ] ]);
    });

    it('normalizes time based array with constant x', () => {
      const tA = [[0, 0, 0.75], [0.25, 0, 0.75], [1, 1, 1]];
      const tB = [[0, 0, 0], [0.5, 0, 1], [1, 1, 1]];

      const { A, B } = frechet.timeNormalize(tA, tB, 0.5);

      expect(A).to.deep.equal([ [ 0, 0.75 ], [ 0.3333333333333333, 0.8333333333333334 ] ]);
      expect(B).to.deep.equal([ [ 0, 0 ], [ 0, 1 ] ]);
    });
  });

  describe('#distances', () => {
    it('returns 0 array for equal lines', () => {
      expect(frechet.distances([[0, 0], [1, 1]], [[0, 0], [1, 1]]))
        .to.deep.equal([0, 0]);
    });

    it('returns distances array for lines of different values', () => {
      expect(frechet.distances([[0, 1], [1, 3]], [[0, 0], [1, 1]]))
        .to.deep.equal([1, 2]);
    });

    it('returns array of intersection between A and B', () => {
      expect(frechet.distances([[-1, -1], [0, 1], [1, 1]], [[-1, -1], [0, 0], [1, 1]]))
        .to.deep.equal([0, 1, 0]);
    });

    it('returns array of intersection between A and B with constant on x', () => {
      expect(frechet.distances([[0, 1], [0, 1]], [[0, 0], [0, 1]]))
        .to.deep.equal([1, 0]);
    });
  });

  describe('#min', () => {
    it('returns the min of distances array', () => {
      expect(frechet.min([[0, 0], [1, 1]], [[0, 0], [1, 1]]))
        .to.equal(0);
      expect(frechet.min([[0, 1], [1, 3]], [[0, 0], [1, 1]]))
        .to.equal(1);
    });
  });

  describe('#mean', () => {
    it('returns the min of distances array', () => {
      expect(frechet.mean([[0, 0], [1, 1]], [[0, 0], [1, 1]]))
        .to.equal(0);
      expect(frechet.mean([[0, 1], [1, 3]], [[0, 0], [1, 1]]))
        .to.equal(1.5);
    });
  });
});