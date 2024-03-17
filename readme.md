# Election Voting System API

## Admin Login id and password
- JSON Format:
    ```json
    {
       "aadharNumber":"5434",
    "password":"qwerty1121"
    }
    ```

## User Authentication

- **Sign Up**
  - `/signup` (POST): Create a new user account.
  - JSON Format:
    ```json
    {
       "name": "string",
       "age": "number",
       "email": "string",
       "mobile": "string",
       "address": "string",
       "aadharNumber": "string",
       "password": "string",
       "role": "string" // "user" or "admin"
    }
    ```

- **Login**
  - `/login` (POST): Log in to an existing account.

## Voting

- **List of Candidates**
  - `/candidates` (GET): Show all the list of candidates.

- **Vote for a Candidate**
  - `/candidates/:candidateId` (POST): Vote for a specific candidate.

## Vote Counts

- **Live Vote Count**
  - `/vote/counts` (GET): Get the list of candidates in sorted order by their vote counts.

## User Profile

- **Get User Profile**
  - `/profile` (GET): Get the user's profile information.

- **Change Password**
  - `/profile/password` (PUT): Change the user's password.

## Admin Candidate Management

- **Create a Candidate**
  - `/candidates` (POST): Create a new candidate.
  - JSON Format:
    ```json
    {
        "name": "string",
        "party": "string",
        "age": "number"
    }
    ```

- **Update Candidate**
  - `/candidates/:candidateId` (PUT): Update candidate information.

- **Delete Candidate**
  - `/candidates/:candidateId` (DELETE): Delete an existing candidate.
