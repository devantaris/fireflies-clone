"""
Seeds the database with realistic sample meetings, transcripts, summaries,
and action items so the app is immediately populated on first run.
"""
import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import Meeting, Participant, TranscriptLine, Summary, ActionItem
from app.services.ai_service import generate_summary


SEED_MEETINGS = [
    {
        "title": "Q4 Product Roadmap Planning",
        "days_ago": 2,
        "duration": 3240,  # 54 min
        "participants": [
            {"name": "Sarah Chen", "email": "sarah@company.com"},
            {"name": "Marcus Webb", "email": "marcus@company.com"},
            {"name": "Priya Nair", "email": "priya@company.com"},
        ],
        "transcript": [
            ("Sarah Chen", "Good morning everyone, let's get started with the Q4 roadmap planning session.", 0, 5),
            ("Marcus Webb", "Thanks Sarah. I've pulled up the backlog and we have about forty feature requests to prioritize.", 6, 12),
            ("Priya Nair", "Before we dive in, should we align on the key themes for Q4? I was thinking we focus on performance and user retention.", 13, 20),
            ("Sarah Chen", "Agreed. Performance has been a recurring theme in the user feedback. Our load times are still above two seconds for the dashboard.", 21, 28),
            ("Marcus Webb", "Right. I have that as a P0 item. The backend team estimated roughly three weeks to implement the caching layer.", 29, 36),
            ("Priya Nair", "We also need to talk about the mobile experience. Our iOS session length dropped by twelve percent last month.", 37, 44),
            ("Sarah Chen", "That's significant. Do we have the root cause analysis from the mobile team?", 45, 50),
            ("Marcus Webb", "Not yet, but James is supposed to send it over by end of day today.", 51, 56),
            ("Priya Nair", "Let's make that a blocker before we finalize the mobile roadmap items.", 57, 62),
            ("Sarah Chen", "Agreed. Moving on to the new features, what's the status on the analytics dashboard?", 63, 68),
            ("Marcus Webb", "Design is done, we're waiting on the API contracts from the data team. Estimated four weeks of dev time.", 69, 76),
            ("Priya Nair", "Four weeks feels aggressive given the current sprint velocity. Can we phase it? Maybe launch basic metrics in week one and advanced charts in week three?", 77, 86),
            ("Sarah Chen", "That's a good call. Let's structure it as two milestones. Marcus, can you update the roadmap doc?", 87, 93),
            ("Marcus Webb", "Sure, I'll have that updated by EOD tomorrow.", 94, 98),
            ("Priya Nair", "What about the onboarding flow? We discussed A/B testing two variants last sprint.", 99, 105),
            ("Sarah Chen", "The first variant has been running for two weeks. Conversion is up eight percent on the shorter flow.", 106, 113),
            ("Marcus Webb", "That's great data. I say we ship the shorter flow and kill the experiment.", 114, 119),
            ("Priya Nair", "Agreed. Let's make it the default. Who owns the rollout?", 120, 125),
            ("Sarah Chen", "I'll coordinate with the growth team. Target is end of next week.", 126, 131),
            ("Marcus Webb", "Sounds good. Last item — the API rate limiting. We're getting hammered by a few power users.", 132, 139),
            ("Priya Nair", "We need to implement tiered rate limits. Free users at one hundred calls per minute, pro users at one thousand.", 140, 148),
            ("Sarah Chen", "Let's add that to the infrastructure sprint. I'll create the ticket after this call.", 149, 155),
            ("Marcus Webb", "Perfect. I think that covers the major items. Shall we wrap up?", 156, 161),
            ("Priya Nair", "Yes, let's summarize the action items before we close.", 162, 166),
            ("Sarah Chen", "Great session everyone. Marcus will update the roadmap doc, I'll create the rate limiting ticket and coordinate the onboarding rollout.", 167, 175),
        ],
        "action_items": [
            {"text": "Update roadmap doc with phased analytics dashboard milestones", "assignee": "Marcus Webb"},
            {"text": "Create ticket for API rate limiting implementation", "assignee": "Sarah Chen"},
            {"text": "Coordinate onboarding flow rollout with growth team by end of next week", "assignee": "Sarah Chen"},
            {"text": "Send root cause analysis for iOS session length drop", "assignee": "James (mobile team)"},
        ],
    },
    {
        "title": "Weekly Engineering Standup",
        "days_ago": 5,
        "duration": 1800,  # 30 min
        "participants": [
            {"name": "Alex Rodriguez", "email": "alex@company.com"},
            {"name": "Jordan Kim", "email": "jordan@company.com"},
            {"name": "Taylor Smith", "email": "taylor@company.com"},
        ],
        "transcript": [
            ("Alex Rodriguez", "Let's do a quick round of updates. Jordan, want to kick us off?", 0, 5),
            ("Jordan Kim", "Sure. I finished the auth refactor yesterday. All tests are passing and I submitted the PR.", 6, 13),
            ("Taylor Smith", "Nice work. I reviewed the first half, looks clean. Will finish review by end of day.", 14, 20),
            ("Alex Rodriguez", "Great. What's next for you Jordan?", 21, 25),
            ("Jordan Kim", "Moving to the notification service. I need to set up the queue infrastructure first.", 26, 32),
            ("Taylor Smith", "My update: the database migration is complete. We're fully on Postgres now, no more legacy SQLite tables.", 33, 41),
            ("Alex Rodriguez", "Excellent. Any issues during migration?", 42, 46),
            ("Taylor Smith", "One hiccup with the enum fields but I patched it. Documented in the runbook.", 47, 53),
            ("Alex Rodriguez", "My update: I've been working on the CI pipeline. Build times are down from twelve minutes to four.", 54, 61),
            ("Jordan Kim", "That's a massive improvement. What did you change?", 62, 66),
            ("Alex Rodriguez", "Switched to better caching for dependencies and parallelized the test suite.", 67, 73),
            ("Taylor Smith", "Any blockers to call out?", 74, 78),
            ("Jordan Kim", "I need credentials for the message queue service. Alex can you help with that?", 79, 85),
            ("Alex Rodriguez", "I'll get those to you after this call.", 86, 90),
            ("Taylor Smith", "I'm all good. No blockers.", 91, 94),
            ("Alex Rodriguez", "Alright, quick blocker check done. Let's talk about the sprint goal — we're targeting the beta release.", 95, 102),
            ("Jordan Kim", "Are we on track?", 103, 106),
            ("Alex Rodriguez", "Mostly. The auth piece is done thanks to Jordan. We still need the notification service and the final UI polish.", 107, 115),
            ("Taylor Smith", "UI polish is on my list for Wednesday and Thursday.", 116, 121),
            ("Jordan Kim", "I should have the notification service scaffolded by end of week.", 122, 128),
            ("Alex Rodriguez", "Good. That puts us on track for the beta freeze on Friday. Let's keep communication tight this week.", 129, 137),
            ("Taylor Smith", "Agreed. Daily async updates in Slack?", 138, 142),
            ("Alex Rodriguez", "Yes please. Alright, we're done. Have a productive day everyone.", 143, 148),
        ],
        "action_items": [
            {"text": "Complete PR review for auth refactor", "assignee": "Taylor Smith", "completed": True},
            {"text": "Scaffold notification service", "assignee": "Jordan Kim"},
            {"text": "Send message queue credentials to Jordan", "assignee": "Alex Rodriguez", "completed": True},
            {"text": "Complete UI polish", "assignee": "Taylor Smith"},
        ],
    },
    {
        "title": "Customer Feedback Review — October",
        "days_ago": 10,
        "duration": 2700,  # 45 min
        "participants": [
            {"name": "Emma Torres", "email": "emma@company.com"},
            {"name": "David Park", "email": "david@company.com"},
        ],
        "transcript": [
            ("Emma Torres", "Let's go through this month's customer feedback. We had two hundred and forty responses to the NPS survey.", 0, 7),
            ("David Park", "What was our overall score?", 8, 11),
            ("Emma Torres", "We hit sixty-two. That's up from fifty-eight last quarter, so moving in the right direction.", 12, 19),
            ("David Park", "Good trend. What are the top themes from the qualitative feedback?", 20, 25),
            ("Emma Torres", "The number one request is still better search functionality. About thirty percent of responses mentioned search.", 26, 33),
            ("David Park", "That aligns with what we're seeing in the product analytics. Search is the second most used feature but has high abandonment.", 34, 42),
            ("Emma Torres", "Exactly. Users are searching, not finding what they want, and giving up.", 43, 49),
            ("David Park", "We should probably look at the search query logs. Understanding what they're searching for would help a lot.", 50, 57),
            ("Emma Torres", "Agreed. I'll put together a request for that data from the analytics team.", 58, 63),
            ("David Park", "The second theme?", 64, 67),
            ("Emma Torres", "Export functionality. Users want to export their data to CSV and PDF. Mainly the reports section.", 68, 75),
            ("David Park", "That's been on the roadmap for a while. Do you know what's blocking it?", 76, 82),
            ("Emma Torres", "Engineering bandwidth primarily. The design work is done. It just needs to be picked up.", 83, 89),
            ("David Park", "Let me flag it to Sarah in the roadmap discussion. It seems like low-hanging fruit.", 90, 96),
            ("Emma Torres", "Good idea. Third theme is around integrations. Slack and Google Calendar are the top requested integrations.", 97, 104),
            ("David Park", "Integrations are a bigger lift. We'd need a proper integration framework first.", 105, 111),
            ("Emma Torres", "I know. But we could at least validate demand and scope it out. Even a basic Slack notification would delight users.", 112, 120),
            ("David Park", "Fair point. Let's add it to the discovery backlog rather than committing to it.", 121, 127),
            ("Emma Torres", "Agreed. What about the negative comments? Any patterns?", 128, 133),
            ("David Park", "Mostly around pricing. Some users feel the pro tier is too expensive given the current feature set.", 134, 141),
            ("Emma Torres", "That's a sensitive one. We should compile these and share with the leadership team.", 142, 148),
            ("David Park", "I'll put together a summary doc. Give me until end of week.", 149, 154),
            ("Emma Torres", "Perfect. Let's close out with next steps.", 155, 159),
            ("David Park", "I'll send the feedback summary to leadership and flag the export feature to Sarah.", 160, 166),
            ("Emma Torres", "And I'll pull the search query log analysis. We should revisit this in two weeks.", 167, 173),
        ],
        "action_items": [
            {"text": "Request search query log analysis from analytics team", "assignee": "Emma Torres"},
            {"text": "Flag export feature to Sarah for roadmap prioritization", "assignee": "David Park"},
            {"text": "Compile pricing feedback summary for leadership", "assignee": "David Park"},
            {"text": "Add Slack integration to discovery backlog", "assignee": "Emma Torres"},
        ],
    },
]


