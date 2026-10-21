import { test } from 'node:test';
import assert from 'node:assert/strict';
import {validateRequest} from '../src/lib/validations.ts';
const valid={company:'Demo company',description:'A summer campaign featuring local travel stories.',requirements:'Three short videos',date:'2026-12-01',budget:'500',notes:''};
test('accepts a complete request',()=>assert.deepEqual(validateRequest(valid,'2026-10-14'),{}));
test('rejects missing details and whitespace',()=>assert.equal(Object.keys(validateRequest({company:' ',description:' ',requirements:' ',date:'',budget:'',notes:''},'2026-10-14')).length,5));
test('rejects past dates and invalid budgets',()=>{for(const budget of ['0','-10','NaN','Infinity']){const errors=validateRequest({...valid,date:'2020-01-01',budget},'2026-10-14');assert.ok(errors.budget);assert.ok(errors.date)}});
test('permits today and fractional budgets',()=>assert.deepEqual(validateRequest({...valid,date:'2026-10-14',budget:'20.50'},'2026-10-14'),{}));
test('rejects malformed and impossible dates',()=>{for(const date of ['not-a-date','2027-02-30','2027-13-01'])assert.ok(validateRequest({...valid,date},'2026-10-14').date)});
