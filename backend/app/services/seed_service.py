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
            ("Sarah Chen", "Good morning everyone, let's get started with the Q4 roadmap planning session.", 0, 8),
            ("Marcus Webb", "Thanks Sarah. I've pulled up the backlog and we have about forty feature requests to prioritize across our three core pillars.", 10, 22),
            ("Priya Nair", "Before we dive into individual tickets, should we align on the overarching themes for Q4? I was thinking we focus heavily on core performance and user retention.", 24, 40),
            ("Sarah Chen", "Agreed. Performance has been a recurring complaint in our customer advisory board feedback. Our p95 dashboard load times are still hovering above two seconds.", 42, 60),
            ("Marcus Webb", "Right. I have that marked as a P0 item. The platform engineering team estimated roughly three weeks to implement the distributed Redis caching layer.", 64, 82),
            ("Priya Nair", "If that brings p95 down below eight hundred milliseconds, it will directly address the retention drop we noticed among high-volume enterprise accounts.", 85, 102),
            ("Sarah Chen", "Speaking of drops, we also need to address the mobile experience. Our iOS session length dropped by twelve percent last month after the v3.2 release.", 105, 122),
            ("Marcus Webb", "James from the iOS team did preliminary profiling. It looks like the offline sync mechanism was causing aggressive battery drain and background crashes.", 125, 144),
            ("Priya Nair", "Let's make fixing that offline sync loop an absolute blocker before we finalize any net-new mobile roadmap items for this quarter.", 148, 166),
            ("Sarah Chen", "Completely agree. Marcus, can you ensure the mobile team allocates forty percent of their upcoming sprint capacity to stability and performance fixes?", 170, 188),
            ("Marcus Webb", "I'll sync with James and Maya this afternoon to lock that in. Moving on to new feature requests, what is our stance on the custom analytics dashboard?", 192, 210),
            ("Priya Nair", "Design completed user research last week. Users desperately want exportable widgets and automated weekly executive summaries delivered via email.", 215, 235),
            ("Sarah Chen", "Four weeks of engineering estimate feels somewhat aggressive given our current sprint velocity. Can we phase the launch across two milestones?", 240, 260),
            ("Marcus Webb", "Yes, we could ship milestone one with pre-built summary widgets in week four, and then unlock customizable Drag-and-Drop charts in milestone two by week seven.", 265, 288),
            ("Priya Nair", "That phased approach is much safer. It gives marketing something to announce early while de-risking the complex UI drag-and-drop state management.", 292, 315),
            ("Sarah Chen", "Great. Marcus, please update the roadmap document with those two distinct milestones and dependencies on the data platform team.", 320, 340),
            ("Marcus Webb", "Will do. Now let's review the onboarding flow experimentation. Priya, do we have conclusive data on the A/B test?", 345, 365),
            ("Priya Nair", "Variant B, which shortened the signup flow from six steps down to three, increased signup-to-activation conversion by eight point four percent over two weeks.", 370, 392),
            ("Sarah Chen", "Eight point four percent is a massive win. Have we observed any negative impact on downstream profile completion or meeting invites?", 398, 418),
            ("Priya Nair", "Profile completion actually stayed flat because we moved non-critical questions into a progressive disclosure tooltip after their first transcribed meeting.", 422, 445),
            ("Marcus Webb", "That's fantastic. I say we ramp Variant B to one hundred percent of production traffic and retire the legacy onboarding code.", 450, 470),
            ("Sarah Chen", "Agreed. Let's coordinate that rollout with the growth engineering pod by Thursday next week.", 475, 492),
            ("Marcus Webb", "Next agenda item: public API rate limiting. We've had three enterprise customers hitting un-throttled search endpoints simultaneously during market open hours.", 498, 520),
            ("Priya Nair", "That explains the API gateway latency spikes we saw on Tuesday morning. We need tiered token-bucket rate limits enforced at the edge gateway.", 525, 548),
            ("Sarah Chen", "Let's establish clear tiers: free tier capped at sixty requests per minute, standard tier at six hundred, and enterprise at two thousand with burst allowances.", 552, 575),
            ("Marcus Webb", "I'll file an infrastructure epic for that. We can use Redis token buckets behind Envoy. Estimated effort is five days of senior backend time.", 580, 602),
            ("Priya Nair", "Make sure the developer documentation clearly explains the HTTP 429 response headers so third-party integrations can implement exponential backoff gracefully.", 608, 630),
            ("Sarah Chen", "Good call. Now let's look at Q4 headcount and bandwidth. We have two open senior fullstack requisitions and one product designer req.", 635, 655),
            ("Marcus Webb", "Recruiting has screened twelve candidates so far. We have three onsite interviews scheduled for next Tuesday and Wednesday.", 660, 680),
            ("Priya Nair", "If we close two hires by mid-October, they will be ramped just in time to assist with the enterprise security and compliance push in November.", 685, 710),
            ("Sarah Chen", "Let's prioritize interviewer availability so we don't lose top talent to competing offers. Fast turnaround makes a noticeable impression.", 715, 735),
            ("Marcus Webb", "Understood. I will remind engineering interviewers to submit candidate scorecards within two hours of completing technical rounds.", 740, 760),
            ("Priya Nair", "What about the integrations roadmap? We've received heavy requests for Microsoft Teams and HubSpot bi-directional CRM syncing.", 765, 788),
            ("Sarah Chen", "HubSpot integration is a major sales enabler. Our AE team said five stalled deals worth roughly two hundred thousand in ARR hinged on auto-logging meeting notes to deals.", 792, 818),
            ("Marcus Webb", "We can reuse eighty percent of our Salesforce connector abstractions for HubSpot. I estimate three weeks to build an MVP connector.", 822, 845),
            ("Priya Nair", "Let's schedule HubSpot for mid-quarter and push Microsoft Teams deep integration to early Q1 to avoid spreading the integrations team too thin.", 850, 872),
            ("Sarah Chen", "That sequencing makes total sense. Protect engineering focus and deliver high-quality releases rather than half-baked connectors.", 878, 900),
            ("Marcus Webb", "I'll update our linear roadmap view accordingly so sales leadership has full visibility into connector launch dates.", 905, 925),
            ("Priya Nair", "Let's also reserve ten percent of sprint capacity for customer-reported bug fixes and minor UX polish across the meeting detail page.", 930, 952),
            ("Sarah Chen", "Always. A dedicated bug-bash week right after milestone one will keep technical debt under control.", 958, 978),
            ("Marcus Webb", "Sounds like a solid, realistic plan. Let's do a fast recap of our primary action items before we wrap up.", 985, 1005),
            ("Priya Nair", "I will update the growth metrics doc, finalize the onboarding rollout timeline, and schedule the HubSpot spec review.", 1010, 1030),
            ("Marcus Webb", "I'll document the two-phase analytics roadmap, file the Redis caching and API rate limiting epics, and coordinate mobile capacity with James.", 1035, 1060),
            ("Sarah Chen", "And I will present this Q4 roadmap to executive leadership on Monday morning. Fantastic work today everyone, thank you for your clarity and alignment.", 1065, 1090),
        ],
        "action_items": [
            {"text": "Update roadmap doc with phased analytics dashboard milestones and Redis caching dependencies", "assignee": "Marcus Webb", "completed": False},
            {"text": "File infrastructure epic for tiered API token-bucket rate limits and Envoy configuration", "assignee": "Marcus Webb", "completed": False},
            {"text": "Coordinate 100% rollout of streamlined onboarding flow Variant B with growth engineering", "assignee": "Priya Nair", "completed": False},
            {"text": "Review iOS offline sync profiling data with James and allocate 40% sprint stability capacity", "assignee": "Marcus Webb", "completed": False},
            {"text": "Draft product requirement document for HubSpot bi-directional CRM integration", "assignee": "Priya Nair", "completed": False},
            {"text": "Present synthesized Q4 roadmap deck to executive committee on Monday", "assignee": "Sarah Chen", "completed": False},
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
            ("Alex Rodriguez", "Morning team. Let's run through our weekly standup updates and verify our path toward the upcoming beta freeze.", 0, 8),
            ("Jordan Kim", "I can start. Yesterday I merged the authentication refactoring PR. We migrated our session handling to signed JWTs with rotating refresh tokens.", 12, 30),
            ("Taylor Smith", "I reviewed that PR thoroughly. All integration test suites passed cleanly across staging. The automated security scanner flagged zero vulnerabilities.", 34, 52),
            ("Alex Rodriguez", "Excellent work Jordan. Any noticeable impact on latency during token validation?", 55, 68),
            ("Jordan Kim", "Token verification latency dropped from thirty milliseconds down to under two milliseconds because we're validating HMAC signatures in-memory without hitting the database.", 72, 92),
            ("Alex Rodriguez", "That's a huge win for every authenticated request. What are you diving into today?", 95, 108),
            ("Jordan Kim", "Today I'm bootstrapping the notification event dispatcher. I'm configuring the RabbitMQ exchange and consumer groups for email and Slack webhooks.", 112, 134),
            ("Taylor Smith", "Make sure we implement idempotent consumer logic with message deduplication IDs so users never receive duplicate meeting summary notifications.", 138, 158),
            ("Jordan Kim", "Definitely. I'm storing processed message IDs in Redis with a forty-eight hour TTL.", 162, 178),
            ("Alex Rodriguez", "Great design. Taylor, what's your update on the database migration?", 182, 195),
            ("Taylor Smith", "The Postgres migration is officially one hundred percent complete. All production data has been verified against our backup snapshots with zero record loss.", 200, 222),
            ("Alex Rodriguez", "Did we encounter any edge cases during the migration cutover?", 225, 238),
            ("Taylor Smith", "We had a brief type mismatch on legacy boolean enum columns in SQLite, but the migration script sanitized those into native Postgres boolean types without downtime.", 242, 265),
            ("Jordan Kim", "I checked query performance on our analytics tables post-migration — index scans are significantly faster.", 270, 288),
            ("Taylor Smith", "Yes, the btree composite indexes on meeting ID and sequence number slashed transcript query latency by seventy percent.", 292, 312),
            ("Alex Rodriguez", "Outstanding. My update: I spent the last two days overhauling our CI/CD pipeline in GitHub Actions.", 318, 336),
            ("Jordan Kim", "How are the test run times looking now?", 340, 350),
            ("Alex Rodriguez", "Total workflow duration dropped from thirteen minutes down to three minutes and forty seconds. I configured Docker layer caching and split the test runner into four parallel shards.", 354, 380),
            ("Taylor Smith", "That will drastically boost team velocity and eliminate the staging deployment bottleneck.", 385, 402),
            ("Alex Rodriguez", "Let's address blockers. Jordan, are you blocked on cloud credentials for the message broker?", 408, 425),
            ("Jordan Kim", "I need the IAM role ARN for the AWS SQS/RabbitMQ cluster in the staging VPC.", 430, 444),
            ("Alex Rodriguez", "I will grant your staging role access right after we wrap up this call.", 448, 460),
            ("Taylor Smith", "No hard blockers for me. Today I'm tackling the remaining UI polish tickets on the meeting detail transcripts and media player.", 465, 485),
            ("Jordan Kim", "Don't forget to test the responsive layout on smaller laptop viewports around twelve hundred pixels wide.", 490, 508),
            ("Taylor Smith", "Already on it. I'm testing across thirteen-inch MacBooks and standard external displays.", 512, 528),
            ("Alex Rodriguez", "Let's review our beta release checklist. We are scheduled for code freeze on Friday afternoon at four PM.", 535, 555),
            ("Jordan Kim", "The notification service will be merged by Thursday noon, giving QA twenty-four hours of soak testing.", 560, 578),
            ("Taylor Smith", "And the UI polish tickets are scoped to take roughly a day and a half. We'll be ready well ahead of the deadline.", 582, 602),
            ("Alex Rodriguez", "Let's ensure daily asynchronous standup summaries are posted in the engineering Slack channel by ten AM.", 608, 626),
            ("Jordan Kim", "Sounds great. Thanks everyone, let's ship this beta!", 630, 642),
        ],
        "action_items": [
            {"text": "Grant Jordan IAM role ARN permissions for staging RabbitMQ broker", "assignee": "Alex Rodriguez", "completed": True},
            {"text": "Implement idempotent message deduplication for notification event consumer", "assignee": "Jordan Kim", "completed": False},
            {"text": "Complete responsive UI polish tickets on meeting detail page before Thursday", "assignee": "Taylor Smith", "completed": False},
            {"text": "Run automated load tests on Postgres composite indexes prior to Friday beta freeze", "assignee": "Alex Rodriguez", "completed": False},
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
            ("Emma Torres", "Hi David, thanks for meeting. Today we're reviewing the October Net Promoter Score results and customer feedback trends.", 0, 10),
            ("David Park", "Great. I saw we received two hundred and forty-two survey responses this cycle. What's the headline score?", 14, 28),
            ("Emma Torres", "Our blended NPS climbed to sixty-two, compared to fifty-eight last quarter. Promoters increased by four percent, mostly praising meeting transcription accuracy.", 32, 54),
            ("David Park", "Sixty-two is strong for B2B SaaS in our category. What are the key clusters emerging from the qualitative comments?", 58, 76),
            ("Emma Torres", "The most frequent request by far is enhanced search within transcriptions. Roughly thirty-one percent of respondents asked for filterable keyword search with timestamp jumping.", 80, 105),
            ("David Park", "That completely matches our Mixpanel telemetry. Over forty percent of users initiate a transcript search, but abandonment happens if the search doesn't highlight occurrences inline.", 110, 134),
            ("Emma Torres", "Exactly. Users want to see matching phrases highlighted in yellow, with forward and backward chevron buttons to cycle through matches.", 138, 160),
            ("David Park", "I will share this specific UX pattern with the frontend team. It's a high-impact quality-of-life upgrade.", 165, 182),
            ("Emma Torres", "Second major theme is export versatility. Enterprise users want to export meeting summaries into cleanly formatted PDFs, Markdown, and CSV files.", 188, 210),
            ("David Park", "Currently we only support raw text copying. A formatted PDF with company logo, speaker breakdown, and checkable action items would look extremely professional.", 215, 238),
            ("Emma Torres", "Several legal and consulting clients mentioned they need to attach meeting minutes directly into their document management systems.", 242, 264),
            ("David Park", "What did respondents say about third-party tool integrations?", 270, 282),
            ("Emma Torres", "Slack and Google Calendar integrations are top of the wishlist. Customers want automated Slack notifications in designated project channels whenever a team meeting completes.", 286, 312),
            ("David Park", "That fits perfectly into Jordan's notification dispatcher work. We can deliver a webhook payload containing meeting title, duration, and bulleted AI summary.", 316, 338),
            ("Emma Torres", "That would be huge for executive adoption. Often managers don't have time to open the full app; a Slack snippet is all they need.", 342, 362),
            ("David Park", "Did we receive any constructive criticism regarding pricing or tier limits?", 368, 382),
            ("Emma Torres", "Yes, there is some friction around the free tier limitation of three transcribed meetings. Early-stage startups feel the jump to twenty dollars per user is steep.", 386, 410),
            ("David Park", "We could consider proposing a 'Starter' plan at ten dollars per user with twenty meetings per month, bridging the gap between free and pro.", 415, 436),
            ("Emma Torres", "I love that idea. It would convert freemium signups who otherwise churn out after exhausting their three free meeting tokens.", 440, 460),
            ("David Park", "I'll compile a financial sensitivity model showing projected conversion lift from introducing an entry-level tier.", 465, 484),
            ("Emma Torres", "Let's summarize our immediate deliverables from this feedback cycle.", 490, 502),
            ("David Park", "I'll write the product brief for inline transcript search Chevrons and model the Starter pricing tier.", 506, 524),
            ("Emma Torres", "And I will prepare the customer feedback summary deck for executive leadership and draft the Slack notification spec.", 528, 550),
        ],
        "action_items": [
            {"text": "Draft product brief for inline transcript keyword search with match navigation chevrons", "assignee": "David Park", "completed": False},
            {"text": "Compile financial modeling on proposed $10 Starter tier conversion lift", "assignee": "David Park", "completed": False},
            {"text": "Prepare executive summary presentation of October NPS and customer feedback", "assignee": "Emma Torres", "completed": False},
            {"text": "Define Slack channel notification webhook payload format for meeting summaries", "assignee": "Emma Torres", "completed": False},
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
            ("Lena Fischer", "Welcome everyone to our bi-weekly design system sync. Today's main focus is auditing our UI component library ahead of the v2 design system rollout.", 0, 12),
            ("Omar Hassan", "Thanks Lena. Over the past sprint, I audited our production frontend codebase and cataloged thirty-two component instances that have fragmented styling.", 16, 36),
            ("Yuki Tanaka", "Thirty-two is quite significant. What are the primary culprits?", 40, 50),
            ("Omar Hassan", "Buttons and form inputs account for more than half. We have four slightly different implementations of primary action buttons with inconsistent padding and border radii.", 54, 75),
            ("Lena Fischer", "Let's standardize on a strict token-based system. Our brand primary button should consistently use the six-c-four-seven-f-f violet, eight-pixel border radius, and fourteen-pixel medium typography.", 80, 105),
            ("Yuki Tanaka", "I've drafted the Tailwind utility mapping. We can define our button variants as primary, secondary, ghost, destructive, and outline using CSS variables.", 110, 130),
            ("Omar Hassan", "That makes them theme-aware. In dark mode, the secondary button automatically picks up the elevated background rather than hardcoded grays.", 135, 155),
            ("Lena Fischer", "Exactly. Next component: modal dialogs and slide-over drawers. Currently the ESC key behavior is inconsistent across pages.", 160, 180),
            ("Yuki Tanaka", "Yes, some modals trap focus properly while others allow tabbing into background DOM elements. I created a reusable useDialogFocus custom React hook to enforce accessibility.", 185, 210),
            ("Omar Hassan", "Does the hook handle backdrop scroll lock as well?", 215, 225),
            ("Yuki Tanaka", "Yes, it adds overflow-hidden to document body upon mount and restores previous overflow upon unmount.", 230, 248),
            ("Lena Fischer", "That's standard practice. Let's make sure that hook is mandatory for all modals, confirm dialogs, and slide-over panels.", 252, 270),
            ("Omar Hassan", "What about form inputs and text areas? How are we handling error states and validation tooltips?", 275, 292),
            ("Yuki Tanaka", "I've styled a unified FormField component that supports label, helper text, optional badge, and red-tinted error state with an alert icon.", 296, 320),
            ("Lena Fischer", "Let's ensure the input focus ring uses our brand purple with forty percent opacity and a smooth two-pixel transition.", 325, 345),
            ("Omar Hassan", "I will update the Figma component library to match Yuki's React props one-to-one so designers and engineers use identical naming.", 350, 372),
            ("Yuki Tanaka", "What is our migration strategy for deprecating old one-off components in the codebase?", 378, 395),
            ("Lena Fischer", "We will do an incremental rollout: first migrate core navigation and modals in Sprint 14, then form controls and tables in Sprint 15.", 400, 422),
            ("Omar Hassan", "I'll create a checklist doc tracking component migration progress across every page route.", 428, 445),
            ("Lena Fischer", "Great plan team. Let's wrap up and push these improvements to the main component registry.", 450, 468),
        ],
        "action_items": [
            {"text": "Publish updated Figma UI kit with unified button and input token variants", "assignee": "Omar Hassan", "completed": False},
            {"text": "Open PR for reusable useDialogFocus hook with backdrop scroll lock", "assignee": "Yuki Tanaka", "completed": False},
            {"text": "Refactor meeting detail modals to use standard FormField and Dialog components", "assignee": "Yuki Tanaka", "completed": False},
            {"text": "Create component migration tracking board for Sprints 14 and 15", "assignee": "Omar Hassan", "completed": False},
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
            ("Rachel Green", "Welcome team to our Sprint 12 retro. As always, we will celebrate our wins, examine what slowed us down, and agree on concrete action items.", 0, 14),
            ("Karan Mehta", "On the wins side: the zero-downtime deployment pipeline overhaul paid immediate dividends. We deployed eight times this sprint with zero rollbacks.", 18, 40),
            ("Lisa Wang", "Pair programming on the meeting search indexer was also super effective. We squashed three tricky race condition bugs in a single afternoon.", 45, 68),
            ("Rachel Green", "The team also completed eighteen out of twenty planned story points, which is our highest predictability ratio this quarter.", 72, 92),
            ("Karan Mehta", "Now for what didn't go as well: standups are consistently creeping past fifteen minutes and turning into architectural debates.", 98, 118),
            ("Lisa Wang", "Agreed. When someone encounters an algorithmic blocker, we end up discussing it with the whole team instead of taking it offline.", 122, 142),
            ("Rachel Green", "Let's implement a strict three-minute timebox per person. Any discussion requiring more than two minutes goes onto the parking lot board.", 148, 170),
            ("Karan Mehta", "I also felt significant context switching fatigue on Wednesday. I was interrupted by four ad-hoc Slack calls while writing the audio transcription worker.", 175, 200),
            ("Lisa Wang", "I felt that too. Can we establish company-wide focus blocks on Tuesday and Thursday afternoons?", 205, 222),
            ("Rachel Green", "Yes! 'No-Meeting Focus Blocks' from one PM to five PM on Tuesdays and Thursdays. Slack notifications set to 'Do Not Disturb'.", 228, 250),
            ("Karan Mehta", "That will make a huge difference for deep work and complex debugging sessions.", 255, 270),
            ("Lisa Wang", "One more quality point: our test coverage dropped slightly from eighty-two percent to seventy-nine percent on the new action items routes.", 275, 298),
            ("Rachel Green", "Let's configure a strict GitHub Actions coverage check that blocks PR merges if overall coverage dips below eighty percent.", 302, 324),
            ("Karan Mehta", "I'll configure pytest-cov and coverage thresholds in our CI workflow tonight.", 328, 342),
            ("Lisa Wang", "Shoutout to Karan for helping debug the WebRTC audio packet loss issue late Tuesday evening!", 348, 365),
            ("Rachel Green", "And shoutout to Lisa for writing crystal-clear documentation for the new API endpoints. Let's make Sprint 13 our best one yet.", 370, 390),
        ],
        "action_items": [
            {"text": "Enforce 3-minute timebox rule for daily standups with parking lot board", "assignee": "Rachel Green", "completed": False},
            {"text": "Schedule recurring No-Meeting Focus Blocks on team calendars for Tuesdays and Thursdays", "assignee": "Rachel Green", "completed": False},
            {"text": "Add 80% minimum test coverage gate in GitHub Actions CI pipeline", "assignee": "Karan Mehta", "completed": False},
            {"text": "Add unit tests for action items endpoints to restore coverage above 82%", "assignee": "Lisa Wang", "completed": False},
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
            ("Mike Johnson", "Good afternoon Anita. Let's do a deep dive into our Q4 enterprise pipeline and review where we need executive sponsorship to accelerate deals.", 0, 14),
            ("Anita Sharma", "Thanks Mike. Right now our qualified Q4 pipeline sits at two point three million dollars against our team quota of three million.", 18, 38),
            ("Mike Johnson", "So we are pacing at approximately seventy-seven percent. Where are the primary opportunities to bridge that seven hundred thousand dollar delta?", 42, 64),
            ("Anita Sharma", "The enterprise tier is performing very well at ninety percent of target. The shortfall is primarily in our mid-market velocity.", 68, 88),
            ("Mike Johnson", "Why did those mid-market deals stall towards the end of September?", 92, 105),
            ("Anita Sharma", "Two key prospects had leadership turnover in their operations department. Their new directors want a proof-of-concept trial before signing annual contracts.", 110, 134),
            ("Mike Johnson", "Can we offer a fourteen-day expedited pilot with dedicated onboarding support?", 140, 154),
            ("Anita Sharma", "Yes, if we guarantee fifty free meeting transcriptions and hands-on CRM sync setup, they agreed to fast-track security reviews.", 160, 182),
            ("Mike Johnson", "Let's approve that incentive. What is the latest status on the Acme Corporation enterprise contract?", 188, 205),
            ("Anita Sharma", "Acme is our largest deal of the quarter at four hundred and twenty thousand in ARR. Their legal counsel finished redlining our master services agreement yesterday.", 210, 235),
            ("Mike Johnson", "Were there any contentious indemnity or data privacy clauses?", 240, 252),
            ("Anita Sharma", "They required standard SOC 2 Type II compliance verification and zero-data-retention guarantees for audio buffers, which our platform fully satisfies.", 258, 282),
            ("Mike Johnson", "Fantastic. If Acme signs by October thirty-first, that single contract moves us from seventy-seven percent to over ninety percent of our quarterly target.", 288, 312),
            ("Anita Sharma", "We also received thirty-eight inbound enterprise demo requests from our recent AI productivity webinar.", 318, 335),
            ("Mike Johnson", "What is the qualification rate on those webinar leads?", 340, 350),
            ("Anita Sharma", "Twelve have already been qualified as SQLs with team sizes exceeding two hundred employees. I've scheduled product demos for seven of them this week.", 355, 378),
            ("Mike Johnson", "Let's make sure our sales development reps follow up with the remaining leads within twenty-four hours to maintain momentum.", 384, 404),
            ("Anita Sharma", "I also want to highlight an expansion opportunity with DataFlow Inc. They started with twenty seats and are now asking to expand to three hundred seats.", 410, 432),
            ("Mike Johnson", "A fifteen-x expansion is huge. Let's schedule an executive briefing with their VP of Technology next Tuesday.", 438, 455),
            ("Anita Sharma", "I will prepare a tailored proposal with enterprise volume tiering and priority customer support.", 460, 478),
            ("Mike Johnson", "Terrific work Anita. Let's keep executing with precision and close out this quarter strong.", 484, 500),
        ],
        "action_items": [
            {"text": "Execute 14-day expedited proof-of-concept pilot agreements for stalled mid-market accounts", "assignee": "Anita Sharma", "completed": False},
            {"text": "Facilitate final signature on Acme Corp $420k ARR enterprise agreement with legal", "assignee": "Mike Johnson", "completed": False},
            {"text": "Complete qualification calls for remaining 26 inbound webinar enterprise leads", "assignee": "Anita Sharma", "completed": False},
            {"text": "Prepare 300-seat expansion proposal and executive presentation for DataFlow Inc", "assignee": "Anita Sharma", "completed": False},
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
            ("Chris Donovan", "Welcome team. Today we are conducting a systematic audit of our cloud infrastructure expenses. Our AWS invoice exceeded monthly budget projections by eighteen percent.", 0, 16),
            ("Nadia Popov", "I performed a granular cost-allocation tag analysis across our compute, storage, and networking dimensions. Compute represents sixty-two percent of our total monthly spend.", 22, 45),
            ("James Liu", "What is driving the compute growth? Is it customer transcription volume or internal developer environments?", 50, 70),
            ("Nadia Popov", "Primarily developer preview environments. We currently have fourteen staging clusters running round-the-clock, even though developer activity is near-zero on weekends and nights.", 75, 100),
            ("Chris Donovan", "That is textbook infrastructure waste. We should implement an automated lifecycle policy that scales preview environments to zero after six PM and on weekends.", 105, 130),
            ("James Liu", "I can implement an event-driven AWS Lambda function triggered by EventBridge cron rules that shuts down non-production EKS node groups at seven PM.", 135, 160),
            ("Nadia Popov", "That single change will shave roughly four thousand two hundred dollars off our monthly compute bill.", 165, 182),
            ("Chris Donovan", "What about our database tier? Are we over-provisioned on RDS PostgreSQL?", 188, 202),
            ("James Liu", "We currently operate three multi-AZ read replicas in US-East. However, our average CPU utilization across all three replicas rarely exceeds eighteen percent.", 208, 232),
            ("Nadia Popov", "We provisioned the third replica six months ago anticipating a surge in reporting queries that has since been shifted to Snowflake.", 238, 258),
            ("Chris Donovan", "Can we safely decommission the third replica without impacting p99 read query latency?", 264, 278),
            ("James Liu", "Yes. I ran simulated peak-traffic benchmark tests yesterday with only two replicas, and p99 read latency remained comfortably under twelve milliseconds.", 284, 308),
            ("Nadia Popov", "Decommissioning that instance saves another two thousand eight hundred dollars each month.", 314, 330),
            ("Chris Donovan", "Let's review our compute pricing model. Are we still paying on-demand rates for our core microservices?", 336, 352),
            ("James Liu", "Currently sixty percent of our Kubernetes worker nodes are running on on-demand EC2 instances. We have zero active three-year Savings Plans.", 358, 382),
            ("Nadia Popov", "If we commit to a three-year Compute Savings Plan for our baseline steady-state capacity, AWS offers a forty-four percent discount.", 388, 410),
            ("Chris Donovan", "Since our core architecture is settled and our ARR is scaling steadily, a Savings Plan commitment is low-risk and high-yield.", 415, 435),
            ("James Liu", "I'll model the optimal commitment level to maximize savings without over-committing against future architectural shifts.", 440, 460),
            ("Nadia Popov", "One final item: S3 storage buckets. We have nineteen terabytes of uncompressed audio logs older than one hundred and eighty days in standard S3.", 466, 490),
            ("Chris Donovan", "Let's configure an S3 Lifecycle rule to transition raw audio files to S3 Glacier Instant Retrieval after thirty days, and Glacier Deep Archive after ninety days.", 495, 520),
            ("James Liu", "Storage costs for those archives will plummet by over eighty percent. That represents an additional one thousand five hundred per month in savings.", 526, 548),
            ("Nadia Popov", "Summing all initiatives: preview environment shutdown, replica rightsizing, Savings Plans, and S3 lifecycle rules, we will save roughly eleven thousand five hundred monthly.", 554, 582),
            ("Chris Donovan", "That returns our cloud margin to healthy SaaS benchmark levels. Excellent analysis and execution plan team.", 588, 608),
        ],
        "action_items": [
            {"text": "Deploy EventBridge Lambda automation to shut down non-production EKS preview clusters off-hours", "assignee": "James Liu", "completed": False},
            {"text": "Decommission redundant third RDS PostgreSQL read replica following maintenance window", "assignee": "James Liu", "completed": False},
            {"text": "Finalize AWS Compute Savings Plan baseline commitment model for finance approval", "assignee": "Nadia Popov", "completed": False},
            {"text": "Configure S3 Lifecycle transitions to Glacier Instant Retrieval for audio recordings over 30 days", "assignee": "Nadia Popov", "completed": False},
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
            ("Sophie Martinez", "Welcome to the Fireflies engineering team Dev! We're thrilled to have you join as a fullstack engineer.", 0, 10),
            ("Dev Patel", "Thanks so much Sophie, I'm really excited to be here and contribute to the platform.", 14, 25),
            ("Sophie Martinez", "Today's goal is to ensure your local developer environment is completely bootstrapped and walk through our development lifecycle.", 30, 48),
            ("Dev Patel", "I followed the onboarding README this morning: Docker containers are running, local PostgreSQL is seeded, and Next.js Turbopack compiled successfully.", 52, 75),
            ("Sophie Martinez", "That is fantastic. Let's cover our Git branch and pull request conventions. We adhere strictly to trunk-based development.", 80, 100),
            ("Dev Patel", "So short-lived feature branches cut from master, merged frequently through pull requests?", 105, 118),
            ("Sophie Martinez", "Exactly. Branches should ideally live no longer than two days. Keep pull requests under four hundred lines of diff whenever possible.", 122, 142),
            ("Dev Patel", "What does the code review SLA look like across the engineering team?", 148, 160),
            ("Sophie Martinez", "We commit to reviewing peer PRs within four working hours. Every pull request requires at least one approving review and clean CI checks to merge.", 165, 188),
            ("Dev Patel", "And for automated testing: unit tests with pytest on the backend and Jest/React Testing Library on the frontend?", 194, 214),
            ("Sophie Martinez", "Yes, alongside Playwright end-to-end smoke tests that run against our ephemeral preview deployments.", 220, 238),
            ("Dev Patel", "What is the deployment procedure once a PR is merged into master?", 244, 256),
            ("Sophie Martinez", "Merging to master triggers an automatic zero-downtime deployment to our staging environment. Production releases are deployed every Tuesday and Thursday.", 262, 285),
            ("Dev Patel", "Are feature rollouts protected by feature flags?", 290, 300),
            ("Sophie Martinez", "Yes, we use LaunchDarkly for percentage-based rollouts and canary releases. You can toggle features for internal dogfooding before customer exposure.", 305, 328),
            ("Dev Patel", "That gives a lot of confidence when shipping user-facing enhancements.", 334, 348),
            ("Sophie Martinez", "I've assigned three 'Good First Issues' to you in Jira: one fixing an edge case in transcript search highlighting, and two minor UI polish tickets.", 354, 376),
            ("Dev Patel", "Those sound like great starter tasks to get familiar with the codebase architecture. Who is my primary onboarding mentor?", 382, 400),
            ("Sophie Martinez", "Karan Mehta will be your designated mentor for your first six weeks. You have a recurring thirty-minute daily coffee chat on your calendar.", 405, 428),
            ("Dev Patel", "Awesome. Thank you Sophie for the welcoming and structured onboarding walkthrough!", 434, 450),
        ],
        "action_items": [
            {"text": "Complete initial local environment validation and commit smoke-test PR", "assignee": "Dev Patel", "completed": True},
            {"text": "Review and pick up first good-first-issue Jira ticket for transcript highlight fix", "assignee": "Dev Patel", "completed": False},
            {"text": "Attend daily mentor sync with Karan Mehta to review architecture questions", "assignee": "Dev Patel", "completed": False},
            {"text": "Grant Dev Patel access to LaunchDarkly feature flag staging dashboard and Datadog APM", "assignee": "Sophie Martinez", "completed": True},
        ],
    },
    {
        "title": "AI Voice Agent Architecture & Latency Optimization",
        "is_hosted": True,
        "days_ago": 1,
        "duration": 2400,  # 40 min
        "participants": [
            {"name": "Satvik", "email": "satvik@fireflies.ai"},
            {"name": "Elena Rostova", "email": "elena@company.com"},
            {"name": "Marcus Vance", "email": "marcus.vance@company.com"},
        ],
        "transcript": [
            ("Satvik", "Thanks for joining team. Today we are addressing our top technical priority: conversational latency for our realtime AI Voice Agent.", 0, 12),
            ("Elena Rostova", "Right now, our end-to-end voice loop latency is approximately twelve hundred to fourteen hundred milliseconds. For natural conversation, users perceive delay if response time exceeds five hundred milliseconds.", 16, 42),
            ("Marcus Vance", "Let's dissect the latency waterfall: audio capture and chunking takes eighty milliseconds, speech-to-text takes four hundred milliseconds, LLM time-to-first-token takes five hundred milliseconds, and text-to-speech audio streaming takes another three hundred milliseconds.", 48, 80),
            ("Satvik", "Where can we extract the biggest latency reductions without compromising conversational intelligence?", 85, 102),
            ("Elena Rostova", "Speech-to-text is our easiest immediate win. Moving from batch Whisper inference to Deepgram Nova-2 streaming WebSockets reduces transcription latency from four hundred milliseconds down to one hundred and twenty milliseconds.", 108, 138),
            ("Marcus Vance", "I benchmarked Nova-2 on noisy background audio yesterday. Word error rate is under four percent, which is comparable to Whisper Large-v3 but with one-third the latency.", 144, 172),
            ("Satvik", "That is an immediate three-hundred-millisecond savings. What about the LLM time-to-first-token?", 178, 195),
            ("Elena Rostova", "We can implement speculative execution. As soon as the user pauses for more than one hundred and fifty milliseconds, we begin streaming a speculative prompt to Gemini Flash.", 200, 226),
            ("Marcus Vance", "If the user continues speaking, we simply cancel the speculative stream. But in seventy percent of conversational pauses, the user has completed their thought, effectively dropping perceived LLM latency to near-zero.", 232, 260),
            ("Satvik", "What protocol are we using for audio playback transport back to the client browser?", 265, 280),
            ("Marcus Vance", "Currently we are streaming MP3 chunks over WebSockets. If we transition to WebRTC with the Opus codec, we eliminate TCP packet re-transmission delays and achieve true realtime sub-fifty-millisecond delivery.", 286, 315),
            ("Elena Rostova", "For voice synthesis, Cartesia's Sonic model generates audio with sixty-millisecond first-byte latency, which is significantly faster than ElevenLabs Turbo v2.", 322, 348),
            ("Satvik", "Let's tally the new pipeline: Deepgram streaming at one hundred and twenty, Gemini Flash speculative at one hundred and eighty, Cartesia TTS at sixty, and WebRTC transport at forty. That brings total loop latency to four hundred milliseconds!", 355, 388),
            ("Marcus Vance", "That will make the voice agent feel truly instantaneous, like talking to an attentive human on a phone call.", 394, 412),
            ("Elena Rostova", "I will prepare an end-to-end prototype using this architecture in our staging sandbox by Thursday afternoon.", 418, 436),
            ("Satvik", "Let's conduct an internal dogfooding test on Friday morning with the entire product team.", 442, 458),
            ("Marcus Vance", "I'll configure WebRTC TURN servers across US-East and Western Europe to minimize edge round-trip times.", 464, 485),
            ("Satvik", "Fantastic collaboration everyone. This latency breakthrough will define our Voice Agents product tier.", 490, 510),
        ],
        "action_items": [
            {"text": "Integrate Deepgram Nova-2 streaming WebSocket transcription into voice agent worker", "assignee": "Elena Rostova", "completed": False},
            {"text": "Implement speculative sentence completion logic with interruptible LLM streams", "assignee": "Elena Rostova", "completed": False},
            {"text": "Deploy WebRTC audio transport pipeline with Opus codec and regional TURN servers", "assignee": "Marcus Vance", "completed": False},
            {"text": "Schedule company-wide dogfooding session for sub-400ms voice agent prototype on Friday", "assignee": "Satvik", "completed": False},
        ],
    },
    {
        "title": "Series B Growth Metrics & Board Presentation",
        "is_hosted": False,
        "days_ago": 4,
        "duration": 2700,  # 45 min
        "participants": [
            {"name": "Sarah Chen", "email": "sarah@company.com"},
            {"name": "Vikram Joshi", "email": "vikram@company.com"},
            {"name": "Claire Beaumont", "email": "claire@sequoia.com"},
        ],
        "transcript": [
            ("Sarah Chen", "Good morning Claire, Vikram. Today we are previewing our Series B narrative and reviewing our Q3 financial scorecard ahead of the formal board meeting.", 0, 15),
            ("Claire Beaumont", "Thanks Sarah. Investors are primarily looking for durable unit economics, expansion velocity, and proof of AI product stickiness. How did we close Q3?", 20, 44),
            ("Vikram Joshi", "We closed Q3 at four point six million in Annual Recurring Revenue, up one hundred and forty-five percent year-over-year.", 48, 68),
            ("Claire Beaumont", "One hundred and forty-five percent growth at your scale is top-decile for AI productivity platforms. What is our Net Revenue Retention?", 74, 98),
            ("Vikram Joshi", "Our NRR across all tiers reached one hundred and thirty-four percent. Enterprise cohorts specifically expanded at one hundred and forty-eight percent.", 104, 128),
            ("Sarah Chen", "The primary expansion driver is organizational adoption: a team starts with three seats for their product managers, and within ninety days expands to engineering, sales, and executive leadership.", 134, 162),
            ("Claire Beaumont", "What does our Gross Margin look like considering the compute costs associated with audio transcription and LLM inference?", 168, 190),
            ("Vikram Joshi", "Gross margin expanded from sixty-eight percent in Q1 to seventy-six percent in Q3. The optimization team's work on model rightsizing and caching reduced our per-meeting inference cost by forty-two percent.", 196, 226),
            ("Sarah Chen", "We've proven that AI features can deliver healthy SaaS unit economics at scale.", 232, 248),
            ("Claire Beaumont", "What about Customer Acquisition Cost payback period?", 254, 268),
            ("Vikram Joshi", "Our blended CAC payback dropped from fourteen months down to eight point two months, propelled by organic product-led word-of-mouth and viral meeting invites.", 274, 300),
            ("Sarah Chen", "When an external client receives a Fireflies meeting summary with automated action items, four percent of those external participants sign up for a free trial.", 306, 332),
            ("Claire Beaumont", "That is an extraordinarily efficient viral product loop. What are our capital requirements and runway projections?", 338, 358),
            ("Vikram Joshi", "We have twenty-two months of runway remaining with a burn multiple of zero point eight five. We are raising thirty million dollars for our Series B to scale enterprise go-to-market and internationalize into EMEA.", 364, 395),
            ("Claire Beaumont", "The growth trajectory, NRR, and capital efficiency make this a compelling Series B narrative. I am confident our partnership syndicate will support this round strongly.", 402, 428),
            ("Sarah Chen", "Thank you Claire. Vikram and I will finalize the investor pitch deck and audit schedules by Monday.", 434, 452),
        ],
        "action_items": [
            {"text": "Finalize Series B 25-slide investor presentation deck with audited Q3 cohort charts", "assignee": "Vikram Joshi", "completed": False},
            {"text": "Package viral loop telemetry and NRR expansion metrics into investor appendix", "assignee": "Vikram Joshi", "completed": False},
            {"text": "Coordinate introductory partner calls with top-tier lead venture funds for next week", "assignee": "Claire Beaumont", "completed": False},
            {"text": "Review international localization roadmap for UK, EU, and APAC enterprise clients", "assignee": "Sarah Chen", "completed": False},
        ],
    },
    {
        "title": "Enterprise Security, SOC 2 Type II & PII Redaction Audit",
        "is_hosted": True,
        "days_ago": 6,
        "duration": 1800,  # 30 min
        "participants": [
            {"name": "Maya Lin", "email": "maya.lin@fireflies.ai"},
            {"name": "Robert Hall", "email": "robert.hall@schellman.com"},
            {"name": "Alex Rodriguez", "email": "alex@company.com"},
        ],
        "transcript": [
            ("Maya Lin", "Good morning Robert, Alex. Today we are conducting our final review of the SOC 2 Type II audit report with Schellman Compliance.", 0, 12),
            ("Robert Hall", "Thanks Maya. We've completed our twelve-month observation period testing controls across Security, Availability, and Confidentiality trust principles.", 16, 38),
            ("Alex Rodriguez", "What is the preliminary finding across our engineering infrastructure and deployment pipelines?", 42, 58),
            ("Robert Hall", "I am pleased to report zero exceptions identified across all fifty-four evaluated control points. Your change management, automated PR approvals, and CI/CD audit trails were exemplary.", 64, 92),
            ("Maya Lin", "That is a tremendous milestone for our enterprise credibility. Did you examine our automated PII redaction pipeline for transcript text?", 98, 120),
            ("Robert Hall", "Yes, we conducted rigorous sampling tests. Credit card numbers, Social Security numbers, telephone numbers, and email addresses are accurately tokenized and masked prior to persistent database storage.", 126, 155),
            ("Alex Rodriguez", "All raw audio streams are encrypted in transit using TLS 1.3, and database volumes are encrypted at rest using AES-256 with AWS Key Management Service customer-managed keys.", 160, 188),
            ("Robert Hall", "How frequently are KMS encryption keys rotated?", 194, 205),
            ("Alex Rodriguez", "Automated annual key rotation is enabled via AWS KMS policy, with quarterly manual audit validation.", 210, 225),
            ("Maya Lin", "We also verified our Okta SAML 2.0 and SCIM user provisioning pipelines. When an employee is de-provisioned in their identity provider, their Fireflies session is terminated within sixty seconds.", 230, 258),
            ("Robert Hall", "That satisfies Section 4.2 of the Trust Services Criteria regarding prompt access revocation.", 264, 280),
            ("Alex Rodriguez", "What about our third-party annual penetration test results?", 285, 296),
            ("Maya Lin", "Cobalt completed our gray-box penetration test last month. Zero high or critical vulnerabilities were found, and all three low-severity informational items were remediated within five days.", 302, 330),
            ("Robert Hall", "We have verified the remediation documentation. Schellman will issue the official unqualified SOC 2 Type II attestation report by this Friday.", 336, 360),
            ("Maya Lin", "This will unblock six Fortune 500 security reviews currently in progress. Huge thanks to Alex and Robert for the thorough collaboration!", 366, 388),
        ],
        "action_items": [
            {"text": "Publish official Schellman SOC 2 Type II attestation report to customer trust center portal", "assignee": "Maya Lin", "completed": False},
            {"text": "Send verified compliance report packet to pending Fortune 500 security review leads", "assignee": "Maya Lin", "completed": False},
            {"text": "Schedule recurring quarterly KMS key rotation audit and access review meeting", "assignee": "Alex Rodriguez", "completed": False},
            {"text": "Archive Cobalt annual penetration test remediation sign-off in compliance repository", "assignee": "Alex Rodriguez", "completed": True},
        ],
    },
]


