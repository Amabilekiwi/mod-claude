# snella

Mod per Claude Code: prima che un tuo prompt arrivi al modello principale, Haiku lo riscrive in forma chiara (refusi corretti, obiettivo esplicito, richieste multiple separate in punti). La versione di Haiku viene allegata accanto al testo originale, che resta quello che vale in caso di conflitto. Salta i comandi `/`, i messaggi sotto i 15 caratteri e quelli automatici.

## Installazione

Al prompt di una sessione nel terminale:

```
/plugin install snella --marketplace Amabilekiwi/mod-claude
```

Rispondi `y` per aggiungere il marketplace, poi scegli lo scope (user per averla in tutte le sessioni).

Da shell:

```
claude plugin install snella --marketplace Amabilekiwi/mod-claude
```

Nell'app desktop, dove `/plugin` non funziona: clicca + accanto al box del prompt, poi Plugins, Add marketplace con `Amabilekiwi/mod-claude`, poi Add plugin.

