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

<img src="https://private-user-images.githubusercontent.com/48275067/604068071-e60d4021-eeeb-47d1-813b-c36148dbf2b8.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODA4MzkzMTMsIm5iZiI6MTc4MDgzOTAxMywicGF0aCI6Ii80ODI3NTA2Ny82MDQwNjgwNzEtZTYwZDQwMjEtZWVlYi00N2QxLTgxM2ItYzM2MTQ4ZGJmMmI4LmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA2MDclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNjA3VDEzMzAxM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWNhZDRmNjgzNGFiOGI4YTgwMmEzNjg1YTM5MjAxNDg0ODVkMGUyY2RhMDVkOGNhYTgwNjc4ODg4MWJkNDc2NzQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRmdpZiJ9.4pqcKygRp04Ho8PZBpRgxRj6Cm4Waahjf5uAbquZ0Rw" alt="claude-pet demo" />

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
