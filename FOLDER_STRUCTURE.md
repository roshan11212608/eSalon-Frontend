# eSalon App - Complete Folder Structure

## 📁 Root Directory
```
esaloon-app/
├── 📁 app/                     # Expo Router pages (routing only)
│   ├── 📁 (admin-tabs)/        # Admin tab navigation screens
│   │   ├── 📁 dashboard/
│   │   │   └── 📄 index.tsx
│   │   ├── 📁 userManagement/
│   │   │   └── 📄 index.tsx
│   │   └── 📄 _layout.tsx
│   ├── 📁 (owner-tabs)/        # Owner tab navigation screens
│   │   ├── 📁 activity/
│   │   │   ├── 📄 _layout.tsx
│   │   │   ├── 📄 index.tsx
│   │   │   └── 📄 new.tsx
│   │   ├── 📁 employees/
│   │   │   ├── 📄 _layout.tsx
│   │   │   └── 📄 index.tsx
│   │   ├── 📁 expenses/
│   │   │   └── (empty)
│   │   ├── 📁 profile/
│   │   │   ├── 📄 _layout.tsx
│   │   │   └── 📄 index.tsx
│   │   ├── 📁 shop/
│   │   │   ├── 📄 _layout.tsx
│   │   │   └── 📄 index.tsx
│   │   ├── 📁 shopServices/
│   │   │   ├── 📄 _layout.tsx
│   │   │   └── 📄 index.tsx
│   │   ├── 📄 _layout.tsx
│   │   └── 📄 home.tsx
│   ├── 📁 (staff-tabs)/        # Staff tab navigation screens
│   │   ├── 📄 _layout.tsx
│   │   ├── 📄 activity.tsx
│   │   ├── 📄 home.tsx
│   │   └── 📄 profile.tsx
│   ├── 📁 auth/                # Authentication screens
│   │   ├── 📄 _layout.tsx
│   │   ├── 📄 login.tsx
│   │   └── 📄 register.tsx
│   ├── 📄 _layout.tsx
│   └── 📄 index.tsx
│
├── 📁 assets/                  # Static assets
│   ├── 📁 icons/               # Icon assets
│   └── 📁 images/              # Image assets
│       ├── 📄 android-icon-background.png
│       ├── 📄 android-icon-foreground.png
│       ├── 📄 android-icon-monochrome.png
│       ├── 📄 favicon.png
│       ├── 📄 icon.png
│       ├── 📄 partial-react-logo.png
│       ├── 📄 react-logo.png
│       ├── 📄 react-logo@2x.png
│       ├── 📄 react-logo@3x.png
│       └── 📄 splash-icon.png
│
├── 📁 src/                     # Source code (business logic)
│   ├── 📁 components/
│   │   └── 📄 ConfirmationModal.tsx
│   │
│   ├── 📁 lib/                 # Core utilities
│   │   ├── 📄 auth.ts
│   │   └── 📄 storage.ts
│   │
│   ├── 📁 modules/             # Feature modules
│   │   ├── 📁 activity/
│   │   │   ├── 📁 styles/
│   │   │   │   ├── 📄 activity.styles.ts
│   │   │   │   └── 📄 newActivity.styles.ts
│   │   │   ├── 📄 Activity.tsx
│   │   │   ├── 📄 NewAcitivity.tsx
│   │   │   └── 📄 types.ts
│   │   │
│   │   ├── 📁 auth/
│   │   │   ├── 📁 styles/
│   │   │   │   ├── 📄 login.styles.ts
│   │   │   │   └── 📄 register.styles.ts
│   │   │   ├── 📄 Login.tsx
│   │   │   └── 📄 Register.tsx
│   │   │
│   │   ├── 📁 dashboard/
│   │   │   ├── 📁 admin/
│   │   │   │   └── 📁 screens/
│   │   │   │       └── 📄 DashboardScreen.tsx
│   │   │   ├── 📁 owner/
│   │   │   │   ├── 📁 screens/
│   │   │   │   │   └── 📄 DashboardScreen.tsx
│   │   │   │   └── 📄 OwnerDashboard.tsx
│   │   │   └── 📁 staff/
│   │   │       ├── 📁 screens/
│   │   │       │   └── 📄 DashboardScreen.tsx
│   │   │       ├── 📁 styles/
│   │   │       │   └── 📄 staffDashboard.styles.ts
│   │   │       └── 📄 StaffDashboard.tsx
│   │   │
│   │   ├── 📁 employees/
│   │   │   ├── 📁 styles/
│   │   │   │   └── 📄 employees.styles.ts
│   │   │   └── 📄 Employees.tsx
│   │   │
│   │   ├── 📁 expenses/
│   │   │   ├── 📁 styles/
│   │   │   │   └── 📄 expenses.styles.ts
│   │   │   └── 📄 Expenses.tsx
│   │   │
│   │   ├── 📁 profile/
│   │   │   ├── 📁 hooks/
│   │   │   │   └── 📄 useProfileData.ts
│   │   │   ├── 📄 ProfileManagement.tsx
│   │   │   └── 📄 types.ts
│   │   │
│   │   ├── 📁 shop/
│   │   │   ├── 📁 styles/
│   │   │   │   ├── 📄 shop.styles.ts
│   │   │   │   └── 📄 shopCard.styles.ts
│   │   │   ├── 📄 Shop.tsx
│   │   │   └── 📄 types.ts
│   │   │
│   │   └── 📁 shopServices/
│   │       ├── 📁 styles/
│   │       │   ├── 📄 addNewServices.styles.ts
│   │       │   └── 📄 shopServices.styles.ts
│   │       ├── 📄 AddNewServices.tsx
│   │       └── 📄 ShopServices.tsx
│   │
│   │   └── 📁 userManagement/   # User Management (Admin only)
│   │       ├── 📁 styles/
│   │       │   └── 📄 userManagement.styles.ts
│   │       ├── 📄 types.ts
│   │       └── 📄 UserManagement.tsx
│   │
│   ├── 📁 services/            # API and services
│   │   ├── 📁 api/
│   │   │   └── 📄 apiClient.ts
│   │   ├── 📁 storage/
│   │   │   └── 📄 storageService.ts
│   │   ├── 📁 types/
│   │   │   ├── 📄 shop.ts
│   │   │   └── 📄 user.ts
│   │   ├── 📄 activityService.ts
│   │   ├── 📄 authService.ts
│   │   ├── 📄 networkUtils.ts
│   │   ├── 📄 profileService.ts
│   │   └── 📄 shopService.ts
│   │
│   ├── 📁 shared/              # Shared components and utilities
│   │   ├── 📁 components/
│   │   │   ├── 📁 AppButton/
│   │   │   │   ├── 📄 AppButton.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 AppInput/
│   │   │   │   ├── 📄 AppInput.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 Header/
│   │   │   │   ├── 📄 Header.tsx
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📄 Card.tsx
│   │   │   ├── 📄 ConfirmationModal.tsx
│   │   │   ├── 📄 themed-text.tsx
│   │   │   └── 📄 themed-view.tsx
│   │   │
│   │   ├── 📁 constants/
│   │   │   ├── 📄 config.ts
│   │   │   └── 📄 theme.ts
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── 📄 use-color-scheme.ts
│   │   │   ├── 📄 use-color-scheme.web.ts
│   │   │   ├── 📄 use-theme-color.ts
│   │   │   ├── 📄 useAuth.ts
│   │   │   ├── 📄 useTheme.ts
│   │   │   └── 📄 useUser.ts
│   │   │
│   │   └── 📁 theme/
│   │       ├── 📄 borderRadius.ts
│   │       ├── 📄 colors.ts
│   │       ├── 📄 index.ts
│   │       ├── 📄 platform.ts
│   │       ├── 📄 platformColors.ts
│   │       ├── 📄 shadows.ts
│   │       ├── 📄 spacing.ts
│   │       ├── 📄 typography.ts
│   │       └── 📄 useTheme.ts
│   │
│   ├── 📁 store/               # State management
│   │   ├── 📄 authStore.ts
│   │   ├── 📄 index.ts
│   │   └── 📄 userStore.ts
│   │
│   └── 📁 types/               # TypeScript types
│       ├── 📄 shop.ts
│       └── 📄 user.ts
│
├── 📄 .gitignore
├── 📄 app.json
├── 📄 eslint.config.js
├── 📄 expo-env.d.ts
├── 📄 FOLDER_STRUCTURE.md
├── 📄 metro.config.js
├── 📄 package-lock.json
├── 📄 package.json
├── 📄 README.md
└── 📄 tsconfig.json
```

---

## 📊 File Count Summary

| Directory | Files |
|-----------|-------|
| app/ | 23 |
| assets/images/ | 9 |
| src/modules/ | 22 |
| src/services/ | 9 |
| src/shared/ | 18 |
| src/store/ | 3 |
| src/types/ | 2 |
| src/lib/ | 2 |
| **Total** | **~83+** |

---

*Last Updated: April 2026*
