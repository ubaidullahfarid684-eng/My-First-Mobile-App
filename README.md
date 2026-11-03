# Deepbot-mini

Deepbot-mini is an Expo React Native app with a bottom tab layout, local CRUD storage, and live public API data. The app keeps the existing home and explore screens while adding a Records tab for local note management and an API Data tab for fetching data from a public endpoint.

## Features

- CRUD records with local storage using AsyncStorage
- Search and category filtering for records
- Create, edit, and delete flow with validation and confirmation dialogs
- Public API data screen using Axios with loading, retry, and empty/error states
- Expo app icon and splash screen retained from the original project configuration

## API used

This app uses the DummyJSON Products API:

- Endpoint: `https://dummyjson.com/products?limit=12`
- Data type: JSON array of product objects

## Setup and run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo development server:

   ```bash
   npx expo start
   ```

3. Open the app on a simulator/emulator or use Expo Go on an Android device.

## Lint and type-check

```bash
npx expo lint
npx tsc --noEmit
```

## APK build

This project is an Expo managed app with an APK build profile configured in `eas.json`.

Generate the Android APK through EAS:

```bash
npx eas-cli build --platform android --profile preview
```

Alternatively, if the `eas` binary is available in your PATH:

```bash
eas build -p android --profile preview
```

The configured preview build uses `android.buildType: "apk"` in `eas.json`, so it produces an `.apk` file, not an `.aab`.

## Notes

- Local records are stored in AsyncStorage and persist across app restarts.
- Search and filter logic is kept in the `useRecords` hook and screen components.
- The API client is configured in `src/api/client.ts` and the product fetch is handled in `src/api/products.ts`.
