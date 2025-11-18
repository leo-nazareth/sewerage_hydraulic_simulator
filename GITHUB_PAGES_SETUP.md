# GitHub Pages Setup Instructions

## Steps to Enable GitHub Pages Deployment

After merging the feature branch to `main` and pushing to GitHub, follow these steps to enable GitHub Pages:

### 1. Go to Repository Settings
1. Navigate to your repository: `https://github.com/leo-nazareth/sewerage_hydraulic_simulator`
2. Click on **Settings** tab

### 2. Configure GitHub Pages
1. In the left sidebar, click on **Pages** (under "Code and automation")
2. Under **Source**, select **GitHub Actions**
3. The workflow will automatically deploy on the next push to `main`

### 3. Verify Deployment
1. Go to the **Actions** tab in your repository
2. You should see the "Deploy to GitHub Pages" workflow running
3. Wait for the workflow to complete (green checkmark)
4. Once complete, your site will be available at:
   ```
   https://leo-nazareth.github.io/sewerage_hydraulic_simulator/
   ```

### 4. Test the Deployed Site
1. Open the URL in your browser
2. Verify that:
   - The application loads correctly
   - All three languages (PT, EN, ES) work
   - Calculations function properly
   - Visualizations render correctly
   - Language selection persists on page reload

## Troubleshooting

### If the site doesn't load:
- Check that the workflow completed successfully in the Actions tab
- Verify that GitHub Pages is enabled in Settings > Pages
- Ensure the source is set to "GitHub Actions"
- Check browser console for any 404 errors on assets

### If assets don't load (404 errors):
- Verify that `vite.config.js` has the correct `base` path
- The base path should match your repository name: `/sewerage_hydraulic_simulator/`

### If the workflow fails:
- Check the workflow logs in the Actions tab
- Ensure all dependencies are correctly listed in `package.json`
- Verify that the build command (`npm run build`) works locally

## Updating the Site

After the initial setup, any push to the `main` branch will automatically trigger a new deployment. The workflow will:
1. Build the application
2. Deploy to GitHub Pages
3. Make the updated site available within a few minutes

## Custom Domain (Optional)

If you want to use a custom domain:
1. Go to Settings > Pages
2. Under "Custom domain", enter your domain name
3. Follow GitHub's instructions to configure DNS
4. Update the `base` path in `vite.config.js` to `/` instead of `/sewerage_hydraulic_simulator/`
