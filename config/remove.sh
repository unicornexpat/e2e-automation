git filter-branch --force --index-filter \
  "git rm -rf --cached --ignore-unmatch $1" \
  --prune-empty --tag-name-filter cat -- --all && \
echo $1 >> .gitignore && \
echo "File/directory has been removed and added to .gitignore."