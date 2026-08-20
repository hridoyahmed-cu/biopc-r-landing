# Syncing the internship site by hand

## Why this is a copy, not a link

`courses.biopc.org` is deployed from **this** repo. The internship site lives in
its own repo, so it is vendored here as a plain copy at `public/internship/`.
Nothing links the two — a commit in the internship repo reaches the website only
when the files are copied across and this repo is pushed.

`public/internship/` is **not** scratch space. Next.js serves everything under
`public/` at the site root, so `public/internship/styles.css` *is*
`courses.biopc.org/internship/styles.css`. Deleting it takes the internship site
off the domain. Do not hand-edit it either: the next sync overwrites it without
warning, because the fork is the source of truth.

There are two hops:

```
md-mustak-khan/Bioinformatics_Research_Internship   (upstream, someone else's)
        |  hop 1: git merge
        v
hridoyahmed-cu/Bioinformatics_Research_Internship   (your fork)
        |  hop 2: copy files + inject the base tag
        v
biopc-r-landing/public/internship/                  (this repo -> Vercel -> live)
```

Hop 2 is automated by `.github/workflows/sync-internship.yml` (daily + manual).
Hop 1 is always manual, on purpose: upstream is a third party, and their commits
should pass through a repo you control before reaching your production domain.

## The source is published in two places

The fork is not only a source — it also builds to **GitHub Pages** at
<https://hridoyahmed-cu.github.io/Bioinformatics_Research_Internship/>.

That is why anything path-specific to this deployment must **not** be committed
to the fork. The two sites are served from different paths:

| Deployment | Served from | Needs `<base>`? |
| --- | --- | --- |
| `courses.biopc.org/internship` | `/internship/` | **yes** |
| GitHub Pages | `/Bioinformatics_Research_Internship/` | **no** |

> **Do not add `<base href="/internship/">` to the fork.** It was there once and
> it silently broke the Pages site: every relative asset resolved to
> `/internship/...`, which does not exist there, so the page rendered unstyled.
> The tag is injected during the sync instead — see hop 2.

## What the fork *does* carry

One deployment-related change lives in the fork, and it is safe in both places:

| Change | Why |
| --- | --- |
| canonical / `og:url` / JSON-LD / footer pointed away from `biopc.site` | That domain does not resolve. Both copies now name `courses.biopc.org/internship` as canonical, which correctly tells search engines your domain is the real home. |

If a merge conflicts on those lines, keep **your** version. Everything else takes
upstream's.

---

## Hop 1 — pull upstream into your fork

```bash
cd "/c/Users/WALTON/OneDrive/Desktop/OneDrive - University of Chittagong/DESKTOP_ALL/BioPC.org website/Bioinformatics_Research_Internship"

git fetch upstream                          # get their latest
git log --oneline HEAD..upstream/main       # read what is new BEFORE merging
git merge upstream/main
git push origin main
```

`git log --oneline HEAD..upstream/main` printing nothing means you are already
up to date and there is nothing to do.

### If the merge reports a conflict

```bash
git status                                  # lists conflicted files
```

Open each file and look for `<<<<<<<` markers. Keep upstream's content except in
the SEO lines above. To keep your whole version of one file:

```bash
git checkout --ours index.html
git add index.html
```

Then finish with `git commit`. To bail out entirely and try again later:

```bash
git merge --abort
```

## Hop 2 — copy the fork into this repo

```bash
cd "/c/Users/WALTON/OneDrive/Desktop/OneDrive - University of Chittagong/DESKTOP_ALL/BioPC.org website/courses.biopc.org/biopc-academy"

SRC=../../Bioinformatics_Research_Internship

rm -rf public/internship
mkdir -p public/internship
cp "$SRC/index.html" "$SRC/styles.css" "$SRC/script.js" public/internship/
cp -r "$SRC/image" public/internship/
```

Copy only those four things. **Never copy `.git/` or `.github/`** — they would be
served publicly. The commands above cannot, which is why they name files rather
than copying the folder wholesale.

### Then inject the base tag — do not skip this

```bash
sed -i '/<meta name="viewport"/a\  <base href="/internship/">' public/internship/index.html
```

This edits the **copy**, never the fork. Without it, `/internship` loads with
every stylesheet, script and image 404ing, and the page renders as raw text.

## Check before you publish

```bash
grep -c '<base href="/internship/">' public/internship/index.html   # must be 1
grep -c 'biopc\.site'                 public/internship/index.html   # must be 0
ls public/internship/.git public/internship/.github 2>/dev/null     # must be empty
```

If the first check is not `1`, **stop** — publishing would break every asset on
the page.

## Build, commit, deploy

```bash
npm run build                               # catches breakage before it is live
git add -A
git commit -m "Sync internship site from source repo"
git push
```

Pushing to `main` is the deploy. Vercel builds automatically and the site is live
in roughly a minute.

## Confirm it actually worked

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://courses.biopc.org/internship
curl -s https://courses.biopc.org/internship | grep -o '<base href="[^"]*">'
curl -s -o /dev/null -w "%{http_code}\n" https://courses.biopc.org/internship/styles.css
```

Expect `200`, the base tag, and `200`. An unstyled page is the signature of a
missing base tag.

---

## The shortcut

Hop 2, the injection, the checks and the deploy are all exactly what the workflow
does. Instead of running any of it, once hop 1 is pushed you can go to this repo
on GitHub:

**Actions** -> **Sync internship site** -> **Run workflow**

It copies, injects, verifies, commits and pushes, and refuses to publish if the
`<base>` tag is missing afterwards. It also runs itself daily at 02:00 UTC, so if
you only do hop 1 and walk away, the website catches up on its own within a day.

### If a run fails

A failed run means it *declined to publish something broken* — the site is
untouched. Read the log under **Actions**; the guard prints exactly what was
wrong. Fix it in the fork, push, and run the workflow again.

## A note on pulling

The workflow commits to this repo from GitHub's servers, so `main` can move
without you. If a push is ever rejected with "the remote contains work you do not
have", that is why:

```bash
git pull
```
