# Git Guide for Backend Team Collaboration

## 🎯 Your Situation
- **Team**: 2 backend developers
- **Branch**: `backend` (shared branch)
- **Goal**: Avoid conflicts and maintain smooth workflow

---

## 📋 Daily Workflow (Follow This Order)

### 1. **ALWAYS Start Your Day With Pull**
```bash
git pull origin backend
```
**When**: Every time BEFORE you start coding
**Why**: Get the latest changes from your colleague to avoid conflicts

---

### 2. **Work on Your Code**
- Make your changes
- Test locally
- Keep tasks small and focused

---

### 3. **Check Status Before Committing**
```bash
git status
```
**When**: Before every commit
**Why**: See what files changed and verify you're on the right branch

---

### 4. **Stage Your Changes**
```bash
# Stage specific files (RECOMMENDED)
git add src/controllers/payment.controller.js
git add src/services/payment.service.js

# OR stage all changes (use carefully)
git add .
```
**When**: After testing your code
**Why**: Prepare files for commit

**⚠️ IMPORTANT**: Review what you're staging. Don't commit unnecessary files!

---

### 5. **Commit With Clear Messages**
```bash
git commit -m "Add payment validation in payment controller"
```

**Good Commit Messages:**
- ✅ "Add user authentication middleware"
- ✅ "Fix Paymee webhook validation error"
- ✅ "Update Supabase connection config"
- ✅ "Refactor transport controller routing"

**Bad Commit Messages:**
- ❌ "update"
- ❌ "fix bug"
- ❌ "changes"

**When**: After every logical unit of work (every 1-3 hours ideally)
**Why**: Save your work and make it easy to track changes

---

### 6. **Pull Before Pushing (CRITICAL)**
```bash
git pull origin backend
```
**When**: IMMEDIATELY before pushing
**Why**: Get colleague's latest changes to avoid push conflicts

**🚨 This is the MOST IMPORTANT step to avoid conflicts!**

---

### 7. **Push Your Changes**
```bash
git push origin backend
```
**When**: After pulling successfully
**Why**: Share your work with your colleague

---

## 🔄 Complete Daily Cycle

```bash
# Morning / Start of work
git pull origin backend

# ... work on code ...

# Before committing
git status
git add <your-files>
git commit -m "Clear message about what you did"

# BEFORE pushing
git pull origin backend

# If pull succeeds with no conflicts
git push origin backend
```

---

## ⚠️ When You Have Conflicts

### Scenario 1: Conflict During Pull
```bash
git pull origin backend
# Output: CONFLICT (content): Merge conflict in src/controllers/auth.controller.js
```

**Steps to Resolve:**

1. **Open the conflicting file** (VS Code will show it clearly)
   
2. **Look for conflict markers:**
```javascript
<<<<<<< HEAD
// Your code
const user = await getUserById(id);
=======
// Colleague's code
const user = await findUser(id);
>>>>>>> origin/backend
```

3. **Decide what to keep:**
   - Keep your code
   - Keep colleague's code
   - Merge both (often the best solution)

4. **Remove conflict markers and edit:**
```javascript
// Merged solution
const user = await getUserById(id); // or combine logic
```

5. **Stage the resolved file:**
```bash
git add src/controllers/auth.controller.js
```

6. **Commit the merge:**
```bash
git commit -m "Merge backend branch - resolved auth controller conflict"
```

7. **Push:**
```bash
git push origin backend
```

---

## 🚫 NEVER Do These

### ❌ DON'T Push Without Pulling First
```bash
# WRONG ❌
git commit -m "some changes"
git push origin backend  # This will likely fail or cause issues
```

```bash
# CORRECT ✅
git commit -m "some changes"
git pull origin backend   # Always pull first!
git push origin backend
```

### ❌ DON'T Work on the Same File Simultaneously
- **Coordinate with your colleague** about who works on what
- If both need the same file, communicate frequently
- Consider pairing on that specific file

### ❌ DON'T Commit Large Changes All at Once
- Make small, frequent commits
- Easier to resolve conflicts
- Easier to review and rollback if needed

### ❌ DON'T Use `git push -f` (Force Push)
```bash
git push -f origin backend  # NEVER DO THIS ❌
```
**Why**: This will DELETE your colleague's work!

### ❌ DON'T Forget to Test Before Committing
- Run your backend server
- Test the endpoints you changed
- Make sure nothing broke

---

## 💡 Best Practices for Avoiding Conflicts

