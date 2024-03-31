# Threadly

This project is a clone of Threads, a platform for communication and collaboration, built using Next.js 14. It incorporates various technologies such as MongoDB for database management, AWS S3 for file uploading, Tailwind CSS and Shadcn UI for UI design, and Clerk for user management.

## Technologies Used

- **Next.js 14**

- **MongoDB**

- **AWS S3**

- **Tailwind CSS**

- **Shadcn UI**

- **Clerk**

## Deployed Application

This application is deployed and accessible here.

[threadly-web.vercel.app](https://threadly-web.vercel.app/).

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository**: Clone this repository to your local machine using the following command:

   ```
   https://github.com/ujjawal30/threadly.git
   ```

2. **Install dependencies**: Navigate to the project directory and install the necessary dependencies using npm or yarn:

   ```
   cd threadly
   npm install
   ```

3. **Set up environment variables**: Create a `.env.local` file in the root of your project and add the following environment variables:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_CLERK_WEBHOOK_SECRET=

   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

   MONGODB_URL=

   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   AWS_S3_REGION=
   AWS_S3_BUCKET=
   AWS_S3_BUCKET_URL=
   ```

4. **Start the development server**: Once the dependencies are installed and environment variables are set, start the development server using the following command:

   ```
   npm run dev
   ```

5. **Access the application**: Open your web browser and navigate to `http://localhost:3000` to access the Threadly application.

## Contributors

- [Ujjawal Gupta](https://github.com/ujjawal30)
