# 🚀 Deployment Guide - CRS Web App

## 📋 Table of Contents
- [Overview](#overview)
- [Environment Setup](#environment-setup)
- [Development Deployment](#development-deployment)
- [Staging Deployment](#staging-deployment)
- [Production Deployment](#production-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Variables](#environment-variables)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

CRS Web App menggunakan arsitektur serverless dengan **Next.js** sebagai frontend dan **Firebase** sebagai backend. Panduan ini mencakup deployment untuk tiga environment:

- **Development**: Local development dan testing
- **Staging**: Pre-production testing dan UAT
- **Production**: Live production environment

### Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ localhost:3000  │    │ Vercel Preview  │    │ Custom Domain   │
│ Firebase Dev    │    │ Firebase Test   │    │ Firebase Prod   │
│ Manual Deploy   │    │ Auto Deploy     │    │ CI/CD Pipeline  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## ⚙️ Environment Setup

### Prerequisites

```bash
# Required tools
Node.js >= 18.0.0
npm >= 8.0.0
Git
Firebase CLI
Vercel CLI (optional)
```

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/crs-evalue.git
cd crs-evalue

# 2. Install dependencies
npm install

# 3. Install Firebase CLI globally
npm install -g firebase-tools

# 4. Login to Firebase
firebase login

# 5. Install Vercel CLI (optional)
npm install -g vercel
```

### Firebase Project Setup

```bash
# 1. Create Firebase projects (if not exists)
firebase projects:create crs-dev
firebase projects:create crs-staging  
firebase projects:create crs-production

# 2. Initialize Firebase in project
firebase init

# Select the following services:
# - Firestore
# - Hosting
# - Storage (optional)
# - Functions (optional)

# 3. Configure project aliases
firebase use --add crs-dev --alias dev
firebase use --add crs-staging --alias staging
firebase use --add crs-production --alias prod
```

---

## 💻 Development Deployment

### Local Development Setup

```bash
# 1. Switch to development environment
firebase use dev

# 2. Create environment variables
cp .env.example .env.local

# 3. Configure .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_dev_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=crs-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=crs-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=crs-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# 4. Initialize Firestore with sample data (optional)
npm run seed:dev

# 5. Start development server
npm run dev
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for development
npm run build

# Start production server locally
npm run start

# Lint code
npm run lint

# Type check
npm run type-check

# Seed development data
npm run seed:dev
```

### Firebase Emulator (Optional)

```bash
# Install emulator
firebase init emulators

# Start emulators
firebase emulators:start

# Access emulator UI
# http://localhost:4000

# Update .env.local for emulator
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=localhost
```

---

## 🧪 Staging Deployment

### Staging Environment Setup

```bash
# 1. Switch to staging environment
firebase use staging

# 2. Create staging environment variables
cp .env.local .env.staging

# 3. Update staging configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=crs-staging
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=crs-staging.firebaseapp.com
# ... other staging Firebase config

# 4. Deploy to Firebase Hosting
npm run build
firebase deploy --only hosting
```

### Vercel Staging Deployment

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to Vercel (staging)
vercel --prod=false

# 4. Configure environment variables in Vercel dashboard
# https://vercel.com/dashboard
```

### Staging Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Develop and test locally
npm run dev

# 3. Push to staging branch
git push origin feature/new-feature

# 4. Auto-deploy via GitHub integration
# (if configured with Vercel/Firebase)

# 5. Test on staging environment
# https://your-staging-url.vercel.app

# 6. Create pull request to main
```

---

## 🌐 Production Deployment

### Production Environment Setup

```bash
# 1. Switch to production environment
firebase use prod

# 2. Create production environment variables
cp .env.staging .env.production

# 3. Update production configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=crs-production
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-custom-domain.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=crs-production.appspot.com
# ... other production Firebase config
```

### Firebase Hosting Production

```bash
# 1. Build for production
npm run build

# 2. Test production build locally
npm run start

# 3. Deploy to Firebase Hosting
firebase deploy --only hosting --project prod

# 4. Deploy Firestore rules and indexes
firebase deploy --only firestore --project prod

# 5. Verify deployment
firebase hosting:channel:open live --project prod
```

### Custom Domain Setup

```bash
# 1. Add custom domain in Firebase Console
# Hosting > Add custom domain > your-domain.com

# 2. Configure DNS records
# Add A records or CNAME as instructed by Firebase

# 3. Wait for SSL certificate provisioning
# This may take up to 24 hours

# 4. Verify domain
firebase hosting:sites:list --project prod
```

### Vercel Production Deployment

```bash
# 1. Deploy to production
vercel --prod

# 2. Configure custom domain in Vercel
# Dashboard > Project > Settings > Domains

# 3. Update DNS records
# Point your domain to Vercel's nameservers

# 4. Verify deployment
curl -I https://your-domain.com
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy CRS Web App

on:
  push:
    branches:
      - main
      - staging
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Run type check
        run: npm run type-check
        
      - name: Build application
        run: npm run build

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build for staging
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.STAGING_FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.STAGING_FIREBASE_API_KEY }}
          
      - name: Deploy to Firebase Staging
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_STAGING }}'
          projectId: crs-staging
          
  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build for production
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.PROD_FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.PROD_FIREBASE_API_KEY }}
          
      - name: Deploy to Firebase Production
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_PROD }}'
          projectId: crs-production
