'use strict'

const expect = require('chai').expect;
const mgca = require('../src/align.js')

describe('Test suite for align.js', function() {
    describe('alignTwo', function() {
        it('1) Aligning two empty sequences', function() {
            let result = mgca.alignTwo([[],[]])
            expect(result).eql({clusterMatrix: [[],[]], score: 0})
        })
        it('2) Aligning two identical sequences', function() {
          let result = mgca.alignTwo([[1,2,3,4],[1,2,3,4]])
          expect(result).eql({clusterMatrix: [[1,2,3,4],[1,2,3,4]], score: 12})
        })
        it('3) Aligning two sequences where first is empty', function() {
          let result = mgca.alignTwo([[],[1,2,3,4,5]])
          expect(result).eql({clusterMatrix: [['-','-','-','-','-'],[1,2,3,4,5]], score: -10})
        })
        it('4) Aligning two sequences where second is empty', function() {
          let result = mgca.alignTwo([[1,2,3,4,5],[]])
          expect(result).eql({clusterMatrix: [[1,2,3,4,5],['-','-','-','-','-']], score: -10})
        })
        it('5) Aligning two completely different sequences', function() {
          let result = mgca.alignTwo([[1,2,3],[4,5,6,7]])
          expect(result).eql({clusterMatrix: [[1,2,3, '-'],[4,5,6,7]], score: -2})
        })
        it('6) Aligning same two sequences as test 5 except switched', function() {
          let result = mgca.alignTwo([[4,5,6,7],[1,2,3]])
          expect(result).eql({clusterMatrix: [[4,5,6,7],[1,2,3,'-']], score: -2})
        })
        it('7) Aligning two longer sequences requiring gaps and matches', function() {
          let result = mgca.alignTwo([[1,2,3,3,4,5,6,7],[1,8,8,2,3,3,4,6,5,6,7]])
          expect(result).eql({clusterMatrix:[[1,'-','-',2,3,3,4,'-',5,6,7],[1,8,8,2,3,3,4,6,5,6,7]],score: 18})
        })
    })
})