def seed_database(db: Session) -> int:
    """Seed sample meetings. Returns count of meetings created."""
    # Skip if data already exists
    from app.models import Meeting as MeetingModel
    existing = db.query(MeetingModel).count()
    if existing > 0:
        return 0

    count = 0
    now = datetime.utcnow()

    for data in SEED_MEETINGS:
        meeting_date = now - timedelta(days=data["days_ago"])

        meeting = Meeting(
            title=data["title"],
            date=meeting_date,
            duration=data["duration"],
            created_at=meeting_date,
            updated_at=meeting_date,
        )
        db.add(meeting)
        db.flush()

        # Participants
        for p in data["participants"]:
            db.add(Participant(meeting_id=meeting.id, name=p["name"], email=p.get("email")))

        # Transcript lines
        transcript_dicts = []
        for seq, (speaker, text, start, end) in enumerate(data["transcript"]):
            line = TranscriptLine(
                meeting_id=meeting.id,
                speaker=speaker,
                text=text,
                start_time=float(start),
                end_time=float(end),
                sequence=seq,
            )
            db.add(line)
            transcript_dicts.append({
                "speaker": speaker, "text": text,
                "start_time": float(start), "end_time": float(end),
                "sequence": seq,
            })

        # AI summary
        summary_data = generate_summary(transcript_dicts)
        db.add(Summary(
            meeting_id=meeting.id,
            overview=summary_data["overview"],
            key_topics=summary_data["key_topics"],
            chapters=summary_data["chapters"],
        ))

        # Action items
        for ai in data["action_items"]:
            db.add(ActionItem(
                meeting_id=meeting.id,
                text=ai["text"],
                assignee=ai.get("assignee"),
                completed=ai.get("completed", False),
            ))

        db.commit()
        count += 1

    return count
