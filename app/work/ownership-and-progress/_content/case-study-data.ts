// Excerpts from the working documents (spreadsheets and FigJam boards) behind this case study.
// Text is taken from the originals, lightly trimmed. Protected content: import only from server components.

export const PRINCIPLES: { n: number; title: string; gloss: string }[] = [
  { n: 1, title: "Always know whose turn it is", gloss: "Every state has one owner: Client, Ownpath, Approver or None." },
  { n: 2, title: "Show the creative, never the machinery", gloss: "Clients never see designer chat, unpicked options or internal versions." },
  { n: 3, title: "Status, not process", gloss: "Say where the request stands, not the steps behind it." },
  { n: 4, title: "A status is never a dead end", gloss: "Every status says what happens next, or what to do." },
  { n: 5, title: "Warn, don’t wall", gloss: "A thin brief can still be submitted. Gaps are flagged, not blocking." },
  { n: 6, title: "Easy and quick over feature-rich", gloss: "Intake asks one question at a time and lets you skip." },
  { n: 7, title: "Feedback lands visibly", gloss: "A comment is not feedback until it is submitted, and submitting shows what was handed over." },
  { n: 8, title: "Deliberate on the irreversible, quick on the routine", gloss: "Sending for review and approving are explicit. Routine edits are not." },
];

export const ACTORS = [
  {
    name: "Client",
    who: "A marketer at the brand",
    does: "Files the brief, answers clarification, reviews the work and submits feedback. Reviewers can comment. One designated approver makes the final call.",
    turn: "Draft · Needs input · Delivered",
    sees: "The board, the locked brief, and only the version sent for review.",
    never: "Designer chat, unpicked options, internal versions.",
  },
  {
    name: "Designer",
    who: "An Ownpath designer, assigned to one brief",
    does: "Picks up the brief, chooses template or AI generation, iterates, raises clarification and sends one version for review.",
    turn: "Assigned · In production · Feedback sent · Preparing formats",
    sees: "The locked brief, the canvas and every version they made.",
    never: "Edits the locked brief. Gets told when feedback lands, not when the client opens the review.",
  },
  {
    name: "Ops",
    who: "Ownpath superadmin",
    does: "Assigns and reassigns designers (no self-assign, one designer per brief), watches the queue, and fixes ownership or access failures.",
    turn: "Submitted, until a designer is assigned",
    sees: "The Ownpath queue, Production, and Usage & spend. Designers do not get the last two.",
    never: "Shows queue or cost controls to designers or clients.",
  },
  {
    name: "PM agent",
    who: "An agent, always labelled as one",
    does: "Checks briefs for gaps, batches clarification questions, triages feedback and compiles one revision specification for the client to confirm.",
    turn: "Never holds it. It ends every step by naming exactly one owner.",
    sees: "The brief, attachments, earlier threads and the exact version under review.",
    never: "Judges quality, rules on brand, blocks the workflow, or poses as staff.",
  },
] as const;

export const LIFECYCLE = [
  ["Draft", "Client"],
  ["Submitted", "Ownpath"],
  ["Assigned", "Ownpath"],
  ["In production", "Ownpath"],
  ["Needs input", "Client"],
  ["Delivered", "Client or approver"],
  ["Feedback sent", "Ownpath"],
  ["Approved", "None, or client picks formats"],
  ["Preparing formats", "Ownpath"],
  ["Closed", "None"],
] as const;

export const TENSIONS = [
  ["Status needs to communicate both progress and responsibility.", "Client · The wait"],
  ["Commenting and actually submitting feedback are different moments.", "Client · Feedback"],
  ["Multiple versions create uncertainty about what is current.", "Client · Review"],
  ["Reassignment can leave two designers believing they own the same brief.", "Designer · Pick up"],
  ["Repeated questions make the system appear as though it is not listening.", "PM agent · Clarification"],
] as const;

