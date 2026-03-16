---
title: "Agentic coding"
date: "2025-09-11"
---

I have been experimenting with different agents for my development workflow. I've used Claude Code the most since its release, and recently I've been expanding my usage and looking into Opencode, a Claude Code open-source alternative.

The Opencode team has been working closely with AI providers to build a better agentic coding experience. They've put together a selection of agents that are best suited for this task. You can read more about it here: [https://opencode.ai/docs/zen/](https://opencode.ai/docs/zen/)

This raised a question for me: Why do non-OSS models' outputs not vary much across providers?

The answer is that closed-source models are more tightly controlled by the companies running them, whereas open-source models can be re-configured by whoever hosts them. OSS models may vary across providers due to differences in frameworks (e.g. vLLM, sglang, TGI), hardware specs (e.g. GPU, kernal), and parameters. Therefore, the nature of closed-source is homogeneity, while the nature of open-source is heterogeneity.

I find Grok Code Fast 1 to be excellent for my daily usage. Occasionally, I switch to Opus for deeper analysis.

Other non-OSS models I use are:

- Kimi K2
- Qwen3 Coder

(they are recommended by the Opencode team so I feel assured in the quality of the inference and agentic jobs)
