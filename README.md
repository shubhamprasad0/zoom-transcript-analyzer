# zoom-transcript-analyzer
Analyze and extract relevant information from zoom transcripts

## Architecture and Plan of Action
  
- Main application to be developed in Next.js (for frontend and backend)
- A python service to expose NLP algorithms via a FastAPI server
- Frontend will ask the user to authenticate with zoom using OAuth. (will need to create an app on zoom marketplace for this; need to figure out how to use this without publishing the app)
- Expose an endpoint for authentication on the backend. The frontend will get a code from zoom during oauth, frontend will pass this to backend and backend will generate an access token using zoom's token api, using the code. This token will be passed to the frontend, which can be stored in a cookie.
- Now, user can give a meeting id on the UI. The frontend calls a backend endpoint (say `GET /transcripts?meeting_id={meetingId}`) with the meeting id and the access token.
- backend fetches the trancript using zoom API, saves it in a mongodb collection (for future usage) and returns the transcript to the client.
- Frontend can then ask the backend to extract questions out of the transcript using another backend endpoint (say `GET /transcripts/{id}/questions`). The js backend calls the python service to do the actual operation. The python service fetches the transcript from mongodb, runs its NLP algorithm(s) over the transcript and then returns the extracted questions to the js backend. The js backend then forwards them to the frontend for rendering.
- The python service can use NLP text processing libraries like spacy / NLTK to extract sentences from the transcript. It can then detect question words like "What", "Where", "How", "When", etc. to figure out if the sentence is a question. First target is to complete the application end-to-end using this heuristic model, and then improve upon it using some advanced pretrained NLP models like BERT (if available for this task). Once we have extracted sentences from the transcript, it can be seen as a classification task of whether a sentence is a question or not. I still need to figure out if I can find an open source pretrained model for this task, or do I need to train such a model on my own. Will try to avoid training model as of now due to time constraints, as I'll need to prepare a dataset first. Will take the model related decision after seeing how the heuristic algorithm works in practice.
- I plan to dockerize these applications and provide a docker compose file so that it's easy to start and stop the services. It will also make getting started on the project easier.

# TODOs

- **Step 1: OAuth Setup**
  - [x] Initialize next app
  - [x] Create UI with button to authenticate with zoom
  - [x] Create app on zoom marketplace for oauth
  - [x] Complete frontend flow to get authorization code from zoom using oauth
  - [x] Create backend endpoint to get access token from zoom
  - [x] Call backend endpoint and get access token, save it in cookie (backend sets it in cookie)
  - [x] Handle logged in state in client

- **Step 2: Get meeting transcript and questions from the transcript**
  - [ ] Add text box and submit button on UI when logged in for user to enter meeting id
  - [ ] Create backend endpoint to get meeting details using zoom API
  - [ ] Create python service with question identification algorithm (dummy for now)
  - [ ] Once we get transcript from zoom API, pass this transcript to python service and get the questions out. (Plan was to save transcript in a database, and have a separate backend endpoint to get questions using the transcript's id stored in the db. Just combining these two now due to time constraint.)
  - [ ] Get questions from python service and return the complete transcript and the questions to the frontend.