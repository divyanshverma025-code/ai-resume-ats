import hashlib
import re
from typing import Iterable, Union

import numpy as np


class LightweightEmbedder:
    """Very small deterministic text embedder for low-memory deployments.

    It intentionally implements the small subset of the SentenceTransformer
    interface used by this project: ``encode(..., convert_to_tensor=False)``.
    It uses word + character n-gram hashing into a fixed-size vector and then
    returns a normalized float32 vector. This keeps the API and scoring code
    simple while avoiding PyTorch/SentenceTransformers RAM usage.
    """

    def __init__(self, dimension: int = 256):
        self.dimension = int(dimension)

    def _encode_one(self, text: str) -> np.ndarray:
        vector = np.zeros(self.dimension, dtype=np.float32)
        text = str(text or '').lower()
        if not text.strip():
            return vector

        words = re.findall(r"[a-z0-9+#.]{2,}", text)
        features = list(words)
        for word in words:
            padded = f"^{word}$"
            for n in (3, 4):
                features.extend(padded[i:i+n] for i in range(max(0, len(padded) - n + 1)))

        for feature in features:
            digest = hashlib.blake2b(feature.encode('utf-8'), digest_size=8).digest()
            index = int.from_bytes(digest[:4], 'little') % self.dimension
            sign = 1.0 if (digest[4] & 1) == 0 else -1.0
            vector[index] += sign

        norm = float(np.linalg.norm(vector))
        if norm > 0:
            vector /= norm
        return vector

    def encode(
        self,
        sentences: Union[str, Iterable[str]],
        convert_to_tensor: bool = False,
        **_,
    ):
        if isinstance(sentences, str):
            return self._encode_one(sentences)
        return np.stack([self._encode_one(item) for item in sentences])


DEFAULT_EMBEDDER = LightweightEmbedder()
