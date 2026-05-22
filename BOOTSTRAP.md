# Bootstrap instructions — `gtin-checksum`

This folder is a complete, tested, build-passing npm package. Below is the **minimal sequence** to take it from this scratchpad to a public GitHub repo + (optional) npm publish.

Total user time: **~5 min** if you're skipping npm publish, **~10 min** if you're publishing.

---

## Pre-built proof

Before you start, here's what's already done (so you don't repeat):

- **36/36 vitest tests pass** against GS1/Wikipedia public vectors (GTIN-8/12/13/14)
- `tsc --noEmit` clean (strict mode + `noUncheckedIndexedAccess`)
- `dist/` builds cleanly to ESM + `.d.ts` + sourcemaps
- README, LICENSE (MIT), package.json with `publishConfig.access: public`
- `homepage` + `repository` + `bugs` + `author.url` all reference your live profile / repo
- Live smoke test in Node: `isValidGtin('4006381333931') → true`, etc.

---

## Step 1 — Create the GitHub repo (~30 seconds)

1. Open <https://github.com/new>
2. **Repository name**: `gtin-checksum`
3. **Owner**: `marius103`
4. **Visibility**: Public
5. **Initialize**: Leave all checkboxes UNCHECKED (no README, no .gitignore, no license — they're in the local scaffold already)
6. Click **Create repository**

You'll land on the empty-repo "quick setup" page. Leave that tab open.

---

## Step 2 — Copy the scaffold to your projects folder (~10 seconds)

```sh
# Copy the entire scaffold to your projects directory
cp -r "/Users/marius/Library/Application Support/Claude/local-agent-mode-sessions/30595c18-a671-480a-b387-0e924e0f110b/80eece79-d305-465b-aba5-bcf711864fc8/local_423d94ab-e5db-4f31-92a8-a247dfaabe84/outputs/gtin-checksum" ~/github-projects/gtin-checksum
cd ~/github-projects/gtin-checksum

# Sanity check
ls -la
```

You should see `package.json`, `src/`, `README.md`, `LICENSE`, `tsconfig.json`, etc.

---

## Step 3 — Initialize git + first commit (~30 seconds)

```sh
cd ~/github-projects/gtin-checksum

# Clean any sandbox artifacts (defensive — usually nothing to do)
rm -rf node_modules dist

# Initialize repo, commit, push
git init -b main
git remote add origin git@github.com:marius103/gtin-checksum.git
git add .
git commit -m "feat: initial release — GS1 modulo-10 for GTIN-8/12/13/14"
git push -u origin main
```

If git asks about commit author identity, set it once:

```sh
git config user.name "Marius Pahomi"
git config user.email "marius@feedarc.com"
```

---

## Step 4 — Verify tests pass on your Mac (~30 seconds)

```sh
cd ~/github-projects/gtin-checksum
npm install
npm test
```

Expected: `Tests  36 passed (36)`. If anything fails (most likely environment-specific glitch, not algorithm), tell me before publishing.

---

## Step 5 — Pin the repo on your profile (~15 seconds)

1. Open <https://github.com/marius103>
2. Click **Customize your pins** (top-right of the pinned section)
3. Tick `gtin-checksum`
4. Click **Save pins**

This makes the repo the first thing Google's parser (and humans) see when dereferencing `sameAs[https://github.com/marius103]`. This is the entity-disambiguation signal we're after.

---

## Step 6 (optional) — Publish to npm (~2 min)

```sh
cd ~/github-projects/gtin-checksum

# Sign in if you haven't (uses OTP if you have 2FA enabled — recommended)
npm login

# Publish (this runs `prepublishOnly` which re-runs tests + build)
npm publish
```

After publish, the README badges (`npm version`, `bundle size`) will start resolving on GitHub. Verify at <https://www.npmjs.com/package/gtin-checksum>.

If you'd rather hold off on npm publish until you've used the package in a private project first, that's fine — the GitHub repo alone is enough for the founder-action #401 signal. You can publish anytime later.

---

## Step 7 — Cross-link from FeedArc /glossary/gtin

After Step 3 (GitHub repo public) lands, I'll open a small PR in `feedarc` that adds a "Reference implementation" link from `/glossary/gtin` to `https://github.com/marius103/gtin-checksum`. This creates the bidirectional E-E-A-T signal: `feedarc.com → github.com/marius103/gtin-checksum → (via package.json `author.url`) → feedarc.com/author/marius`.

Tell me when Step 3 is done and I'll push that PR.

---

## What this gives you (signal-wise)

1. **GitHub profile** is no longer "no public repositories" — the `sameAs[github.com/marius103]` target now demonstrates expertise in the schema's declared `knowsAbout` topic "GTIN and product identifier validation".
2. **npm publication** (if you do Step 6) registers you as a published author on npm — a credibility signal Google's quality systems recognize.
3. **Bidirectional E-E-A-T link**: `feedarc.com/glossary/gtin` → outbound link to your GitHub repo → repo's `author.url` points back to `feedarc.com/author/marius`. Cross-domain authorship signal.
4. **Compounds with the Person schema** just shipped on 16 indexable URLs (PRs #297–#300).

No further FeedArc engineering work is required after Step 3 — the cross-link PR is small (~5 lines in `data/glossary/gtin.ts`) and I'll handle it from sandbox.