export const CLIENT_JOURNEY = {
  head: ["Stage", "Triggers", "States", "Key anxieties"],
  rows: [
    ["1 · File a brief", "New requirement (offer, campaign, calendar, event); deadline approaching; content-bank top-up; existing work needs an adaptation", "Draft → Ready to submit → Submitting → Submitted", "Brief confidence; missing context; reference context; change of mind (locked after submit)"],
    ["2 · The wait", "Brief submitted; Ownpath picks it up; work begins", "Submitted (queued) → Picked up → In production (opaque)", "Pickup; status freshness; deadline; silent wait; progress visibility; unexpected delay"],
    ["3 · Clarification", "Ownpath needs info, assets or a decision mid-production and work becomes blocked", "Needs input (client’s turn) → Input received → In production", "Action ownership; question clarity; repeated information; decision uncertainty; deadline impact; work resuming after response"],
    ["4 · Review", "First creative delivered; revised version delivered", "Ready for review → Reviewing", "First reveal; brief alignment; on-brand confidence; wrong version; decision clarity"],
    ["5 · Feedback", "Requester wants changes and/or invites reviewers to give input", "Reviewing → Collecting feedback → Feedback ready → Feedback submitted", "Vague feedback; multiple reviewers; conflicting feedback; feedback authority; whether feedback has actually been submitted"],
    ["6 · Revision", "Client submits feedback; responsibility moves back to Ownpath", "Feedback submitted → Waiting on Ownpath → In progress → Ready for review", "Feedback received; revision status; looking for the next version"],
    ["7 · Approve & use", "Approver satisfied; review complete; final creative ready", "Ready to approve → Approving → Approved → Final files ready → Downloaded / Shared", "Approval finality; wrong version; publish confidence; consistency across a set; issue found after approval"],
  ],
};

export const EMOTIONS = {
  head: ["Stage", "Core emotional tension", "Emotional job"],
  rows: [
    ["File a brief", "Have I explained what I need clearly enough, has Ownpath received it, and what happens if something needs changing?", "Create confidence in the handoff: the client knows what has been submitted, what can still change, and when the brief becomes fixed."],
    ["The wait", "Has Ownpath taken this on, is it moving, and will I get it when expected?", "Maintain trust while the work is with Ownpath, without exposing internal production activity."],
    ["Clarification", "What exactly do they need from me, is this stopping the work, and did my response actually resolve it?", "Make interruptions easy to resolve, and show when responsibility has moved back to Ownpath."],
    ["Review", "Is this what I asked for, am I reviewing the right version, and what am I deciding?", "Make the work easy to judge."],
    ["Feedback", "Who needs to give input, what feedback matters, and has the final direction actually been sent?", "Keep feedback coordinated: reviewers contribute without unnecessary control, and the requester consolidates before sending."],
    ["Revision", "Did Ownpath receive and understand my feedback, have they started, and will the next version address it?", "Restore confidence after requesting change."],
    ["Approve & use", "Am I approving the correct thing, is it truly final, and can I safely use it?", "Create confidence in finality: what was approved, which output is final, and what happens if finality breaks."],
  ],
};

export const HMWS = {
  head: ["Stage", "What we learned", "How might we…"],
  rows: [
    ["File a brief", "Clients need confidence that they’ve communicated enough without making intake heavy.", "…help clients give Ownpath enough useful context without making filing a brief feel like work?"],
    ["The wait", "Status needs to communicate both progress and responsibility.", "…make it immediately clear who has the next move and whether the client needs to do anything?"],
    ["Clarification", "Clients may be asked for something they’ve already provided.", "…use existing brief and request context so clients aren’t repeatedly asked for the same information?"],
    ["Review", "Multiple versions create uncertainty about what is current.", "…make it impossible to mistake an older version for the version currently being reviewed?"],
    ["Feedback", "Commenting and actually submitting feedback are different moments.", "…make it unmistakable when feedback is still being gathered versus when it has actually been handed back to Ownpath?"],
    ["Revision", "Feedback being submitted doesn’t mean revision work has started.", "…distinguish “Ownpath has my feedback” from “Ownpath is actively revising the work” without adding unnecessary process states?"],
    ["Approve & use", "Approval is consequential and must be tied to the correct creative or version.", "…make approval feel deliberate without making a routine approval unnecessarily heavy?"],
  ],
};

export const SCENARIOS = {
  head: ["Lens", "Scenario", "Anxiety", "Principles", "Expected response", "Acceptance criteria"],
  rows: [
    ["Normal", "Requester collects feedback and submits it to Ownpath", "Have we captured what needs changing?", "6, 7", "Keep comments attached to the work and make final feedback submission explicit", "Client knows what feedback is being handed back to Ownpath"],
    ["Error", "Reviewers give conflicting feedback", "Conflicting feedback / feedback authority", "1, 4", "Keep conflicting feedback visible; route the decision to whoever owns the final call", "Ownpath isn’t forced to guess which feedback to follow; the decision owner can resolve the conflict"],
    ["Waiting", "One or more reviewers haven’t responded", "Who are we still waiting for?", "1, 3", "Show who has responded and who is still pending", "Client can see who the review is waiting on and who needs to act"],
    ["Status", "Feedback has been gathered but hasn’t been submitted to Ownpath", "Is Ownpath already working on these comments?", "1, 3", "Clearly distinguish collected comments from submitted feedback", "Client knows Ownpath hasn’t received the final change request until it is submitted"],
  ],
};

