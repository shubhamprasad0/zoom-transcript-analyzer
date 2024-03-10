# Local Setup and Usage Instructions

## Clone Repo and Install dependencies

```shell
git clone https://github.com/shubhamprasad0/zoom-transcript-analyzer.git
cd zoom-transcript-analyzer/app
cp .env.example .env.local
npm install
```

## Get Zoom OAuth credentials

Create a Zoom OAuth app by following the steps [here.](https://developers.zoom.us/docs/integrations/create/). While creating the app, take care of following:-
   - Select user-managed app (not admin-managed)
   - Use ZOOM_OAUTH_REDIRECT_URL from [.env.example](app/.env.example) to set oauth redirect url and oauth allow list.
   - Do not select anything in [Step 3](https://developers.zoom.us/docs/integrations/create/#step-3-select-zoom-products-and-features). Continue to [Step 4](https://developers.zoom.us/docs/integrations/create/#step-3-select-zoom-products-and-features).
   - In [Step 4](https://developers.zoom.us/docs/integrations/create/#step-3-select-zoom-products-and-features), add scope for meeting read and recording read.
   - Continue and generate authorization url. Copy the authorization url to `NEXT_PUBLIC_ZOOM_AUTH_URL` in `.env.local`.
   - Copy client id and client secret to `.env.local` too in their corresponding variables.

## Get HuggingFace token

To run the ML model, we are using HuggingFace Inference Endpoint. So, we need a token to call that inference endpoint.
  - Login / Signup on [HuggingFace](https://huggingface.co/)
  - Go to [token settings](https://huggingface.co/settings/tokens)
  - Create new token with READ access. Copy the token value to `.env.local` in the corresponding field (`HUGGINFACE_TOKEN`)

## Start development server

```
npm run dev
```

## Usage

1. Navigate to [localhost:3000](http://localhost:3000)
2. Login with your Zoom account. (In case the login button doesn't disappear after login, refresh the page)
3. Enter meeting ID (without spaces) which has a recording on the zoom cloud. (Only paid zoom acccounts can have cloud recordings). Cloud recordings can be checked [here.](https://zoom.us/recording)
4. The UI should update with transcript and questions.


# Potential Improvements

1. Transcripts can be saved in a database against the meeting id to avoid calling the zoom api again for fetching transcripts.
2. Error handling can be much better. Currently, many edge cases can cause the app to fail as a lot of the code assumes the APIs will work as expected (due to time constraints).
3. Had plans to try different preprocessing techniques (using spacy or NLTK) to better identify sentences. The current implementation is just a crude implementation using regex.
4. Had also planned a separate python service for ML and containerized applications (skipped due to time constraints). So, instead ended up using the HuggingFace inference endpoint. Potential for improvement by finetuning the model on custom data.
4. Have skipped adding tests (unit and integration tests)
5. Had planned to deploy on vercel to make usage easier; this would have allowed anyone to directly use the app without setting up a zoom oauth app or huggingface app. (Facing issue here as token is not getting set properly in vercel env, need to debug that)