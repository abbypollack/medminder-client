# “MedMinder,” a Medication Reminder and Interaction Checker

## Overview
MedMinder is a website application to help users manage their medication schedules effectively. It provides medication reminders and offers an interaction checker to identify potential conflicts when multiple medications are taken simultaneously.

### Problem
Medication non-adherence is a major problem in healthcare, resulting in treatment failures and complications. According to the CDC, approximately 50% of the 2 billion prescriptions filled each year are misused. Additionally, many chronic patients do not take their prescribed medications as directed or stop taking them altogether. Furthermore, some patients may not be aware of potential interactions between different drugs they are prescribed.

On the other hand, studies have shown that patients who use medication apps have higher adherence rates compared to those who receive usual care. These findings suggest that medication apps can be beneficial for patients with chronic health conditions in terms of improving medication adherence.

### User Profile
Users include individuals of all ages who are on medication regimens, including elderly users who may have complex medication schedules. Users will visit the web app and input their medication details, including dosage and timing. The app will then provide timely reminders for each medication dose. The interaction checker will analyze the user's medication list and alert them of potential interactions. 

- Special Considerations: The app should be user-friendly and accessible, especially for elderly users. Clear and simple interfaces, as well as adjustable font sizes, may be necessary. 

### Features
-	Users can add their medications, including name, dosage, frequency, and start/stop date.
-	The application sends timely reminders for each medication dose based on the user's input.
-	The app analyzes the user's medication list and checks for potential drug interactions, providing alerts when necessary.
-	Users can view a history of their medication adherence.
-	Users can create and manage their profiles, including personal information.

## Implementation

### Tech Stack
- Frontend: HTML5, CSS3, Sass, JavaScript, React (possibly React Bootstrap or Material-UI libraries for design).
- Backend: Node.js, Express, and MySQL.
- Cron Jobs & Twilio for SMS notifications

### APIs
- A drug interaction API that checks for potential drug interactions: https://lhncbc.nlm.nih.gov/RxNav/APIs/InteractionAPIs.html
-An API for RxTerms: https://clinicaltables.nlm.nih.gov/apidoc/rxterms/v3/doc.html
-An autocompleter package: http://lhncbc.github.io/autocomplete-lhc/index.html#installation

### Sitemap
Home Page, Sign Up Page, Login Page, Medication Input w/ Interaction Checker, Medication List w/ Interaction Checker, Medication History, User Profile

### Mockups
_To be updated_
![1](https://github.com/abbypollack/medminder/assets/126522113/5865a943-5c0b-4076-b9eb-d56c3ed681dd)

### Data
This project deals with various types of data:

- User data related to registered users, such as usernames, email addresses, and encrypted passwords. This data is stored in the MySQL database.
- Medication data, where users add details about their medications, including medication names, dosages, frequencies, and start/stop dates. This data is stored in the MySQL database.
- Medication reminders associated with individual medications and their corresponding dosages. They are triggered using cron jobs and communicated to users via Twilio for SMS notifications.
- Drug interaction data retrieved from the external API.
- Medication adherence history. This data is collected over time, tracking when users take their prescribed medications.
- User profile information: Users can create and manage their profiles, including personal information such as names, contact details, and medication preferences. This data is  stored securely in the MySQL database.

In summary, user profiles are linked to medication data, which, in turn, is used to generate reminders and perform drug interaction checks.

### Endpoints
#### User Registration Endpoint
- HTTP Method: POST
- Parameters:
username (string)
email (string)
password (string)
- Example Response:
Success: 201 Created
Error: 400 Bad Request

#### User Login Endpoint
- HTTP Method: POST
- Parameters:
email (string)
password (string)
- Example Response:
Success: 200 OK with JWT Token
Error: 401 Unauthorized

#### User Profile Retrieval Endpoint
- HTTP Method: GET
- Parameters: None (Authorization header with JWT token)
- Example Response:
Success: 200 OK with User Profile Data
Error: 401 Unauthorized

#### Medication Creation Endpoint
- HTTP Method: POST
- Parameters:
name (string)
dosage (string)
frequency (string)
start_date (date)
stop_date (date, optional)
- Example Response:
Success: 201 Created with Medication Data
Error: 400 Bad Request

#### Medication List Retrieval Endpoint
- HTTP Method: GET
- Parameters: None (Authorization header with JWT token)
- Example Response:
Success: 200 OK with Medication List Data
Error: 401 Unauthorized

#### Medication Interaction Check Endpoint
- HTTP Method: POST
- Parameters:
medications (array of medication objects)
- Example Response:
Success: 200 OK with Interaction Data
Error: 400 Bad Request

#### Medication Adherence History Endpoint
- HTTP Method: GET
- Parameters: None (Authorization header with JWT token)
- Example Response:
Success: 200 OK with Medication Adherence History Data
Error: 401 Unauthorized

#### User Profile Update Endpoint
- HTTP Method: PUT
- Parameters:
username (string, optional)
email (string, optional)
password (string, optional)
- Example Response:
Success: 200 OK with Updated User Profile Data
Error: 400 Bad Request

#### User Profile Deletion Endpoint
- HTTP Method: DELETE
- Parameters: None (Authorization header with JWT token)
- Example Response:
Success: 204 No Content
Error: 401 Unauthorized

### Auth
This project includes login and user profile functionality. Authentication and authorization will be implemented using OAuth 2.0 and JWT. 

## Roadmap
### Sprint Week 1: Frontend Development
**Day 1: Project Setup**
- Initial Folder Structure & git repo.
- Set up a new React project. Install all required NPM packages.
- Create Sass Variables, Mixins, Breakpoints, Colors and Font-face.
- Import assets.
- Set up React Router with basic routes needed for this project + create placeholder components.

**Day 2: Backend Setup**
- Set up a Node.js and Express backend server.
- Create routes for user registration and authentication.
- Implement OAuth 2.0 and JWT for authentication and authorization.
- Design the database schema for storing user information and medication data.
- Set up a MySQL database.
- Establish database connections and create necessary tables.

**Day 3-4: Home Page**
- Create the Home Page UI, including a header and footer component. Style and make responsive.
- Make navigation links functional.

**Day 5-6: Sign Up and Login Pages**
- Create the Sign Up and Login Page UI. Style and make responsive.
- Implement user registration and authentication forms.
- Integrate client-side form validation.

**Day 6-7: Medication Input Page**
- Develop the Medication Input Page UI. Style and make responsive.
- Build forms for users to input medication details.
- Implement form validation for medication input.

### Sprint Week 2: Backend Integration and Functionality

**Day 8-10: Medication List Page**
- Create the Medication List Page UI.
- Implement functionality to send medication reminders based on user input (cron jobs).
- Fetch and display user's medication data from the server.
- Implement medication interaction checker to provide alerts.

**Day 11-12: Medication History and User Profile**
- Create the Medication History and User Profile Page UI.
- Fetch and display medication adherence history.
- Allow users to update their profile information.

**Day 13: Help/FAQ Page**
- Create the Help/FAQ Page UI.

**Day 14: Finalize**
- Perform thorough testing and address any bugs or issues.
- Update this README.md.
- Deployment.

## Nice-to-haves
Customizable reminders, calender integration, exportable medication history for sharing with healthcare providers, implement barcode scanning for easy adding of medications, integration with wearable health devices, gamification of medication adherence (such as rewards/achievements), allergy alerts, and voice commands.