export const DESIGNER_FLOW = {
  head: ["Stage", "Decided", "Open at the time → what the files say"],
  rows: [
    ["1 · Pick up brief", "Superadmin assigns, no self-assign from the queue. One designer per brief, never two.", "How does the PM agent fit into pickup? → It prepares a source-linked brief digest, surfaces Known Gaps and suggests clarification questions. The designer decides whether production can begin."],
    ["2 · Set up and first generate", "Templates exist for repeatable content. Everything else is AI generation. The designer sees a ranked template list, or goes to AI generation.", "—"],
    ["3 · Iterate", "Ungated: no round limit on the Ownpath side. Two ways to instruct: chat (primary) and region select.", "—"],
    ["4 · Clarify", "Clarification locks production. The turn flips to the client. The brief stays locked.", "Mid-iteration clarification had no route → Preserve the current working version, lock creation, client responds, return to the same working version once the blocker is resolved."],
    ["5 · Submit for review", "Send is a deliberate action. No recall. The client sees only the selected creative.", "Conflict: the client-side journey listed Version History as a client touchpoint → The client sees the exact version submitted for the current review. Internal iterations stay hidden."],
    ["6 · Wait", "Chat and generation are locked; canvas browsable, brief readable. The designer is notified when feedback lands, or when the creative is approved with no feedback. Not when the client opens the review.", "How does the PM agent fit into the locked wait? → It stays absent during a healthy wait. It does not create updates or interpret silence."],
    ["7 · Revise", "The loop repeats until approval. The designer can add a note on anything deliberately not actioned. No change-list ticking.", "Does the client see earlier versions? → Only the current submitted one."],
    ["8 · Approve and reframe", "AI branch: re-crops of the approved parent. Download unlocks.", "Gap: no decisions had been taken here. Can a brief be reopened? → No. Closed briefs are not reopened, and post-approval changes must not silently alter the approved record."],
    ["X · External edit", "A legitimate happy-path route until font fidelity is solved in the tool. AI branch only. MVP: the designer checks the re-uploaded file themselves.", "Post-MVP: a drift check on re-upload."],
  ],
};

export const PM_RULES = {
  head: ["Rule", "When it applies", "Required behaviour"],
  rows: [
    ["Maintain one turn owner", "After every agent interaction or state-changing handoff", "End with exactly one owner: Client, Ownpath, Approver, or None."],
    ["Escalate decisions outside agent authority", "Scope, timeline, price, commercial questions, unresolved conflicts, dissatisfaction, exceptions, or a request for a person", "Summarise the issue and relevant context without making the decision."],
    ["Remain transparently an agent", "Whenever the PM agent communicates", "Present assistance as a system capability, never as an Ownpath employee."],
    ["Keep brief-versus-brand conflicts internal first", "When client instructions conflict with brand-workspace rules", "Surface the conflict to Ownpath; do not confront the client or make a brand ruling."],
    ["Never become a workflow blocker", "Whenever agent assistance is invoked", "If the agent cannot return a usable response within the agreed latency, preserve the original input and let the flow continue."],
    ["Preserve source and interpretation", "Whenever the agent restructures, summarises or clarifies client input", "Keep the original input available and distinguish it from the agent’s interpretation."],
    ["Never repeat or drip questions", "Whenever the agent prepares a clarification", "Check the brief, attachments, amendments and earlier threads first. Ask all currently known blockers together."],
    ["Separate coordination from creative and brand judgement", "Whenever the agent reads a brief, creative or feedback", "Organise intent and handoffs without proposing creative direction, assessing quality or making a brand ruling."],
    ["Preserve locked records and exact-version linkage", "When clarification, feedback, revision or approval changes the record", "Do not overwrite the confirmed brief. Append amendments, and keep every comment, decision and approval linked to the exact version."],
  ],
};

