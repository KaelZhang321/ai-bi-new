from openai import OpenAI

from app.config import settings

_client: OpenAI | None = None


def get_volcano_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(
            api_key=settings.VOLCANO_API_KEY,
            base_url=settings.VOLCANO_BASE_URL,
        )
    return _client


def chat_completion(prompt: str, system: str = "") -> str:
    client = get_volcano_client()
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    response = client.chat.completions.create(
        model=settings.VOLCANO_MODEL,
        messages=messages,
        temperature=0.1,
        max_tokens=2048,
    )
    return response.choices[0].message.content or ""
