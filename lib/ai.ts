import { RankedActivity, UserCriteria } from "./types";

export async function rerankWithAI(input: {
  criteria: UserCriteria;
  ranked: RankedActivity[];
}): Promise<RankedActivity[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return input.ranked;

  const prompt = {
    criteria: input.criteria,
    candidates: input.ranked.slice(0, 8).map((a) => ({
      id: a.id,
      title: a.title,
      score: a.score,
      description: a.description,
      indoorOutdoor: a.indoorOutdoor,
      estimatedCostSgd: a.estimatedCostSgd,
      durationHours: a.durationHours,
      travelMinutesFromHome: a.travelMinutesFromHome
    }))
  };

  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "You reorder family activity candidates by user intent. Return strict JSON: {\"ordered_ids\":[...]}"
          },
          {
            role: "user",
            content: JSON.stringify(prompt)
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "ordered_ids",
            schema: {
              type: "object",
              properties: {
                ordered_ids: {
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["ordered_ids"],
              additionalProperties: false
            },
            strict: true
          }
        }
      })
    });

    if (!res.ok) return input.ranked;
    const json = await res.json();
    const content = json.output?.[0]?.content?.[0]?.text;
    if (!content) return input.ranked;

    const parsed = JSON.parse(content) as { ordered_ids?: string[] };
    const ids = parsed.ordered_ids;
    if (!ids?.length) return input.ranked;

    const map = new Map(input.ranked.map((r) => [r.id, r]));
    const reOrdered = ids.map((id) => map.get(id)).filter(Boolean) as RankedActivity[];
    const missing = input.ranked.filter((r) => !ids.includes(r.id));
    return [...reOrdered, ...missing];
  } catch {
    return input.ranked;
  }
}
