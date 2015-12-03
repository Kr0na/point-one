import {arrayAppend, arrayPlace, arrayPrepend, arrayRemove, arrayReplace} from '../../src/index'

describe('Utils', () => {
    describe('Array', () => {
        it('should be able to append items', () => {
            let
                a = [1,2,3,4,5],
                b = arrayAppend(a, 6)
            b.should
                .have.length(6)
                .contains(6)
            b[5].should.equal(6)
        })
        it('should be able to place items', () => {
            let
                a = [1,2,4,5],
                b = arrayPlace(a, 3, 2)
            b.should
                .have.length(5)
                .contains(3)
            b[1].should.equal(2)
            b[3].should.equal(4)
        })
        it('should be able to prepend items', () => {
            let
                a = [2, 3, 4, 5],
                b = arrayPrepend(a, 1)
            b.should
                .have.length(5)
                .contains(1)
            b[0].should.equal(1)
            b[1].should.equal(2)
        })
        it('should be able to remove items', () => {
            let
                a = [1,2,3,4,5],
                b = arrayRemove(a, 2)
            b.should
                .have.length(4)
                .contains(2)
                .contains(4)
                .and.not.contains(3)
        })
        it('should be able to replace items', () => {
            let
                a = [1,2,6,4,5],
                b = arrayReplace(a, 2, 3)
            b.should
                .have.length(5)
                .contains(3)
                .contains(4)
                .and.not.contains(6)
            b[1].should.equal(2)
            b[2].should.equal(3)
            b[3].should.equal(4)
        })
    })
})