```

### GitHub Secrets Configuration

Configure the following secrets in GitHub repository settings:

```bash
# Staging secrets
STAGING_FIREBASE_PROJECT_ID=crs-staging
STAGING_FIREBASE_API_KEY=your_staging_api_key
FIREBASE_SERVICE_ACCOUNT_STAGING=your_staging_service_account_json

# Production secrets  
PROD_FIREBASE_PROJECT_ID=crs-production
PROD_FIREBASE_API_KEY=your_production_api_key
FIREBASE_SERVICE_ACCOUNT_PROD=your_production_service_account_json

# Common secrets
GITHUB_TOKEN=automatically_provided_by_github
```

### Vercel Integration

```bash
# 1. Connect GitHub repository to Vercel
# Dashboard > New Project > Import Git Repository

# 2. Configure environment variables
# Dashboard > Project > Settings > Environment Variables

# 3. Configure deployment branches
# Settings > Git > Production Branch: main
# Settings > Git > Preview Branches: staging, feature/*

# 4. Configure build settings
# Build Command: npm run build
# Output Directory: .next
# Install Command: npm ci
```

---

## 🔐 Environment Variables

### Development Environment

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_dev_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=crs-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=crs-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=crs-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Optional for development
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
NEXT_PUBLIC_ENVIRONMENT=development
```

### Staging Environment

```bash
# .env.staging or Vercel environment variables
NEXT_PUBLIC_FIREBASE_API_KEY=your_staging_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=crs-staging.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=crs-staging
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=crs-staging.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=987654321
NEXT_PUBLIC_FIREBASE_APP_ID=1:987654321:web:def456

NEXT_PUBLIC_ENVIRONMENT=staging
```

### Production Environment

```bash
# .env.production or Vercel environment variables
NEXT_PUBLIC_FIREBASE_API_KEY=your_prod_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-custom-domain.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=crs-production
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=crs-production.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=456789123
NEXT_PUBLIC_FIREBASE_APP_ID=1:456789123:web:ghi789

NEXT_PUBLIC_ENVIRONMENT=production
```

### Environment Variable Management

```typescript
// src/config/environment.ts
export const config = {
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  },
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validation
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

---

## 📊 Monitoring & Logging

### Firebase Analytics Setup

```typescript
// src/config/analytics.ts
import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from './firebase';

export const analytics = getAnalytics(app);

export const logCustomEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined') {
    logEvent(analytics, eventName, parameters);
  }
};

// Usage in components
logCustomEvent('assessment_completed', {
  assessment_id: 'assessment_001',
  evaluator_division: 'Operations'
});
```

### Performance Monitoring

```typescript
// src/config/performance.ts
import { getPerformance } from 'firebase/performance';
import { app } from './firebase';

export const perf = getPerformance(app);

