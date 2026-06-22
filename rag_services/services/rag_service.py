from services.embedding_service import SentenceTransformerEmbeddings
from services.faiss_service import load_index
from config.settings import TOP_K

embeddings = SentenceTransformerEmbeddings()


def retrieve_documents(query, index_name):
    vector_store = load_index(
        embeddings,
        index_name
    )

    results = vector_store.similarity_search_with_score(
        query,
        k=TOP_K
    )

    return results