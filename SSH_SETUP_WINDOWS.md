# SSH Key Setup for Windows — eLibAP GitHub

This guide walks you through generating an SSH key on a Windows laptop and connecting it to the eLibAP GitHub repository.

**Repository:** `https://github.com/dhanusriayulu-2007/eLibAP`
**Branch:** `development`

---

## Step 1 — Install Git for Windows

1. Download Git from **https://git-scm.com/download/win**
2. Run the installer — keep all default options
3. After install, open **Git Bash** (search for it in Start menu)

> All commands below must be run inside **Git Bash**, not Command Prompt or PowerShell.

---

## Step 2 — Generate an SSH Key

In Git Bash, run:

```bash
ssh-keygen -t ed25519 -C "dhanusriayulu@gmail.com"
```

Replace `your_email@example.com` with the email you use for GitHub.

When prompted:
- **"Enter file in which to save the key"** → press **Enter** (uses default location)
- **"Enter passphrase"** → press **Enter** (no passphrase, or type one if you want extra security)
- **"Enter same passphrase again"** → press **Enter**

You will see output like:
```
Your identification has been saved in C:/Users/YourName/.ssh/id_ed25519
Your public key has been saved in C:/Users/YourName/.ssh/id_ed25519.pub
```

---

## Step 3 — Copy the Public Key

Run this in Git Bash to print your public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

You will see a long line starting with `ssh-ed25519 AAAA...`

**Select all of it and copy** (right-click → Copy in Git Bash).

---

## Step 4 — Add the Key to GitHub

1. Go to **https://github.com/settings/keys**
2. Click **"New SSH key"**
3. Fill in:
   - **Title:** `My Windows Laptop` (or any name you like)
   - **Key type:** `Authentication Key`
   - **Key:** paste the key you copied in Step 3
4. Click **"Add SSH key"**
5. Confirm with your GitHub password if asked

---

## Step 5 — Test the Connection

In Git Bash, run:

```bash
ssh -T git@github.com
```

You should see:
```
Hi dhanusriayulu-2007! You've successfully authenticated, but GitHub does not provide shell access.
```

If you see that message, the SSH key is working correctly.

---

## Step 6 — Clone the Repository

In Git Bash, navigate to where you want the project and run:

```bash
git clone git@github.com:dhanusriayulu-2007/eLibAP.git
cd eLibAP
git checkout development
```

---

## Step 7 — Push Code Changes

After making changes to files:

```bash
git add .
git commit -m "your message here"
git push origin development
```

---

## If You Already Have the Folder Cloned via HTTPS

Switch the remote from HTTPS to SSH:

```bash
git remote set-url origin git@github.com:dhanusriayulu-2007/eLibAP.git
git remote -v
```

You should see:
```
origin  git@github.com:dhanusriayulu-2007/eLibAP.git (fetch)
origin  git@github.com:dhanusriayulu-2007/eLibAP.git (push)
```

---

## Troubleshooting

**`ssh-keygen` not found**
→ Make sure you are in **Git Bash**, not Command Prompt.

**Permission denied (publickey)**
→ The key was not added to GitHub correctly. Repeat Steps 3 and 4.

**`ssh -T git@github.com` times out**
→ Your network/firewall may block port 22. Try:
```bash
ssh -T -p 443 git@ssh.github.com
```

**Wrong GitHub account**
→ Run `ssh -T git@github.com` — it will tell you which account the key belongs to.
