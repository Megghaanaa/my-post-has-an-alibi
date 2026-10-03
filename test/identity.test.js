import test from 'node:test';
import assert from 'node:assert/strict';
import { extractIdentity } from '../src/identity.js';

// A made-up DID document in the same shape the AT Protocol uses.
const fakeDidDoc = {
  id: 'did:plc:examplefakeexamplefake',
  alsoKnownAs: ['at://alice.example.com'],
  verificationMethod: [
    {
      id: 'did:plc:examplefakeexamplefake#atproto',
      type: 'Multikey',
      controller: 'did:plc:examplefakeexamplefake',
      publicKeyMultibase: 'zFAKEKEYFORTESTINGONLY',
    },
  ],
  service: [
    {
      id: '#atproto_pds',
      type: 'AtprotoPersonalDataServer',
      serviceEndpoint: 'https://pds.example.com',
    },
  ],
};

test('extractIdentity finds the handle, signing key and PDS', () => {
  const identity = extractIdentity(fakeDidDoc);
  assert.equal(identity.did, 'did:plc:examplefakeexamplefake');
  assert.equal(identity.handle, 'alice.example.com');
  assert.equal(identity.signingKey.publicKeyMultibase, 'zFAKEKEYFORTESTINGONLY');
  assert.equal(identity.pds, 'https://pds.example.com');
});

test('extractIdentity copes with a document that has no key or service', () => {
  const identity = extractIdentity({ id: 'did:plc:empty' });
  assert.equal(identity.signingKey, null);
  assert.equal(identity.pds, null);
  assert.equal(identity.handle, null);
});
