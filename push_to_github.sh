#!/usr/bin/env bash
# MealTime KCA - Push to GitHub Helper Script
# Usage:
#   ./push_to_github.sh <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
# Or:
#   GITHUB_TOKEN=ghp_xxxx ./push_to_github.sh

set -e

TOKEN="${1:-$GITHUB_TOKEN}"

if [ -z "$TOKEN" ]; then
  echo "=========================================================="
  echo "MealTime KCA - GitHub Push Helper"
  echo "=========================================================="
  echo ""
  echo "GitHub requires authentication to push to 'becca-afk/mealtime-kca'."
  echo ""
  echo "To push automatically:"
  echo "1. Generate a token with 'repo' scope at:"
  echo "   https://github.com/settings/tokens"
  echo ""
  echo "2. Run this command with your token:"
  echo "   ./push_to_github.sh ghp_yourTokenHere"
  echo ""
  echo "Or reply with your token and I will execute the push for you!"
  echo "=========================================================="
  exit 1
fi

echo "Configuring remote with provided token..."
git remote set-url origin "https://${TOKEN}@github.com/becca-afk/mealtime-kca.git"

echo "Pushing branch 'main' to https://github.com/becca-afk/mealtime-kca.git..."
git branch -M main
git push -u origin main --force

echo ""
echo "✅ Successfully pushed all MealTime KCA code to GitHub!"
echo "Repository: https://github.com/becca-afk/mealtime-kca"
