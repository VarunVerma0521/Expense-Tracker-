import {createApp, GenkitError} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// IMPORTANT: Before running this, you need to provide your Google AI API key
// in the .env file. For example:
//
//   GOOGLE_API_KEY="<YOUR_API_KEY>"
//
createApp({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
  // You can define flows here, or in a separate file and import them.
  // For example:
  //
  //   flows: [..., ...],
  //
  flow: (err, result, context) => {
    // Only log errors in production.
    if (process.env.NODE_ENV === 'production' && err instanceof GenkitError) {
      console.error(err.message, err.stack, err.details);
    }
  },
});
