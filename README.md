# Student Management System (SMS)
## Overview
A full-stack Student Management System built with Next.js, Express.js, and MongoDB that provides role-based access control for managing student information. The system allows admins to manage student records while students can view and update their own profiles.
## Features
- **User Authentication**: JWT-based login/logout
- **Role-Based Access Control**:
    - Admin: Full CRUD operations on student records
    - Student: View and update own profile
- **Student Management**:
     - Add, edit, delete student records

   - Filter and search students

  - Update student status (Active/Graduated/  Dropped)
- **Profile Management:**
    - Update personal information

    - Change profile picture (optional)
- **Responsive Design**: Works on all device  sizes

## Tech Stack
 ### Frontend
  - Next.js 14 (App Router)

- React 18

- TypeScript

- Tailwind CSS

- Heroicons

### Backend
 - Node.js

- Express.js

- MongoDB (with Mongoose)

- JSON Web Tokens (JWT)

## Getting Started
### Prerequisites
 - Node.js (v18 or higher)

- MongoDB Atlas account or local MongoDB instance

- Git
1. **Installation**:
    -  git clone https://github.com/belyseing/Student-Management-System-Frontend.git

    -  cd **Student-Management-System-Frontend**

2. **Install dependencies**: 
     - npm install
3. **Start the development server**:
     - npm run dev

4. **run it**:
     - Open your browser : http://localhost:3000/

### Set up environment variables:

-  Environment Variables Create .env.local   file in the root directory:

    **example**: NEXT_PUBLIC_API_URL=http://  localhost:3000/api
        

## Usage
### Default Accounts
 #### Admin Account:
  - **Email**: admin@quicktech.com
  - **password**: QuicktechAdmin2024!
#### Student Accounts:
 1. - Email: belyse@student.edu
     - Password: BelysePassword123!

 ****
2.   - Email: igor@student.edu
     - Password: IgorPassword456!
    
## Features Guide
#### Admin Dashboard
 - View all students with filtering options

- Add new students

- Edit/delete student records

- Change student status

- Promote students to admin role
#### Student Profile
 - View personal information

- Update profile details

- View enrollment status

## Deployment
  To deploy this project:
  1. **Frontend**: Deploy to Vercel
    
   2. **Backend**: Deploy to Render 

    - Set up a Node.js service

    - Add environment variables

    - Connect to MongoDB Atlas

3. **Database**: Use MongoDB Atlas for production

## License
 This project is licensed under the MIT License.