// Step 1 of "My Post Has an Alibi":
// who is this account, and which key is allowed to sign for it?
//
// Plain Node 18+ (built-in fetch). No dependencies.
// Usage: node src/identity.js some-handle.bsky.social

import { fileURLToPath } from 'node:url';

const HANDLE_RESOLVER = 'https://bsky.social';
const PLC_DIRECTORY = 'https://plc.directory';

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

// handle -> DID (the account's permanent identity)
export async function resolveHandle(handle, resolver = HANDLE_RESOLVER) {
  const clean = handle.replace(/^@/, '').trim();
  const url = `${resolver}/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(clean)}`;
  const { did } = await getJson(url);
  return did;
}

// DID -> DID document (lists the signing key and where the account's data lives)
export async function fetchDidDocument(did) {
  if (did.startsWith('did:plc:')) {
    return getJson(`${PLC_DIRECTORY}/${did}`);
  }
  if (did.startsWith('did:web:')) {
    const host = decodeURIComponent(did.slice('did:web:'.length));
    return getJson(`https://${host}/.well-known/did.json`);
  }
  throw new Error(`Unsupported DID method: ${did}`);
}

// Pull out the two things the investigation needs from a DID document.
export function extractIdentity(didDoc) {
  const keyEntry = (didDoc.verificationMethod ?? []).find((vm) => vm.id?.endsWith('#atproto'));
  const pdsEntry = (didDoc.service ?? []).find((s) => s.id?.endsWith('#atproto_pds'));
  const handleEntry = (didDoc.alsoKnownAs ?? []).find((a) => a.startsWith('at://'));

  return {
    did: didDoc.id,
    handle: handleEntry ? handleEntry.slice('at://'.length) : null,
    signingKey: keyEntry
      ? { type: keyEntry.type, publicKeyMultibase: keyEntry.publicKeyMultibase }
      : null,
    pds: pdsEntry?.serviceEndpoint ?? null,
  };
}

// Ask the account's own server for its most recent post (the "suspicious post").
export async function latestPost(pds, did) {
  const url =
    `${pds}/xrpc/com.atproto.repo.listRecords` +
    `?repo=${encodeURIComponent(did)}&collection=app.bsky.feed.post&limit=1`;
  const { records } = await getJson(url);
  return records?.[0] ?? null;
}

async function main() {
  const handle = process.argv[2] ?? 'bsky.app';

  console.log(`Case file: ${handle}\n`);

  const did = await resolveHandle(handle);
  console.log(`Identity (DID):   ${did}`);

  const identity = extractIdentity(await fetchDidDocument(did));
  console.log(`Data lives at:    ${identity.pds}`);
  console.log(`Signing key:      ${identity.signingKey?.publicKeyMultibase ?? 'not found'}`);
  console.log(`Key type:         ${identity.signingKey?.type ?? 'n/a'}`);

  const post = await latestPost(identity.pds, did);
  console.log('\nThe suspicious post:');
  console.log(post ? `  ${post.uri}\n  "${post.value?.text ?? ''}"` : '  (no posts found)');
}

// Run only when started from the command line, not when imported by tests.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(`Investigation failed: ${err.message}`);
    process.exit(1);
  });
}
