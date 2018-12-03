import { expect } from 'chai';
import 'ts-node';
import 'mocha';

describe('#MyDummyTest', () => {
    it('sould convert be true!', () => {
        const result = true;
        expect(result).to.equal(true);
    });
    it('fails :-(', () => {
        const result = false;
        expect(result).to.equal(true);
    });
});