### 1. **Communicate Daily**
- Morning: "I'm working on payment controller today"
- Afternoon: "I'm pushing changes to auth routes"
- Before leaving: "I pushed updates to transport service"

### 2. **Work on Different Files**
Divide work smartly:
- **Developer 1**: Payment system (payment.controller.js, payment.service.js)
- **Developer 2**: Authentication (auth.controller.js, user.model.js)

### 3. **Pull Frequently**
```bash
# Pull every 1-2 hours or before starting new task
git pull origin backend
```

### 4. **Commit Often**
- Every feature completed = 1 commit
- Every bug fixed = 1 commit
- Every 1-3 hours of work = at least 1 commit

### 5. **Small, Focused Commits**
**Good:**
```bash
git add src/controllers/payment.controller.js
git commit -m "Add payment validation logic"

git add src/services/payment.service.js
git commit -m "Implement Paymee integration"
```

**Not Ideal:**
```bash
git add .
git commit -m "Worked on payment stuff and fixed auth"
```

---

## 🆘 Emergency Commands

### Undo Last Commit (But Keep Changes)
```bash
git reset --soft HEAD~1
```
**Use when**: You committed too early or wrong message

### Discard All Local Changes (CAREFUL!)
```bash
git reset --hard origin/backend
```
**Use when**: Your local code is completely broken, start fresh
**⚠️ WARNING**: This deletes ALL your uncommitted work!

### See Commit History
```bash
git log --oneline -10
```
**Use when**: You want to see recent commits

### Check Which Branch You're On
```bash
git branch
```
**Use when**: Making sure you're on `backend` branch

### Stash Changes Temporarily
```bash
# Save work temporarily
git stash

# Get it back later
git stash pop
```
**Use when**: You need to pull but have uncommitted changes

---

## 📱 Communication Protocol

### Before Starting Work:
💬 "Starting work on [file/feature], pulling latest changes"

### During Work:
💬 "Working on [specific feature], will push in ~1 hour"

### Before Pushing:
💬 "About to push changes to [files], heads up!"

### After Pushing:
💬 "Pushed updates to [files], please pull when convenient"

### When Stuck:
💬 "Getting conflicts in [file], can we sync up?"

---

## 🎯 Quick Reference Cheat Sheet

| Situation | Command |
|-----------|---------|
| Start working | `git pull origin backend` |
| Check status | `git status` |
| Stage files | `git add <file>` |
| Commit | `git commit -m "message"` |
| Before push | `git pull origin backend` |
| Push | `git push origin backend` |
| See history | `git log --oneline` |
| Check branch | `git branch` |
| Undo last commit | `git reset --soft HEAD~1` |

---

## 🏆 Golden Rules

1. **PULL BEFORE YOU PUSH** (most important!)
2. **Commit often with clear messages**
3. **Communicate with your colleague**
4. **Test before committing**
5. **Never force push**
6. **Work on different files when possible**
7. **Pull at the start of each work session**

---

## 📝 Sample Daily Workflow

```bash
# 9:00 AM - Start of day
cd ~/pfa/pfaa/backend
git pull origin backend
# OUTPUT: Already up to date. (or new changes downloaded)

# 9:00 - 11:00 AM - Work on payment feature
# ... coding ...

# 11:00 AM - Commit work
git status
git add src/controllers/payment.controller.js src/services/payment.service.js
git commit -m "Add Paymee payment verification endpoint"
git pull origin backend
git push origin backend

# 11:00 - 1:00 PM - Work on webhooks
# ... coding ...

# 1:00 PM - Commit before lunch
git status
git add src/webhooks/paymeeWebhook.js
git commit -m "Handle payment success webhook from Paymee"
git pull origin backend
git push origin backend

# 2:00 PM - After lunch, pull again
git pull origin backend

# 2:00 - 5:00 PM - Work on another feature
# ... coding ...

# 5:00 PM - End of day commit
git status
git add <files>
git commit -m "Update transport controller with new endpoints"
git pull origin backend
git push origin backend
```

---

## ✅ Success Checklist

Before ending your work session, verify:
- [ ] All changes committed with clear messages
- [ ] Pulled latest from origin
- [ ] Pushed your commits
- [ ] No uncommitted changes (`git status` is clean)
- [ ] Colleague informed about what you pushed

---

**Remember**: Communication is as important as the commands! Talk to your colleague regularly, and you'll avoid most conflicts. 🚀
