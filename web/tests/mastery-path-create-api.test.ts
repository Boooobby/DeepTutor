import assert from "node:assert/strict";
import test from "node:test";

import { generateMasteryTopicDraftCompatible } from "../lib/learning-api";

test("structured mastery draft client posts the complete nullable plan payload", async () => {
  const original = globalThis.fetch;
  let request: { url: string; method?: string; body?: string } | undefined;
  globalThis.fetch = async (input, init) => {
    request = { url: String(input), method: init?.method, body: init?.body as string | undefined };
    return Response.json({ description: "d", modules: [] });
  };
  try {
    await generateMasteryTopicDraftCompatible({
      name: "Algebra",
      goal: "Solve equations",
      sources: [],
      topic: { name: "Algebra", purpose: "Solve equations" },
      learner_context: { current_level: null, known_topics: null, skipped_topics: null },
      learning_preferences: null,
      time_constraints: null,
      milestones: null,
    });
    assert.ok(request?.url.endsWith("/api/mastery-paths/topics/draft"));
    assert.equal(request?.method, "POST");
    const body = JSON.parse(request!.body ?? "{}") as Record<string, unknown>;
    assert.deepEqual(body.time_constraints, null);
    assert.deepEqual(body.milestones, null);
    assert.deepEqual(body.topic, { name: "Algebra", purpose: "Solve equations" });
  } finally {
    globalThis.fetch = original;
  }
});
