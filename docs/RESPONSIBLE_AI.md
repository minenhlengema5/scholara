# Responsible AI

This assistant is a productivity aid, not an authority. The following principles are built into the product and must be respected by anyone using or extending it.

## Key principles

- **AI may generate inaccurate information.** Large language models can produce content that sounds confident but is wrong, outdated, or incomplete (hallucinations). Treat every output as a draft.
- **Human validation is required.** A person must review, fact-check, and approve AI output before it is sent, published, or acted upon. The AI never takes actions on the user's behalf.
- **Do not enter confidential information.** Avoid pasting passwords, customer PII, trade secrets, financial data, or anything covered by NDA or regulation. Inputs are sent to a third-party model provider.
- **Outputs should be reviewed before use.** Emails, summaries, and plans are starting points. Verify names, dates, figures, commitments, and tone before relying on them.

## How the product reinforces this

- A persistent Responsible AI banner appears on every AI feature.
- System instructions tell the model **not to fabricate** owners, dates, decisions, or confidential details that were not provided.
- The chatbot is scoped to workplace productivity topics and reminds users to verify important information.
- No user data is persisted server-side; requests are processed and returned.

## Additional considerations

- **Bias & fairness:** Model output can reflect biases in training data. Review communications for inclusive, respectful language.
- **Transparency:** Users are told the app is AI-powered and which model family is used (Google Gemini).
- **Accountability:** The human sender/author remains responsible for anything produced with the tool.
- **Data minimization:** Only send the minimum context needed to complete a task.
