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