def distribute_transcript_timeline(transcript: list, meeting_duration: int) -> list:
    """
    Distributes transcript turns across the entire meeting duration so playback,
    seeking, and chapter markers work smoothly across the full audio timeline.
    """
    if not transcript:
        return []
    
    turn_durations = []
    for speaker, text, _, _ in transcript:
        word_count = len(text.split())
        dur = max(4.0, min(word_count / 2.3, 50.0))
        turn_durations.append(dur)
    
    total_speech = sum(turn_durations)
    total_pause_budget = max(0.0, float(meeting_duration) - 20.0 - total_speech)
    pause_per_gap = total_pause_budget / max(1, len(transcript) - 1) if len(transcript) > 1 else 1.0
    
    distributed = []
    current_time = 0.0
    for i, (speaker, text, _, _) in enumerate(transcript):
        start = round(current_time, 1)
        end = round(start + turn_durations[i], 1)
        distributed.append((speaker, text, start, end))
        current_time = end + pause_per_gap
        
    return distributed


def seed_database(db: Session, force: bool = False) -> int:
    """Seed sample meetings. Returns count of meetings created."""
    from app.models import Meeting as MeetingModel
    
    existing = db.query(MeetingModel).count()
    if existing > 0 and not force:
        return 0

    if force:
        # Cascade delete existing data
        from app.models import ActionItem, Summary, TranscriptLine, Participant
        db.query(ActionItem).delete()
        db.query(Summary).delete()
        db.query(TranscriptLine).delete()
        db.query(Participant).delete()
        db.query(MeetingModel).delete()
        db.commit()

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

        # Transcript lines distributed across full meeting duration
        full_transcript = distribute_transcript_timeline(data["transcript"], data["duration"])
        transcript_dicts = []
        for seq, (speaker, text, start, end) in enumerate(full_transcript):
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
                "speaker": speaker,
                "text": text,
                "start_time": float(start),
                "end_time": float(end),
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
