# Skill-pack eval rubric

**Written before the first run. Do not edit it to explain a result.**

This rubric exists to answer one question: when a designer brings a real problem to Claude
Code, does having the aiux skills installed produce a better answer than not having them?

## The anti-circularity rule

None of these axes may restate anything the skills themselves say.

The skills end every file with *"make the smallest change that genuinely realises the
pattern. Do not add UI the product does not need."* An axis rewarding restraint or
minimality would hand the pack a win by construction: it would be scoring the skills
against their own closing instruction. The same goes for pattern doctrine ("did it
consider trust calibration?"). The judge must never be told which patterns exist.

Every axis below is phrased around **the designer's problem being solved**, not around
whether any pattern was correctly applied.

## Axes (0-5 each)

| Axis | Asks | 5 looks like | 0 looks like |
|---|---|---|---|
| `diagnosis` | Does it identify why the current design fails *this* user, in *this* scenario? | Names the specific moment the experience breaks and why | Restates the request back, or jumps straight to solutions |
| `specificity` | Are the recommendations anchored to concrete, nameable UI? | "Move the confirm step above the fold and label it with the amount" | "Improve the user experience around confirmation" |
| `tradeoff` | Does it acknowledge a real cost, tension, or case where the advice does not apply? | Names what the change costs and who it hurts | Pure upside; every suggestion is free |
| `actionability` | Could a designer execute this without coming back with questions? | Enough detail to open Figma and start | Directional advice needing another round to be usable |
| `groundedness` | Are claims tied to what was actually described? | Works only from the given scenario | Invents product facts, users, or data that were never stated |

## Forced pairwise choice

Axis scores drift. The judge also answers, blind: **which response would you rather hand
to the designer who asked?** A/B order is randomised per task and the labels carry no
information about arm.

## Blinding

Skill text leaks its origin. Before judging, every response is scrubbed of:

- the site domain, in any form
- the token `aiux` in any casing
- the boilerplate closing sentence shared by all 38 skill files
- `Reference:` lines pointing at pattern pages

Pattern *names* are deliberately NOT scrubbed. Baseline Claude already knows terms like
"progressive disclosure" and "human in the loop", so their presence is not a reliable tell,
and stripping them would remove real substance from both arms.

## Harm detection

At least one task is written so that no aiux pattern meaningfully applies. If the pack
makes those answers worse (pattern-shaped advice pushed onto a problem that is not about
AI UX), that is a finding, and the harness must be able to see it. Benefit-only measurement
is not measurement.

## Honest power

With a handful of tasks and an LLM judge this detects a **large** effect, not a subtle one.
Each arm runs `REPEATS` times per task; the report prints run-to-run spread next to the
delta. If the spread is the same size as the delta, the run proved nothing, and the report
must say so rather than quoting the delta.
