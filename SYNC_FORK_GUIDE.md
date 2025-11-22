# 🔄 How to Sync Your Fork with the Original Repository

## Overview

When you fork a repository, you create your own copy. To get updates from the original repository, you need to:

1. **Add the original repo as "upstream" remote**
2. **Fetch changes from upstream**
3. **Merge or rebase those changes into your fork**

---

## Step-by-Step Guide

### Step 1: Add the Original Repository as Upstream

First, find the original repository URL. Then add it as an "upstream" remote:

```bash
# Add the original repository as "upstream"
git remote add upstream <ORIGINAL_REPO_URL>

# Example:
# git remote add upstream https://github.com/original-owner/repo-name.git
```

**To find the original repo URL:**
- Go to your forked repository on GitHub
- Click "Forked from [original-repo]" link at the top
- Copy the repository URL

### Step 2: Verify Remotes

Check that both remotes are configured:

```bash
git remote -v
```

You should see:
- `origin` - Your fork (where you push)
- `upstream` - Original repository (where you pull from)

### Step 3: Fetch Changes from Upstream

Get the latest changes from the original repository:

```bash
git fetch upstream
```

This downloads changes but doesn't merge them yet.

### Step 4: Switch to Your Main Branch

Make sure you're on your main branch:

```bash
git checkout main
# or
git checkout master
```

### Step 5: Merge Upstream Changes

Merge the upstream changes into your branch:

**Option A: Merge (creates a merge commit)**
```bash
git merge upstream/main
# or
git merge upstream/master
```

**Option B: Rebase (cleaner history, no merge commit)**
```bash
git rebase upstream/main
# or
git rebase upstream/master
```

### Step 6: Push to Your Fork

After merging, push the changes to your fork:

```bash
git push origin main
# or
git push origin master
```

---

## Quick Sync Command

Once you've set up upstream, you can sync with one command:

```bash
# Fetch and merge in one go
git pull upstream main && git push origin main
```

Or create an alias for convenience:

```bash
# Add to your .gitconfig or run once
git config alias.sync-fork '!git fetch upstream && git merge upstream/main && git push origin main'
```

Then just run:
```bash
git sync-fork
```

---

## Handling Conflicts

If you have conflicts when merging:

1. **Git will mark conflicted files**
2. **Edit the files to resolve conflicts**
3. **Stage the resolved files:**
   ```bash
   git add <resolved-files>
   ```
4. **Complete the merge:**
   ```bash
   git commit
   ```
5. **Push:**
   ```bash
   git push origin main
   ```

---

## Best Practices

1. **Always sync before starting new work:**
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

2. **Keep your fork's main branch clean:**
   - Work on feature branches
   - Keep main in sync with upstream

3. **Regular syncing:**
   - Sync weekly or before major work
   - Prevents large conflicts later

---

## Example Workflow

```bash
# 1. Add upstream (only needed once)
git remote add upstream https://github.com/original-owner/repo.git

# 2. Fetch latest changes
git fetch upstream

# 3. Switch to main branch
git checkout main

# 4. Merge upstream changes
git merge upstream/main

# 5. Push to your fork
git push origin main

# 6. Create feature branch for new work
git checkout -b my-feature
```

---

## Troubleshooting

### "Upstream already exists"
If you get this error, the upstream remote is already added. You can:
- Update it: `git remote set-url upstream <NEW_URL>`
- Or just proceed to fetch

### "Your branch is ahead/behind"
This is normal after syncing. Just push your changes:
```bash
git push origin main
```

### "Cannot merge: uncommitted changes"
Commit or stash your changes first:
```bash
git stash
git merge upstream/main
git stash pop
```

---

## Summary

✅ **Add upstream:** `git remote add upstream <URL>`
✅ **Fetch:** `git fetch upstream`
✅ **Merge:** `git merge upstream/main`
✅ **Push:** `git push origin main`

That's it! Your fork is now synced with the original repository.

