# SubSystem

This project is a submission for the CS476 final project. It is composed of two main components: a **React UI** and a **ASP.NET API**. Follow the steps below to set up and run the application.

---

## Requirements

### UI (React / TypeScript)
- **Node.js**: Version 18+ is recommended.
- **npm**: Included with Node.js.

### API (ASP.NET / C#)
- **.NET**: Version 8+ is required.

### Recommended Editors
- **Visual Studio Code**: Recommended for React/TS development. 
- **Visual Studio**: 2022 or later is recommended for backend C# development.

### Database
- **PostgreSQL Database**: The API requires a connection to a PostgreSQL database. Any PostgreSQL database should work. Have your connection string ready. 
---

## Setup

You will need to start two things (not including the database) to get the project working. Both the frontend and the backend must be started separately.

### UI (React App)
- In a terminal, navigate to the ui folder.
- Run `npm install` to install dependencies.
- Run `npm start` to start the development server. 
  - You should be able to see the login screen at localhost:3000 in your browser.

### API (.NET Core)
- Open the .sln file in the api folder using Visual Studio 2022.
- Open the appsettings.Development.json file and configure the `dbConnectionString` under ConnectionStrings with a valid PostgreSQL connection string. Formatted as:

    - `User Id=userid;Password=password;Server=serveraddress;Port=5432;Database=postgres;CommandTimeout=30`

#### When starting with a new database

- When starting a new project with a new database **or when making changes to the data model**, we need to perform a database migration.
- In Visual Studio, go to `Tools -> NuGet Package Manager -> Package Manager Console` 

- In the console, first enter: `add-migration migrationname`
- Once that is complete, enter `update-database`
- Your database is now ready!

#### Start the API
- Start the API by pressing F5 or pressing the green "Play" button in Visual Studio.


## First Admin User

Accounts on the website must be approved by an existing administrator. This poses a slight issue when starting without any existing users. For new projects, follow these instructions to create the first Administrator account: 
- Launch the application as described above. 
- Sign up and request to be an administrator. 
- **Manually change** the `EmailConfirmed` field on the user you just created to `TRUE`. 
  - The user can be found in the `AspNetUsers` table in the `identity` schema. 
## Testing

### API Tests

This project makes use of Xunit for unit testing the API. The api.Tests folder contains unit tests. Use the Test Explorer in Visual Studio to run the tests (Test -> Test Explorer).


## Notes

- Default ports: React UI runs on http://localhost:3000 and the API runs on https://localhost:7287 unless otherwise configured.


- Feel free to reach out for support if you encounter issues during setup.