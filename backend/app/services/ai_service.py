"""
Extractive AI summary generator.
No external LLM required — derives summary, topics, and chapters
directly from transcript text.
"""
import json
import re
from collections import Counter


def _sentences(text: str) -> list[str]:
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if len(s.strip()) > 20]


def generate_summary(transcript_lines: list[dict]) -> dict:
    """
    Given a list of transcript line dicts with keys:
        speaker, text, start_time, end_time, sequence
    Returns:
        overview: str
        key_topics: JSON string of [{title, description}]
        chapters: JSON string of [{title, start_time}]
    """
    if not transcript_lines:
        return {
            "overview": "No transcript available for this meeting.",
            "key_topics": json.dumps([]),
            "chapters": json.dumps([]),
        }

    # ── Collect speaker stats ─────────────────────────────────────────────
    speaker_texts: dict[str, list[str]] = {}
    for line in transcript_lines:
        sp = line["speaker"]
        speaker_texts.setdefault(sp, []).append(line["text"])

    speakers = list(speaker_texts.keys())
    total_lines = len(transcript_lines)
    total_duration = transcript_lines[-1]["end_time"] if transcript_lines else 0
    duration_min = round(total_duration / 60, 1)

    # ── Build overview ────────────────────────────────────────────────────
    all_text = " ".join(line["text"] for line in transcript_lines)
    all_sentences = _sentences(all_text)

    # Pick first and last substantive sentences + one from each unique speaker
    summary_sentences = []
    if all_sentences:
        summary_sentences.append(all_sentences[0])
    for sp, texts in speaker_texts.items():
        for t in texts:
            sents = _sentences(t)
            if sents and sents[0] not in summary_sentences:
                summary_sentences.append(sents[0])
                break
    if all_sentences and len(all_sentences) > 1:
        summary_sentences.append(all_sentences[-1])

    speaker_list = ", ".join(speakers[:-1]) + (" and " + speakers[-1] if len(speakers) > 1 else (speakers[0] if speakers else ""))
    overview = (
        f"This meeting involved {len(speakers)} participant(s): {speaker_list}. "
        f"The discussion lasted approximately {duration_min} minutes and covered {total_lines} exchanges. "
        + " ".join(summary_sentences[:3])
    )

    # ── Extract key topics via word frequency ─────────────────────────────
    stop_words = {
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "is", "it", "this", "that", "was", "be", "are", "we",
        "i", "you", "he", "she", "they", "we", "our", "so", "just", "like",
        "yeah", "okay", "ok", "um", "uh", "right", "well", "think", "know",
        "going", "get", "got", "have", "has", "had", "do", "did", "about",
        "from", "will", "would", "could", "should", "can", "been", "also",
        "its", "my", "your", "their", "all", "not", "more", "some", "one",
        "really", "very", "if", "what", "how", "when", "where", "who",
    }

    words = re.findall(r"\b[a-zA-Z]{4,}\b", all_text.lower())
    word_freq = Counter(w for w in words if w not in stop_words)
    top_words = [w for w, _ in word_freq.most_common(15)]

    # Group top words into 3–5 topic clusters (naive: just label them)
    topic_labels = [
        "Main Discussion", "Key Decisions", "Follow-up Items",
        "Technical Details", "Next Steps"
    ]
    key_topics = []
    chunk_size = max(1, len(top_words) // 5)
    for i, label in enumerate(topic_labels):
        chunk = top_words[i * chunk_size: (i + 1) * chunk_size]
        if not chunk:
            break
        desc_parts = []
        for line in transcript_lines:
            if any(w in line["text"].lower() for w in chunk):
                desc_parts.append(line["text"])
                if len(desc_parts) >= 2:
                    break
        description = " ".join(desc_parts[:1]) if desc_parts else f"Topics: {', '.join(chunk)}"
        key_topics.append({"title": label, "description": description[:200]})

    # ── Build chapters (split transcript into ~4 segments) ────────────────
    num_chapters = min(4, max(1, total_lines // 5))
    segment_size = total_lines // num_chapters
    chapter_titles = ["Opening", "Core Discussion", "Deep Dive", "Wrap-up"]
    chapters = []
    for i in range(num_chapters):
        idx = i * segment_size
        line = transcript_lines[idx]
        title = chapter_titles[i] if i < len(chapter_titles) else f"Section {i + 1}"
        chapters.append({"title": title, "start_time": line["start_time"]})

    return {
        "overview": overview,
        "key_topics": json.dumps(key_topics),
        "chapters": json.dumps(chapters),
    }