// Custom performance trace
export const createTrace = (traceName: string) => {
  const trace = perf.trace(traceName);
  trace.start();
  
  return {
    stop: () => trace.stop(),
    putAttribute: (attr: string, value: string) => trace.putAttribute(attr, value),
    incrementMetric: (metric: string, value: number) => trace.incrementMetric(metric, value)
  };
};
```

### Error Tracking with Sentry (Optional)

```bash
# Install Sentry
npm install @sentry/nextjs

# Configure Sentry
npx @sentry/wizard -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  tracesSampleRate: 1.0,
});
```

### Logging Configuration

```typescript
// src/utils/logger.ts
interface Logger {
  info: (message: string, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  error: (message: string, error?: Error, meta?: any) => void;
}

export const logger: Logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta);
  },
  
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta);
  },
  
  error: (message: string, error?: Error, meta?: any) => {
    console.error(`[ERROR] ${message}`, error, meta);
    
    // Send to external logging service in production
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error);
    }
  }
};
```

---

## 🛠️ Troubleshooting

### Common Deployment Issues

#### 1. Firebase Configuration Errors

```bash
# Problem: Firebase config not found
Error: Firebase configuration is invalid

# Solution: Check environment variables
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID
firebase projects:list
firebase use --add your-project-id
```

#### 2. Build Failures

```bash
# Problem: TypeScript errors during build
Type error: Property 'xyz' does not exist

# Solution: Fix TypeScript errors
npm run type-check
npm run lint:fix

# Temporary bypass (not recommended)
# In next.config.js:
typescript: {
  ignoreBuildErrors: true,
}
```

#### 3. Firestore Permission Denied

```bash
# Problem: Permission denied errors
FirebaseError: Missing or insufficient permissions

# Solution: Check security rules
firebase firestore:rules:get
firebase firestore:rules:release rules.firestore

# Update security rules if needed
```

#### 4. Environment Variable Issues

```bash
# Problem: Environment variables not loading
TypeError: Cannot read property 'apiKey' of undefined

# Solution: Check variable names and prefixes
# All client-side variables must start with NEXT_PUBLIC_
# Restart development server after changes
npm run dev
```

### Debugging Commands

```bash
# Check build output
npm run build 2>&1 | tee build.log

# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build

# Check Firebase hosting
firebase hosting:sites:list
firebase hosting:channel:list

# Test production build locally
npm run build && npm run start

# Check environment variables
printenv | grep NEXT_PUBLIC

# Firebase debug mode
firebase --debug deploy
```

### Performance Issues

```bash
# 1. Check bundle size
npm run build
# Look for large chunks in .next/static/chunks/

# 2. Analyze performance
# Use Lighthouse audit in browser dev tools

# 3. Check Firebase usage
# Firebase Console > Usage tab

# 4. Monitor Core Web Vitals
# Use Firebase Performance Monitoring
```

### Rollback Procedures

```bash
# Firebase Hosting rollback
firebase hosting:channel:list
firebase hosting:channel:open CHANNEL_ID

# Vercel rollback
vercel rollback DEPLOYMENT_URL

# Git rollback
git revert HEAD
git push origin main

# Emergency rollback
git reset --hard PREVIOUS_COMMIT
git push --force-with-lease origin main
```

---

## 📝 Deployment Checklist

### Pre-Deployment Checklist

- [ ] Code review completed
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Security rules updated
- [ ] Database indexes created
- [ ] Performance testing completed
- [ ] Backup created

### Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] All features working as expected
- [ ] Database connectivity verified
- [ ] Performance metrics within acceptable range
- [ ] Error monitoring active
- [ ] Analytics tracking working
- [ ] SSL certificate valid
- [ ] Custom domain resolving correctly

### Emergency Procedures

1. **Critical Bug Found**
   - Immediately rollback to previous version
   - Investigate and fix in development
   - Deploy hotfix following standard process

2. **Database Issues**
   - Check Firebase console for errors
   - Verify security rules
   - Contact Firebase support if needed

3. **Performance Degradation**
   - Check Firebase usage quotas
   - Analyze performance metrics
   - Scale resources if needed

---

**📞 Support Contacts:**
- **Firebase Support**: Firebase Console > Support
- **Vercel Support**: Vercel Dashboard > Help
- **Development Team**: [Your team contact information] 