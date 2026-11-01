#!/usr/bin/env bash
# Script to create a new GitHub repository and push MealTime KCA code to it
# Usage: ./create_and_push_repo.sh <GITHUB_TOKEN> [REPO_NAME]

set -e

TOKEN="$1"
REPO_NAME="${2:-mealtime-kca-app}"

if [ -z "$TOKEN" ]; then
  echo "Error: GitHub Personal Access Token is required."
  echo "Usage: ./create_and_push_repo.sh <GITHUB_TOKEN> [REPO_NAME]"
  exit 1
fi

echo "1. Checking authenticated user on GitHub..."
USER_JSON=$(curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" https://api.github.com/user)
GH_USERNAME=$(echo "$USER_JSON" | grep -o '"login": *"[^"]*"' | head -n 1 | cut -d'"' -f4)

if [ -z "$GH_USERNAME" ]; then
  echo "❌ Error: Invalid GitHub token or unable to authenticate."
  echo "Response from GitHub:"
  echo "$USER_JSON"
  exit 1
fi

echo "Authenticated as GitHub user: $GH_USERNAME"

echo "2. Creating repository '$REPO_NAME' on GitHub..."
CREATE_RES=$(curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"MealTime KCA - Official Campus Dining Application for KCA University\",\"private\":false}")

echo "Repository creation request sent."

echo "3. Setting remote and pushing codebase..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://${TOKEN}@github.com/${GH_USERNAME}/${REPO_NAME}.git"
git branch -M main
git push -u origin main --force

echo ""
echo "🎉 SUCCESS! Your new GitHub repository is live at:"
echo "https://github.com/${GH_USERNAME}/${REPO_NAME}"
