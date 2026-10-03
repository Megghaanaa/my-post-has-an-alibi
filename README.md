<p align="center">
  <img src="assets/icon.svg" width="120" alt="A Merkle tree with one leaf under a magnifying glass">
</p>

<h1 align="center">🕵️ My Post Has an Alibi</h1>

<p align="center">
  <em>Verifying a Bluesky post from scratch on the AT Protocol, in JavaScript.</em>
</p>

<p align="center">
  <img alt="status" src="https://img.shields.io/badge/status-work%20in%20progress-orange">
  <img alt="node" src="https://img.shields.io/badge/node-%3E%3D18-brightgreen">
  <img alt="javascript" src="https://img.shields.io/badge/made%20with-JavaScript-f7df1e">
  <img alt="dependencies" src="https://img.shields.io/badge/dependencies-none-blue">
</p>

> 🚧 **Work in progress** for a conference talk proposal. Not finished. The checklist below shows exactly what works and what doesn't.

## 🔍 The idea

When you post on Instagram, a company vouches that the post is yours, and you have to take its word for it.

On the AT Protocol, an account is a public repository, and one signed commit covers everything in it. This project follows one post from that repository down the tree to the signed commit, verifies the signature by hand, then changes one tiny thing and watches the signature stop matching.

## 🗺️ The investigation

1. **Grab the evidence.** Export a real account's repository as a single CAR file.
2. **Follow the trail.** Decode the records and walk the tree from the commit's root down to one post.
3. **Check the alibi.** Resolve the account's DID, find the signing key, and verify the commit signature myself.
4. **Tamper with the evidence.** Change one comma and watch the hashes, and the signature, fall apart.

## ✅ Status

- [x] Project set up
- [x] Offline tests for DID document parsing
- [ ] 🚧 Resolve a handle to its DID and read the signing key (script written, being tested against the live network)
- [ ] Export an account's repository as a CAR file
- [ ] Decode the records and read the signed commit
- [ ] Walk the tree down to one post
- [ ] Verify the commit signature
- [ ] Tamper with a record and show the signature break

## ▶️ Run it

Needs [Node.js](https://nodejs.org) 18 or newer. There are no dependencies to install.

```bash
git clone https://github.com/<your-username>/my-post-has-an-alibi.git
cd my-post-has-an-alibi

# Look up an account's identity, signing key, data server and latest post
node src/identity.js some-handle.bsky.social

# Run the offline tests
npm test
```

## 📁 What's here

| Path | What it does |
| --- | --- |
| `src/identity.js` | Handle → DID → DID document → signing key and data server, then fetches the latest post |
| `test/identity.test.js` | Offline tests for the DID document parsing |
| `assets/icon.svg` | The icon above |
| `package.json` | Project setup and scripts |

## 📚 Learn more

The official AT Protocol documentation lives at [atproto.com](https://atproto.com).

## 🧭 Notes

Personal project, made in my own time using public specs and public data.
