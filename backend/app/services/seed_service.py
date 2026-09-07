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
        "is_hosted": True,
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
        "is_hosted": True,
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
        "is_hosted": False,  # shared with me
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
    {
        "title": "Design System Sync — Component Library Review",
        "is_hosted": False,  # shared with me
        "days_ago": 15,
        "duration": 2400,  # 40 min
        "participants": [
            {"name": "Lena Fischer", "email": "lena@company.com"},
            {"name": "Omar Hassan", "email": "omar@company.com"},
            {"name": "Yuki Tanaka", "email": "yuki@company.com"},
        ],
        "transcript": [
            ("Lena Fischer", "Thanks for joining everyone. Today we're reviewing the component library and deciding what to standardize before the design system v2 launch.", 0, 8),
            ("Omar Hassan", "I've prepared a list of the thirty-two components that currently have inconsistent implementations across the three product areas.", 9, 17),
            ("Yuki Tanaka", "Thirty-two is a lot. Can we prioritize the ones that appear in the critical user paths?", 18, 24),
            ("Lena Fischer", "Absolutely. The critical path components are buttons, form fields, modals, and navigation. Everything else can wait for a follow-up sprint.", 25, 34),
            ("Omar Hassan", "For buttons, we have at least four different implementations. I recommend we standardize on the token-based system from the marketing site.", 35, 43),
            ("Yuki Tanaka", "Agreed. That system already covers the primary, secondary, and destructive variants. We just need to add ghost and link button types.", 44, 52),
            ("Lena Fischer", "Good call. Omar, can you document the button spec by end of next week?", 53, 58),
            ("Omar Hassan", "Yes, I'll have the Figma component and written spec ready by Friday.", 59, 64),
            ("Yuki Tanaka", "For form fields, the main issue is inconsistent error states and placeholder styling. I have a proposal ready to share.", 65, 73),
            ("Lena Fischer", "Let's review it now. Share your screen, Yuki.", 74, 78),
            ("Yuki Tanaka", "Sure. As you can see, I've unified the border treatment and added a floating label option that the product team requested.", 79, 87),
            ("Omar Hassan", "The floating label looks great. Will it work with our existing React form library?", 88, 94),
            ("Yuki Tanaka", "I tested it — yes, it integrates cleanly with react-hook-form. No breaking changes.", 95, 101),
            ("Lena Fischer", "Excellent. Let's approve that proposal. Yuki, can you open a PR by Wednesday?", 102, 108),
            ("Yuki Tanaka", "I'll have it up by Tuesday so there's time for review.", 109, 113),
            ("Omar Hassan", "The modal component is tricky because we have both a slide-over and a centered dialog pattern. Do we keep both?", 114, 122),
            ("Lena Fischer", "Yes, keep both but standardize the close behavior and focus trap. They should be interchangeable in terms of API.", 123, 131),
            ("Omar Hassan", "Makes sense. I'll refactor both to share the same base hook.", 132, 137),
            ("Yuki Tanaka", "For navigation, the sidebar is already consistent. The only issue is the mobile breakpoint handling.", 138, 145),
            ("Lena Fischer", "Right. Let's move the breakpoint logic into a shared hook so both the sidebar and top nav use the same responsive behavior.", 146, 154),
            ("Omar Hassan", "Good plan. Should we set a target date for the full v2 launch?", 155, 161),
            ("Lena Fischer", "Six weeks from today feels achievable. That gives us three weeks for component work and three weeks for migration.", 162, 169),
            ("Yuki Tanaka", "Agreed. I'll update the project timeline doc.", 170, 174),
        ],
        "action_items": [
            {"text": "Document button spec with Figma component and written guidelines", "assignee": "Omar Hassan"},
            {"text": "Open PR for unified form field component with floating label", "assignee": "Yuki Tanaka"},
            {"text": "Refactor modal and slide-over to share base hook", "assignee": "Omar Hassan"},
            {"text": "Move sidebar/top-nav breakpoint logic into shared hook", "assignee": "Lena Fischer"},
            {"text": "Update project timeline doc for design system v2 launch", "assignee": "Yuki Tanaka"},
        ],
    },
    {
        "title": "Sprint 12 Retrospective",
        "is_hosted": True,
        "days_ago": 1,
        "duration": 2100,  # 35 min
        "participants": [
            {"name": "Rachel Green", "email": "rachel@company.com"},
            {"name": "Karan Mehta", "email": "karan@company.com"},
            {"name": "Lisa Wang", "email": "lisa@company.com"},
        ],
        "transcript": [
            ("Rachel Green", "Alright team, let's kick off our Sprint 12 retro. What went well?", 0, 5),
            ("Karan Mehta", "The deployment pipeline improvements were a huge win. Zero rollbacks this sprint.", 6, 12),
            ("Lisa Wang", "Agreed. Also, the pair programming sessions on the payment module were really productive.", 13, 19),
            ("Rachel Green", "Great points. We also shipped the notification preferences feature a day early.", 20, 26),
            ("Karan Mehta", "That's because we broke it into smaller stories. The decomposition helped a lot.", 27, 33),
            ("Lisa Wang", "Now for improvements. I think our stand-ups are running too long. We averaged eighteen minutes this sprint.", 34, 41),
            ("Rachel Green", "Valid concern. What do you suggest?", 42, 46),
            ("Lisa Wang", "Strict three-minute timebox per person. Anything longer goes to a parking lot.", 47, 53),
            ("Karan Mehta", "I support that. Also, we had too many context switches this sprint. I was pulled into three unplanned meetings.", 54, 62),
            ("Rachel Green", "Let's implement focus blocks. Tuesday and Thursday afternoons are meeting-free.", 63, 69),
            ("Lisa Wang", "Love it. One more thing — our test coverage dropped by four percent. We should enforce a coverage gate in CI.", 70, 78),
            ("Karan Mehta", "I can set that up. Minimum eighty percent before merge.", 79, 84),
            ("Rachel Green", "Perfect. Any shoutouts before we close?", 85, 89),
            ("Lisa Wang", "Shoutout to Karan for debugging the timezone issue at eleven PM on Tuesday.", 90, 95),
            ("Karan Mehta", "Thanks Lisa. Shoutout to Rachel for that excellent customer escalation handling.", 96, 101),
            ("Rachel Green", "Appreciate that. Great retro everyone. Let's carry this momentum into Sprint 13.", 102, 108),
        ],
        "action_items": [
            {"text": "Implement 3-minute timebox for daily standups", "assignee": "Rachel Green"},
            {"text": "Set up focus blocks on Tuesday and Thursday afternoons", "assignee": "Rachel Green"},
            {"text": "Add 80% test coverage gate to CI pipeline", "assignee": "Karan Mehta"},
            {"text": "Review and improve story decomposition process", "assignee": "Lisa Wang"},
        ],
    },
    {
        "title": "Sales Pipeline Review — Q4",
        "is_hosted": False,
        "days_ago": 3,
        "duration": 2700,  # 45 min
        "participants": [
            {"name": "Mike Johnson", "email": "mike@company.com"},
            {"name": "Anita Sharma", "email": "anita@company.com"},
        ],
        "transcript": [
            ("Mike Johnson", "Let's review where we stand on Q4 pipeline. Anita, can you pull up the dashboard?", 0, 6),
            ("Anita Sharma", "Sure. We're currently at two point three million in qualified pipeline against a three million target.", 7, 14),
            ("Mike Johnson", "So about seventy-seven percent. Where are the gaps?", 15, 20),
            ("Anita Sharma", "Enterprise segment is strong at ninety percent of target. The gap is in mid-market.", 21, 27),
            ("Mike Johnson", "What's driving the mid-market shortfall?", 28, 32),
            ("Anita Sharma", "Two deals slipped from Q3 into Q4 but both went cold. The contacts stopped responding.", 33, 40),
            ("Mike Johnson", "Let's try a different approach. Can we get a warm introduction through their partners?", 41, 47),
            ("Anita Sharma", "Good idea. I know someone at their consulting firm. I'll reach out today.", 48, 53),
            ("Mike Johnson", "What about the Acme Corp deal? That was our biggest opportunity.", 54, 59),
            ("Anita Sharma", "Acme is in final negotiations. Legal is reviewing the contract. Expected close by end of month.", 60, 67),
            ("Mike Johnson", "That's four hundred thousand. If that closes we're in great shape.", 68, 73),
            ("Anita Sharma", "Exactly. Plus we have three new inbound leads from the webinar last week.", 74, 80),
            ("Mike Johnson", "Quality leads?", 81, 84),
            ("Anita Sharma", "Two are enterprise, one mid-market. All requested demos. I've already scheduled two of them.", 85, 92),
            ("Mike Johnson", "Excellent work. Let's make sure we follow up within twenty-four hours on the third one.", 93, 99),
            ("Anita Sharma", "Will do. I also want to discuss the upsell opportunity with DataFlow Inc.", 100, 106),
            ("Mike Johnson", "Right, they're on the starter plan and using eighty percent of their quota. Perfect timing for an upgrade conversation.", 107, 115),
            ("Anita Sharma", "I'll prep a custom ROI deck and schedule a call with their VP of Engineering.", 116, 122),
            ("Mike Johnson", "Good plan. Let's sync again next Tuesday for an updated pipeline review.", 123, 129),
        ],
        "action_items": [
            {"text": "Reach out to consulting firm for warm intro to cold mid-market leads", "assignee": "Anita Sharma"},
            {"text": "Follow up with third webinar lead within 24 hours", "assignee": "Anita Sharma"},
            {"text": "Prep custom ROI deck for DataFlow Inc upsell", "assignee": "Anita Sharma"},
            {"text": "Schedule pipeline review follow-up for next Tuesday", "assignee": "Mike Johnson"},
        ],
    },
    {
        "title": "Infrastructure Cost Optimization Review",
        "is_hosted": True,
        "days_ago": 7,
        "duration": 3000,  # 50 min
        "participants": [
            {"name": "Chris Donovan", "email": "chris@company.com"},
            {"name": "Nadia Popov", "email": "nadia@company.com"},
            {"name": "James Liu", "email": "james@company.com"},
        ],
        "transcript": [
            ("Chris Donovan", "Today we're reviewing our cloud infrastructure costs. We went over budget by eighteen percent last month.", 0, 7),
            ("Nadia Popov", "I've done an analysis. The biggest contributor is our compute spend, specifically the staging environments.", 8, 15),
            ("James Liu", "Staging environments? How many do we have running?", 16, 20),
            ("Nadia Popov", "Twelve. But only four are being actively used. The rest are from old feature branches that were never cleaned up.", 21, 28),
            ("Chris Donovan", "That's significant waste. Let's implement auto-shutdown after forty-eight hours of inactivity.", 29, 35),
            ("James Liu", "I can write a Lambda function for that. Should be straightforward.", 36, 41),
            ("Nadia Popov", "Second issue is our database instances. We're running three read replicas but our traffic only justifies two.", 42, 49),
            ("Chris Donovan", "Can we safely remove one?", 50, 53),
            ("Nadia Popov", "Yes. The third replica was added during a traffic spike six months ago. Current load is well within capacity.", 54, 61),
            ("James Liu", "What about reserved instances? We're paying on-demand prices for workloads that run twenty-four seven.", 62, 69),
            ("Chris Donovan", "Good catch. Which instances qualify?", 70, 73),
            ("James Liu", "The API servers, the worker nodes, and the Redis cluster. Converting to reserved would save about thirty percent.", 74, 82),
            ("Nadia Popov", "That's roughly eight thousand dollars a month in savings.", 83, 88),
            ("Chris Donovan", "Let's do it. James, can you calculate the commitment needed and I'll get budget approval?", 89, 95),
            ("James Liu", "I'll have the numbers by tomorrow morning.", 96, 100),
            ("Nadia Popov", "One more thing — our S3 storage. We're not using lifecycle policies, so old logs are accumulating.", 101, 108),
            ("Chris Donovan", "Implement a ninety-day retention policy for logs and thirty days for temp files.", 109, 115),
            ("James Liu", "I'll configure that. Estimated savings of two thousand per month.", 116, 121),
            ("Nadia Popov", "Total projected monthly savings: about twelve thousand if we implement everything.", 122, 128),
            ("Chris Donovan", "That gets us back under budget with room to spare. Great work team.", 129, 134),
        ],
        "action_items": [
            {"text": "Build Lambda function for auto-shutdown of inactive staging environments", "assignee": "James Liu"},
            {"text": "Decommission third read replica after traffic validation", "assignee": "Nadia Popov"},
            {"text": "Calculate reserved instance commitment and get budget approval", "assignee": "James Liu"},
            {"text": "Configure S3 lifecycle policies for log retention", "assignee": "James Liu"},
            {"text": "Present cost optimization results to leadership", "assignee": "Chris Donovan"},
        ],
    },
    {
        "title": "New Hire Onboarding — Engineering Team",
        "is_hosted": False,
        "days_ago": 12,
        "duration": 1500,  # 25 min
        "participants": [
            {"name": "Sophie Martinez", "email": "sophie@company.com"},
            {"name": "Dev Patel", "email": "dev@company.com"},
        ],
        "transcript": [
            ("Sophie Martinez", "Welcome to the team Dev! This session will walk you through our engineering setup and processes.", 0, 6),
            ("Dev Patel", "Thanks Sophie, excited to be here. I've already set up my local environment.", 7, 12),
            ("Sophie Martinez", "Great start. Let me walk you through our Git workflow. We use trunk-based development with short-lived feature branches.", 13, 20),
            ("Dev Patel", "Sounds good. What's the typical PR review turnaround?", 21, 25),
            ("Sophie Martinez", "We aim for same-day reviews. Every PR needs at least one approval before merge.", 26, 32),
            ("Dev Patel", "And for testing? I noticed the project has both unit and integration tests.", 33, 38),
            ("Sophie Martinez", "Yes, we enforce eighty percent coverage minimum. Integration tests run in a Docker-based test environment.", 39, 46),
            ("Dev Patel", "Got it. What about the deployment process?", 47, 51),
            ("Sophie Martinez", "We deploy to staging on every merge to main. Production deployments happen twice a week, Tuesdays and Thursdays.", 52, 60),
            ("Dev Patel", "Is there a rollback procedure?", 61, 64),
            ("Sophie Martinez", "Yes, one-click rollback in our CI dashboard. We also have feature flags for gradual rollouts.", 65, 72),
            ("Dev Patel", "This is all very organized. What should I work on first?", 73, 77),
            ("Sophie Martinez", "I've tagged three starter issues in Jira. They're small, well-scoped bugs that will familiarize you with the codebase.", 78, 86),
            ("Dev Patel", "Perfect. I'll start with those today.", 87, 91),
            ("Sophie Martinez", "Your buddy for the first month is Karan. Don't hesitate to ping him with any questions.", 92, 98),
            ("Dev Patel", "Awesome. Thanks for the thorough walkthrough Sophie!", 99, 103),
        ],
        "action_items": [
            {"text": "Complete three starter issues tagged in Jira", "assignee": "Dev Patel"},
            {"text": "Schedule follow-up check-in after first week", "assignee": "Sophie Martinez"},
            {"text": "Set up access to monitoring dashboards", "assignee": "Sophie Martinez", "completed": True},
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
            is_hosted=data.get("is_hosted", True),
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
