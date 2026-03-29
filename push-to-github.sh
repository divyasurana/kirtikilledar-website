#!/bin/bash
# Script to push to GitHub repository: kirtikilledar-website

echo "🚀 Pushing to GitHub: kirtikilledar-website"
echo ""
echo "Step 1: Creating GitHub repository..."
echo "Please create a new PUBLIC repository at:"
echo "https://github.com/new"
echo ""
echo "Repository settings:"
echo "  - Name: kirtikilledar-website"
echo "  - Visibility: Public"
echo "  - Do NOT initialize with README (we have one)"
echo ""
read -p "Press Enter once you've created the repository..."

echo ""
echo "Step 2: Adding remote and pushing..."
cd /app

# Remove any existing origin remote
git remote remove origin 2>/dev/null || true

# Add new remote (replace YOUR_USERNAME with your actual GitHub username)
echo "Enter your GitHub username:"
read github_username

git remote add origin "https://github.com/$github_username/kirtikilledar-website.git"

# Push to GitHub
echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Your repository should be live at:"
echo "https://github.com/$github_username/kirtikilledar-website"
