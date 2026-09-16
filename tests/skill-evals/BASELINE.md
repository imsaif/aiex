# Skill-pack Eval Baseline

What we have actually measured about whether the skill pack helps, so a later run
has something to be compared against. The raw per-run JSON under `runs/` is
gitignored — it is one afternoon on one machine. This file is the deliberate
record, and it is the one to update.

Update **Latest baseline** when a run produces a result worth keeping; move the
old one into **History** so deltas stay visible. Record what was actually
observed, including nulls — a run that showed no effect is a finding, and losing
it means someone re-runs it in six months to learn the same thing.

---

## Latest — 2026-09-16: no corpus run yet, and the reason is the finding

**There is no axis table below, because a full corpus run would not have meant
anything on this date.** The harness's own control check stopped it, which is
what that check is for.

**Setup**
- Harness: `npm run eval:skills`
- Subject model: `claude-sonnet-4-6`, judge: `claude-sonnet-4-6`
- Arms: `with` (38 skills at `.claude/skills/aiux-*`) / `without` (empty)
- Isolation: throwaway `CLAUDE_CONFIG_DIR`, scratch repos with no `CLAUDE.md`
- Ran: 1 task (`invoice-prefill`), 1 repeat, as a smoke test

**Result: zero skills loaded in either arm.** With and without were the same
condition, so the -0.20 delta that run printed is noise and is recorded here only
so nobody quotes it.

**What the diagnostics established**

| Question | Answer | How |
|---|---|---|
| Are the skills installed? | Yes, 38 folders | `prepareArena()` output |
| Are they advertised to the session? | Yes — 55 skills listed, 38 ours | `probe.sh`, init event |
| Is the harness's prompt suffix suppressing them? | No — a bare task loads nothing either | `probe-suffix.sh` |
| Does an explicit nudge load one? | Yes | `probe-suffix.sh` arm C |
| Do they load during real file work? | **Only with design framing** | `probe-working.sh` |

`probe-working.sh` is the one worth remembering. Against a real flawed component:

- *"Fix the component"* → Read, Edit, **no skill**
- *"Redesign how the prediction is presented, and change the code"* → **loaded a skill**

So the pack reaches people who are **building with design framing**, and stays
invisible to people **asking a question**. That matches the claim on the tin
("triggers on its own when you work on a surface that pattern covers") for
working, and not for asking.

**Held at one sample, not treated as a pattern:** the nudged run picked
`confidence-visualization` for an autofill complaint, which is the wrong skill.
One observation. Worth re-testing, not worth quoting.

**What this baseline does NOT establish**
- Whether the guidance is any good. Nothing has been judged yet.
- Anything about the other 9 corpus tasks.
- Anything about a "working" corpus — the tasks are all prose questions, and the
  probe that found the real behaviour is a shell script, not a corpus entry.

---

## Before the next run

Two things would make the first real run worth its API spend:

1. **A working corpus.** The tasks are all "asking", which is the condition where
   nothing fires. `fixtures/InvoiceForm.tsx` and `probe-working.sh` are the
   sketch of the other half.
2. **A third arm.** `without` / `with-silent` / `with-nudged` separates "is the
   guidance good" from "does it ever get found". They are different problems with
   different fixes, and one delta cannot tell them apart.

Run with `EVAL_REPEATS=2` so the report can print run-to-run spread beside the
delta. At `REPEATS=1` there is no way to separate an effect from judge variance,
and the runner says so rather than letting the number be quoted.

---

## History

None yet. This is the first entry.
