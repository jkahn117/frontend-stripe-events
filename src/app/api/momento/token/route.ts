import {
  AuthClient,
  CredentialProvider,
  DisposableTokenScopes,
  ExpiresIn,
  GenerateDisposableTokenResponse
} from "@gomomento/sdk";

const authClient = new AuthClient({
  credentialProvider: CredentialProvider.fromString({
    apiKey: process.env.MOMENTO_API_KEY!,
  })
});

export async function GET(request: Request) {
  // only dealing with open authentication method
  let generatedDisposableTokenResponse = await fetchTokenWithOpenAuth();

  switch (generatedDisposableTokenResponse.type) {
    case GenerateDisposableTokenResponse.Success:
      return new Response(
        generatedDisposableTokenResponse.authToken, {
          headers: {
            "Cache-Control": "no-cache",
          },
        },
      );
    case GenerateDisposableTokenResponse.Error:
      throw new Error(generatedDisposableTokenResponse.message());    
  }
}

async function fetchTokenWithOpenAuth() {
  return await authClient.generateDisposableToken(
    DisposableTokenScopes.topicSubscribeOnly(
      String(process.env.NEXT_PUBLIC_MOMENTO_CACHE_NAME),
      String(process.env.NEXT_PUBLIC_MOMENTO_TOPIC_NAME)
    ),
    ExpiresIn.minutes(30),
  );
}