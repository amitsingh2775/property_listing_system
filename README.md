SDE Intern Backend Assignment: Property Listing System
Project Overview
This backend system for property listings, built with Node.js, TypeScript, MongoDB, and Redis, fulfills all tasks of the SDE Intern Backend Assignment. It supports CSV import, CRUD operations, advanced filtering, caching, authentication, favorites, and bonus tasks (deployment, recommendations). Deployed on Render for evaluation.
Tasks Completed

CSV Import: i have already imported in my database therefor you don't need to be import


Submission Details

Deployed Link: https://property-listing-system-3.onrender.com
GitHub Repository:https://github.com/amitsingh2775/property_listing_system

Tech Stack

Backend: Node.js, TypeScript, Express
Database: MongoDB (MongoDB Atlas)
Caching: Redis (Upstash Redis)
Authentication: JWT
Validation: express-validator
CSV Import: axios
Deployment: Render

Project Setup
Prerequisites

Node.js (18.x+), MongoDB Atlas, Upstash Redis, Postman, Git

Local Setup

Clone Repository:
git clone https://github.com/amitsingh2775/property_listing_system
cd property_listing_system



Install Dependencies:
npm install


Set Up Environment:

Create .env:MONGODB_URI=MONGODB_URI
UPSTASH_REDIS_URL=rediss://default:AU9gAAIjcDFlMTZjMTg4ODYyNDI0YjhkYjgzZjViZjI0YzVkNWRiM3AxMA@pumped-mastodon-20320.upstash.io:6379
JWT_SECRET=243zEFzefrfg
PORT=3000


Note: Already configured in Render.


Run Locally:
npm run build
npm run start


Runs on http://localhost:3000.



API Testing with Postman
Overview
A Postman collection tests all features: CSV import, CRUD, filtering, caching, authentication, favorites, and recommendations.

Postman Collection: Property Listing System API Tests

Testing Steps

Install Postman:

Download from https://www.postman.com/downloads/.


Import Collection:

In Postman, click Import > Link.
Paste: https://web.postman.co/workspace/My-Workspace~a2f3626f-2545-4708-840b-35df11aace0c/collection/36974728-4fd6faef-6216-4009-8244-5022a402ca60?action=share&creator=36974728
Click Continue > Import.
Note: Request access from creator (ID: 36974728) if needed.


Set Up Environment:

Create environment PropertyListingEnv in Postman.
Add variables:
baseUrl: https://property-listing-system-3.onrender.com
token: (leave blank, set after login)
propertyId: (leave blank, set after property creation)




Run Tests:

Select PropertyListingEnv.
In Postman, go to the collection > Run Collection.
Click Run Property Listing System API Tests.



Test Details

Authentication: Register (POST /api/auth/register), Login (POST /api/auth/login).
Properties: Import CSV, CRUD (POST, GET, PUT, DELETE /api/properties), Filter (GET /api/properties?city=Mumbai).
Favorites: Add, view, remove (POST, GET, DELETE /api/favorites).
Recommendations: Send, view (POST, GET /api/recommendations).
Caching: Verifies faster response on second GET /api/properties request.

Notes for Testing

Clear MongoDB database (property-listing > users, properties) before testing.
If tests fail, check server logs or MongoDB/Redis connections.

API Endpoints

Authentication:
POST /api/auth/register: Register user.
POST /api/auth/login: Login, get JWT.


Properties:
POST /api/properties/import: Import CSV (authenticated).
POST /api/properties: Create property (authenticated).
GET /api/properties: List with filtering (cached).
GET /api/properties/:id: Get property (cached).
PUT /api/properties/:id: Update (authenticated, creator only).
DELETE /api/properties/:id: Delete (authenticated, creator only).


Favorites:
POST /api/favorites: Add favorite (authenticated).
GET /api/favorites: View favorites (cached).
DELETE /api/favorites/:propertyId: Remove favorite.


Recommendations:
POST /api/recommendations: Recommend property (authenticated).
GET /api/recommendations: View recommendations.




Thank you for reviewing my submission!
