# My Post Has an Alibi

Verifying a Bluesky post from scratch on the AT Protocol, in JavaScript.

Work in progress for a conference talk proposal. Not finished, and the checklist below shows exactly what works and what doesn't.

## The idea

On the AT Protocol, an account is a public repository. I want to follow one post from the repository down the tree to the signed commit, verify the signature myself, then change one tiny thing and watch the signature stop matching.

## Status

- [x] Project set up
- [ ] Resolve a handle to its DID and read the signing key from the DID document
- [ ] Export an account's repository as a CAR file
- [ ] Decode the records and read the signed commit
- [ ] Walk the tree down to one post
- [ ] Verify the commit signature
- [ ] Tamper with a record and show the signature break

## Run it

(Added as soon as the first script works.)

## Notes

Personal project, made in my own time using public specs and public data.
