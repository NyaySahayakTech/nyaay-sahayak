from services.embedding_service import SentenceTransformerEmbeddings
from services.faiss_service import load_index
from config.settings import TOP_K

embeddings = SentenceTransformerEmbeddings()

PROPERTY_KEYWORDS = [
    "land",
    "property",
    "plot",
    "house",
    "flat",
    "tenant",
    "rent",
    "boundary",
    "possession",
    "encroachment"
]


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

def auto_detect_retrieve(query):
    q = query.lower()

    for word in PROPERTY_KEYWORDS:
        if word in q:
            return (
                "property",
                retrieve_documents(
                    query,
                    "property"
                )
            )

    return (
        "general",
        retrieve_documents(
            query,
            "general"
        )
    )