<table>
	<thead>
    	<tr>
      		<th style="text-align:center">English</th>
      		<th style="text-align:center"><a href="./README_ja.md">日本語</a></th>
    	</tr>
  	</thead>
</table>

# claude-pet

A desktop resident character AI assistant built with Electron, running on Windows.

<img src="https://github.com/user-attachments/assets/0bd4eee0-f43b-4e96-a603-e9e1982225dc" alt="claude-pet demo" />

## ■ Requirements

- Windows
- Node.js 20 LTS
- Electron 33

## ■ Configuration

### setting.json

Set `ANTHROPIC_API_KEY` or environment variables for various cloud integrations in `.claude/settings.json` at the project root.

```json:settings.json
{
  "env": {
    // Add environment variables here. These will be available to the agent when it runs.
    "ANTHROPIC_API_KEY": "your-anthropic-api-key",
    "CLAUDE_CODE_USE_BEDROCK": "0",
    "CLAUDE_CODE_USE_VERTEX": "0",
    "CLAUDE_CODE_USE_FOUNDRY": "0"
  }
}
```

### Character Assets
Character assets follow the [**Codex asset specification**](https://github.com/openai/skills/blob/main/skills/.curated/hatch-pet/references/animation-rows.md).  
Place pet sprites under `pets/<id>/`.

```text
pets/<id>/
├── pet.json
└── spritesheet.webp
```

The identifier of the pet to display is specified by `PET_ID` in `src/shared/constants.ts` (default: `sample`).

### Setup

```powershell
npm install
npm run build
npm start
```
