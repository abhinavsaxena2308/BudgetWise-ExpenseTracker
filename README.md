# BudgetWise
[![Next.js](https://img.shields.io/badge/Next.js-13-blue?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-yellow?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-Responsive-green?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![ShadCN UI](https://img.shields.io/badge/ShadCN_UI-Components-purple?logo=react&logoColor=white)](https://ui.shadcn.com/)
[![Lucide React](https://img.shields.io/badge/Lucide-React-lightgrey)](https://lucide.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-Charts-orange?logo=react&logoColor=white)](https://recharts.org/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-Forms-blue?logo=react&logoColor=white)](https://react-hook-form.com/)
[![Zod](https://img.shields.io/badge/Zod-Schema_validation-red?logo=typescript&logoColor=white)](https://zod.dev/)
[![Firebase Genkit](https://img.shields.io/badge/Genkit-AI-lightblue)](https://firebase.google.com/docs/genkit)

BudgetWise is a modern, responsive web application designed for personal budget management and expense tracking. It provides users with tools to monitor their spending, set budgets, and receive AI-powered financial advice to better achieve their financial goals.

Built with a modern tech stack including Next.js, Firebase, and Genkit for AI, this application offers a seamless and interactive user experience.

## Core Features

- **Authentication**: Secure user sign-up and login using Email/Password and Google.
- **Dashboard**: An at-a-glance overview of total spending, budget status, and recent transactions.
- **Expense Tracking**: Easily add and categorize expenses.
- **Budget Management**: Create and manage monthly budgets for different spending categories.
- **Visual Reports**: Interactive charts to visualize spending patterns and category breakdowns.
- **AI Personal Advisor**: Get personalized suggestions to improve budgeting habits based on spending data.
- **User Profile**: Update your display name and profile picture.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage)
- **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- `npm` or `yarn` package manager

### 1. Firebase Setup

This project is integrated with Firebase. To run it locally, you need to connect it to your own Firebase project.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new Firebase project or use an existing one.
3.  In your project, go to **Project Settings** > **General**.
4.  Under "Your apps", create a new **Web app**.
5.  Copy the `firebaseConfig` object provided.
6.  Update the configuration in `src/firebase/config.ts` with the values from your project.

### 2. Enable Firebase Services

You will need to enable the following services in the Firebase Console for the app to function correctly:

- **Authentication**: Go to the **Authentication** section, click "Get started", and enable the **Email/Password** and **Google** sign-in providers.
- **Firestore Database**: Go to the **Firestore Database** section, click "Create database", and start in **production mode**. You will need to configure security rules to allow access.
- **Storage**: Go to the **Storage** section and click "Get started" to enable it.

### 3. Installation

Clone the repository and install the dependencies.

```bash
git clone <repository-url>
cd budgetwise
npm install
```

### 4. Running the Application

Once the dependencies are installed, you can run the development server.

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

The Genkit AI flows can be tested separately using the Genkit developer UI:

```bash
npm run genkit:watch
```

This will start the Genkit development server, typically on port `4000`.

## Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Creates a production-ready build of the application.
- `npm run start`: Starts the application in production mode.
- `npm run lint`: Lints the project files for errors.
- `npm run genkit:dev`: Starts the Genkit development server once.
- `npm run genkit:watch`: Starts the Genkit server and watches for file changes.
