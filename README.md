# BhcJobs – Mobile App

A React Native mobile application built for the BhcJobs platform — connecting Bangladeshi job seekers with verified employers in Saudi Arabia.

---

## Why I built it this way

The task required building a landing page, login, and registration screen using the provided REST APIs. I used Expo (managed workflow) to keep the setup simple and focused on UI/UX quality rather than native configuration. Navigation is handled with React Navigation, and all API calls are centralized in a single service file using Axios.

---

## Screens

**Landing Page**
- Hero section with live job/company/industry stats pulled from the API
- Search bar to filter jobs by title or company name
- Horizontally scrollable Popular Industries section
- Recommended Jobs list with salary, location, deadline info
- Horizontally scrollable Popular Companies section
- Pull-to-refresh support

**Login Page**
- Phone number and password fields
- Inline field validation with error messages
- Password visibility toggle
- Loading spinner during API call
- Navigation to Register screen

**Registration Page**
- 8 fields: Full Name, Mobile, Date of Birth, Passport No, Gender, Email, Password, Confirm Password
- All fields validated before submission
- Gender selection with toggle buttons
- OTP verification step after successful registration
- Navigation back to Login

---

## Tech Stack

- React Native (Expo SDK 54)
- React Navigation — Native Stack
- Axios — API requests
- @expo/vector-icons — Icons

---

## Project Structure

```
BhcJobs/
├── App.js
├── app.json
├── eas.json
├── package.json
├── README.md
└── src/
    ├── navigation/
    │   └── AppNavigator.js
    ├── screens/
    │   ├── LandingScreen.js
    │   ├── LoginScreen.js
    │   └── RegisterScreen.js
    ├── components/
    │   ├── IndustryCard.js
    │   ├── JobCard.js
    │   └── CompanyCard.js
    └── services/
        └── api.js
```

---

## API Endpoints Used

Base URL: `https://dev.bhcjobs.com`

| Method | Endpoint | Used in |
|--------|----------|---------|
| GET | `/api/industry/get` | Landing Page |
| GET | `/api/job/get` | Landing Page |
| GET | `/api/company/get` | Landing Page |
| POST | `/api/job_seeker/register` | Register Screen |
| POST | `/api/job_seeker/phone_verify` | OTP Verification |
| POST | `/api/job_seeker/login` | Login Screen |

---

## Setup Instructions

Make sure you have Node.js (v18+) installed.

```bash
# Clone the repo
git clone https://github.com/nerobkabir/BhcJobs.git
cd BhcJobs

# Install dependencies
npm install

# Start the development server
npx expo start
```

Then install **Expo Go** from the Play Store on your Android phone and scan the QR code.

---

## Notes

- The API returns nested objects (e.g. `company`, `country`, `industry` inside job data). Components handle all these cases safely with optional chaining.
- API response structure is normalized in `fetchAllData` to support multiple possible response shapes.
- Gender value is sent as lowercase (`male` / `female`) to match the API expectation.
- Date of birth format expected by the API: `YYYY-MM-DD`

---

## APK

Download the latest APK from the build link:
https://expo.dev/accounts/kabirhossain/projects/bhcjobs/builds/16271b05-dab0-4d77-86aa-8ad471ad20e0