import algoliasearch from 'algoliasearch';

export async function updateAlgolia(algoliaIndex: string, record: any): Promise<void> {
  const config = useRuntimeConfig();

  const algoliaClient = algoliasearch(
    config.algoliaAppId,
    config.algoliaAdminApiKey,
  );

  const algoliaIndexManager = algoliaClient.initIndex(algoliaIndex);

  await algoliaIndexManager
    .saveObject(record, { autoGenerateObjectIDIfNotExist: true })
    .catch((err) => console.log(err));
}