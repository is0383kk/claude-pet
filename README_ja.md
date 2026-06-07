<table>
	<thead>
    	<tr>
      		<th style="text-align:center"><a href="./README.md">English</a></th>
      		<th style="text-align:center">日本語</th>
    	</tr>
  	</thead>
</table>

# claude-pet

Windows 上で動作する Electron 製のデスクトップ常駐型キャラクター AI アシスタントです。

<img src="https://private-user-images.githubusercontent.com/48275067/604068071-e60d4021-eeeb-47d1-813b-c36148dbf2b8.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODA4MzkzMTMsIm5iZiI6MTc4MDgzOTAxMywicGF0aCI6Ii80ODI3NTA2Ny82MDQwNjgwNzEtZTYwZDQwMjEtZWVlYi00N2QxLTgxM2ItYzM2MTQ4ZGJmMmI4LmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA2MDclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNjA3VDEzMzAxM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWNhZDRmNjgzNGFiOGI4YTgwMmEzNjg1YTM5MjAxNDg0ODVkMGUyY2RhMDVkOGNhYTgwNjc4ODg4MWJkNDc2NzQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRmdpZiJ9.4pqcKygRp04Ho8PZBpRgxRj6Cm4Waahjf5uAbquZ0Rw" alt="claude-pet demo" />

## ■ 動作環境

- Windows
- Node.js 20 LTS
- Electron 33

## ■ 環境設定

### setting.json

プロジェクトルートの `.claude/settings.json`に`ANTHROPIC_API_KEY`または各種クラウド連携用の環境変数を設定します。

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

### キャラクターアセット
キャラクターアセットは [**Codex のアセット仕様**](https://github.com/openai/skills/blob/main/skills/.curated/hatch-pet/references/animation-rows.md)に従います。  
ペットのスプライトは `pets/<id>/` 配下に配置します。

```text
pets/<id>/
├── pet.json
└── spritesheet.webp
```

表示するペットの識別子は `src/shared/constants.ts` の `PET_ID` で指定します（既定値: `sample`）。

### セットアップ

```powershell
npm install
npm run build
npm start
```