export const DECISIONS = [
  {
    title: "Reviewers are added in the review stage, not the brief stage.",
    why: "The requester should be able to establish the requirement with Ownpath before bringing other people in. Reviewers are most useful once there is creative work to react to.",
    impact: "Keeps brief ownership clear and reduces early coordination. Reviewers focus on the work rather than shaping the initial request.",
  },
  {
    title: "The person who creates the brief is the one who can edit it and approve it. Not the reviewers.",
    why: "Someone needs to remain accountable for the original request and the final decision. If every reviewer could edit or approve, ownership would be unclear.",
    impact: "One clear decision owner throughout the request. Reviewers contribute feedback without changing the source brief or making the final call.",
  },
  {
    title: "Delivery time starts when the brief is moved to production.",
    why: "To set a fair and reliable delivery commitment based on when Ownpath is actually ready to begin, rather than time spent before production starts.",
    impact: "Pre-production waiting does not count toward turnaround, so the client’s total wait may be longer than the stated production turnaround.",
  },
  {
    title: "A brief is locked once production starts, or once the client starts working on it themselves. Any edit after that counts as rework and becomes a new brief ticket.",
    why: "Ownpath needs a stable source of truth once production starts. If the brief keeps changing, it becomes hard to tell what Ownpath agreed to deliver from requirements added later.",
    impact: "",
  },
  {
    title: "In review, feedback is held until the designer moves the brief back to production.",
    why: "Ownpath should revise against an agreed set of feedback, not react to comments while the client and reviewers are still deciding. Otherwise work could restart against incomplete or conflicting direction.",
    impact: "Fewer fragmented or conflicting revision requests, and no reworking the same creative several times within one feedback round.",
  },
  {
    title: "“Collaborators” became “Reviewers”.",
    why: "“Collaborator” implies broader participation and ownership than the role has. Their role in Vintage is to review the work and contribute feedback, not manage the request.",
    impact: "Clearer expectations about what invited users can do, and less risk of reviewers assuming they can edit, manage or decide.",
  },
  {
    title: "Standalone creatives are approved one by one, not as one set. Multi-part creatives such as carousels and decks are defined separately.",
    why: "Approval should apply only to work the client has actually reviewed and accepted. Standalone creatives in the same request may reach that point at different times.",
    impact: "One creative can move forward without implying the whole request is approved. Unfinished creatives remain unaffected.",
  },
  {
    title: "After the client submits feedback, the status reads “waiting on assignee” until the designer moves it to “in progress”.",
    why: "Submitting feedback hands the next action back to Ownpath, but that doesn’t mean revision work has started.",
    impact: "Clients don’t assume revision is underway when their feedback is only waiting to be picked up, so progress expectations are more accurate.",
  },
] as const;

export const DEV_QUESTIONS = [
  { group: "Edit flow", items: ["How does editing the brief work?", "How many times can you edit the brief?", "When a brief is edited, how do we know if it’s an edit or a new request (revision vs rework)?", "Until what stage of the pipeline do we allow brief edits?", "How many rounds of clarification do we allow?", "Can a client abandon a brief?"] },
  { group: "Feedback flow", items: ["What is vague feedback?", "How many rounds of feedback are allowed?", "How is conflicting feedback addressed?", "If Ownpath makes an error in the creative, should fixing it use up one of the client’s revision rounds?", "Can a client reject a creative? What happens then?"] },
  { group: "Notification flow", items: ["When a brief enters a new state, is the client notified?", "When clarifications are needed, how often do we notify the client?", "Which events must generate a notification, and who gets each one?"] },
  { group: "Permissions and access", items: ["Can invited users see the entire ticket history or just their own?", "Which access levels exist (admin, superadmin, member) and what can each do?", "If the approver goes on leave, how can someone assign another approver?"] },
  { group: "Aspect ratio", items: ["We treated aspect ratio as a request after the first creative was approved. After seeing Rush’s requests, it arrives as part of the brief. Do we show every size in the first generation, and what happens if one of them is edited?"] },
  { group: "For dev", items: ["How do we handle campaign-related briefs? A mini workspace inside the parent workspace?", "How do we handle carousels?"] },
] as const;

export const AUDIT = {
  head: ["Found when checking my documents against each other", "What the files say"],
  rows: [
    ["Four documents said the client sees version history. One said they don’t.", "The client sees the exact version submitted for the current review. Internal iterations and designer version history stay hidden."],
    ["External edit: “no provenance marker” on one board, “requires provenance and source-version linkage” in another.", "No marker. MVP: the designer checks the re-uploaded file themselves. A drift check comes after MVP."],
    ["“Clarification locks production”, but intake also tags flags blocking and non-blocking.", "Open in the audit: either clarification always locks, or only blocking flags lock."],
    ["A new principle, “work only starts with alignment from both parties”, contradicted “Warn, don’t wall”.", "Proposed rewording: “Start on confirmed intent, not assumed intent.” Open Known Gaps don’t prevent a start; the designer decides which gaps block."],
    ["Reopening after approval was decided “No”, which leaves the client with nothing to do if an issue turns up later.", "Open: the client needs a named route, such as a new brief or an adaptation."],
    ["The designer flow listed four starting points, but only two are routes. “Existing asset” appears nowhere else.", "Open: is adapting an existing asset a third route?"],
  ],
};

