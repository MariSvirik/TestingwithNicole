# Files to Upload to GitHub

Upload these files to your repository: https://github.com/MariSvirik/patternfly-react-seed-activation-keys

## Method 1: Upload Files Directly

1. Go to your repository
2. Click "Add file" → "Upload files"
3. Upload these key files:

### Essential Files:
- `src/app/ActivationKeys/ActivationKeys.tsx` (main component)
- `src/app/routes.tsx` (routing)
- `package.json` (dependencies)
- `.github/workflows/deploy.yml` (GitHub Pages)

### Commit Message:
```
Add PatternFly v5 Activation Keys demo

- Interactive activation keys detail page with collapsible sections
- Breadcrumb navigation and responsive design  
- Tabbed hosts interface with tables and pagination
- GitHub Pages deployment workflow included
```

## Method 2: Initialize from Scratch

If upload fails, you can:
1. Create new files directly in GitHub
2. Copy-paste the code from your local files
3. Commit each file individually

## After Upload:

1. **Enable GitHub Pages:**
   - Settings → Pages
   - Source: "GitHub Actions"
   - Save

2. **Your demo will be live at:**
   `https://marisvirik.github.io/patternfly-react-seed-activation-keys/activation-keys`

## Local Demo Still Works:
Your activation keys page works perfectly at: http://localhost:8080/activation-keys