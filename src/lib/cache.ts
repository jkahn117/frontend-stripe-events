import {
  CacheClient,
  Configurations,
  CreateCacheResponse,
  EnvMomentoTokenProvider
} from "@gomomento/sdk";

export async function getCacheClient() {
  return await CacheClient.create({
    configuration: Configurations.Laptop.latest().withClientTimeoutMillis(3000),
    credentialProvider: new EnvMomentoTokenProvider({
      environmentVariableName: "MOMENTO_API_KEY",
    }),
    defaultTtlSeconds: 3,
  });
}

export async function ensureCacheExists(cacheName: string): Promise<void> {
  const momento = await getCacheClient();
  const createCacheResponse = await momento.createCache(cacheName);
  switch (createCacheResponse.type) {
    case CreateCacheResponse.AlreadyExists:
      console.log(`Cache ${cacheName} already exists.`);
      break;
    case CreateCacheResponse.Success:
      console.log(`Cache ${cacheName} created successfully.`);
      break;
    case CreateCacheResponse.Error:
      console.error(`Error creating cache ${cacheName}: ${createCacheResponse.message}`);
      throw new Error(`Error creating cache ${cacheName}: ${createCacheResponse.message}`);
  }
}