export const OPEN_ITEMS = [
  "What route does the client have if an issue is found after approval? Closed briefs never reopen, so today the answer is a new brief.",
  "Does the designer see who is authorised to approve, and what happens if someone unauthorised approves?",
  "What can the designer do while a non-blocking flag is open? Can they submit for review with it unresolved?",
  "During the wait, does the designer see full version history or only the version that was sent?",
  "Should the PM agent optionally check the chosen creative against explicit, factual brief requirements before submission? If so, it may check format, required text and required deliverables. It would not judge quality, decide if it is on-brand, replace Vintage Guard, or block submission.",
  "If the client wants a size that wasn’t in the brief, is that a new brief or an amendment?",
];

// Review threads, quoted from the comment threads in the workbooks. "Review" is the reviewer, "Me" is the author.
export const THREADS = [
  {
    where: "Designer side · Sub-scenarios · B11 and B13",
    cell: "Brief reassignment is taking time to appear in the designer’s queue",
    comments: [
      ["Review", "Not sure i get this? who is reassigning the brief?"],
      ["Me", "Hmm, isn’t it Ownpath admin reassigning the brief? like assigning and reassigning the brief?"],
      ["Review", "Reassignment is a flow that needs to be discussed."],
    ],
    landed: ["Creation flow · Pick up · H4", "DECIDED: Superadmin assigns, no self-assign from queue. One designer per brief, never two."],
  },
  {
    where: "Designer side · Sub-scenarios · J36",
    cell: "An issue is discovered after the brief is closed",
    comments: [
      ["Review", "Closing a brief is a deliberate action, are we keeping reopen a part of the scope?"],
      ["Me", "What I meant was that if the client identifies an issue or requests a change after approval, they should create a new brief linked to the original for context. The closed brief, approved creative, and approval history remain unchanged."],
    ],
    landed: ["Designer side · Sub-scenarios · J36", "Closed brief cannot be edited or reopened. An authorized client can create a new brief for the change."],
  },
  {
    where: "PM agent flow · Designer · C5",
    cell: "3. Designer chooses either Template or Generate from brief.",
    comments: [
      ["Review", "Template, Existing asset, Generate from brief or Blank - what are these? There are only two states no? Template or AI generate"],
      ["Me", "addressed. I think i overlooked this!"],
    ],
    landed: ["Creation flow · Set up · H5", "DECIDED: Templates exist for repeatable content buckets … Everything else is AI generation."],
  },
  {
    where: "Creation flow · Sub-journeys · E6",
    cell: "No structural change: layout fixed, image cannot be swapped, blocks cannot be moved",
    comments: [
      ["Me", "Hmm, if template images cannot be swapped, can it be too restrictive and ambiguous? Might be we can define each template slot as one of: Editable text, Replaceable image, Fixed brand element, Locked structure. The designer must see these boundaries before editing."],
    ],
    landed: null,
  },
  {
    where: "Client flow · Scenarios (revised) · row 44",
    cell: null,
    comments: [
      ["Review", "We need to add aspect ratio as a part of this?"],
    ],
    landed: ["Questions board · Aspect ratio", "We treated aspect ratio as a request after the first creative was approved. After seeing Rush’s requests, it arrives as part of the brief."],
  },
] as const;

export const FLOW = [
  { n: "01", name: "File a brief", owner: "Client", steps: ["Describes the need in one sentence", "Answers size, deadline and the rest, one question at a time", "Reviews the brief and sends it to Ownpath"], shots: [["tell-us", 1422, 751, "The Tell us what you need screen."], ["brief-ready", 1429, 794, "The Your brief is ready screen."]] },
  { n: "02", name: "Assign", owner: "Ownpath ops", steps: ["Sees the brief in the queue", "Assigns one designer. No self-assign from the queue"], shots: [["queue", 1600, 967, "The Ownpath queue board."]] },
  { n: "03", name: "Make", owner: "Designer", steps: ["Picks a template or generates from the brief", "Iterates, with no round limit on the Ownpath side", "If blocked, asks the client. The turn flips and the brief stays locked"], shots: [["locked", 1600, 429, "A brief page reading Work is in progress. The brief below is locked."]] },
  { n: "04", name: "Review", owner: "Client or approver", steps: ["Sees only the version sent for review", "Submits feedback, or approves that exact version"], shots: [["directions", 823, 580, "Two creative directions with Send to designer and Approve creative."]] },
  { n: "05", name: "Deliver", owner: "Ownpath, then none", steps: ["Formats are prepared before the work reads as done", "Approved work lands in a library. The brief closes and does not reopen"], shots: [["approved", 1424, 747, "The Approved creatives library."]] },
] as const;
