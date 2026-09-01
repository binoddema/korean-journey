import React from "react";
import { useStore } from "../store";
import { derive, levelInfo } from "../lib/progress";
import { speechState } from "../lib/speech";
import { Card, CardTitle } from "../components/ui";
import { PageHeader } from "../components/Layout";

const ACCENTS = ["#5b4be0", "#3b82f6", "#16a34a", "#e0526e", "#f0902b"];
const DAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

const Toggle = ({
  on,
  onChange,
  label,
  desc,
  icon,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc?: string;
  icon?: string;
}) => (
  <div className="setting">
    <div className="s-left">
      {icon && <span className="s-icon">{icon}</span>}
      <div>
        <strong>{label}</strong>
        {desc && <small className="muted">{desc}</small>}
      </div>
    </div>
    <button
      className={`switch ${on ? "on" : ""}`}
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      aria-label={label}
    >
      <span />
    </button>
  </div>
);

const Stepper = ({
  value,
  min,
  max,
  onChange,
  label,
  desc,
  icon,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
  desc?: string;
  icon?: string;
}) => (
  <div className="setting">
    <div className="s-left">
      {icon && <span className="s-icon">{icon}</span>}
      <div>
        <strong>{label}</strong>
        {desc && <small className="muted">{desc}</small>}
      </div>
    </div>
    <div className="stepper-ctrl">
      <button onClick={() => onChange(Math.max(min, value - 1))} aria-label="Diminuisci">
        −
      </button>
      <b>{value}</b>
      <button onClick={() => onChange(Math.min(max, value + 1))} aria-label="Aumenta">
        +
      </button>
    </div>
  </div>
);

export const SettingsPage = () => {
  const { state, updateSettings, setName, reset, exportState, importState } = useStore();
  const s = state.settings;
  const d = derive(state);
  const lvl = levelInfo(state.xp);
  const [msg, setMsg] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const audio = speechState();

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(null), 3000);
  };

  const doExport = () => {
    const blob = new Blob([exportState()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "korean-journey-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    flash("Backup scaricato");
  };

  const doImport = (file: File) => {
    const r = new FileReader();
    r.onload = () => flash(importState(String(r.result)) ? "Progressi ripristinati" : "File non valido");
    r.readAsText(file);
  };

  const testNotification = async () => {
    if (!("Notification" in window)) return flash("Le notifiche non sono supportate qui");
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return flash("Permesso negato dal browser");
    new Notification("Korean Journey", { body: "화이팅! È l'ora della lezione di oggi 🇰🇷" });
    flash("Notifica inviata");
  };

  return (
    <>
      <PageHeader icon="⚙️" title="Impostazioni" sub="Personalizza la tua esperienza di studio" />
      {msg && <div className="toast">{msg}</div>}

      <div className="grid-3">
        <div className="col">
          <Card className="pad">
            <CardTitle title="Preferenze generali" />
            <div className="setting">
              <div className="s-left">
                <span className="s-icon">🌐</span>
                <div>
                  <strong>Lingua dell'interfaccia</strong>
                  <small className="muted">L'app è in italiano</small>
                </div>
              </div>
              <select value="it" disabled>
                <option value="it">Italiano</option>
              </select>
            </div>
            <div className="setting">
              <div className="s-left">
                <span className="s-icon">🎯</span>
                <div>
                  <strong>Difficoltà</strong>
                  <small className="muted">Cambia il tipo di esercizi generati</small>
                </div>
              </div>
              <select
                value={s.difficulty}
                onChange={(e) => updateSettings({ difficulty: e.target.value as typeof s.difficulty })}
              >
                <option value="principiante">Principiante — scelta multipla e ascolto</option>
                <option value="intermedio">Intermedio — si aggiungono scrittura e dettato</option>
                <option value="avanzato">Avanzato — si scrive quasi sempre</option>
              </select>
            </div>
            <Stepper
              icon="🔖"
              label="Vocaboli nuovi al giorno"
              desc="Quanti nuovi vocaboli vuoi imparare ogni giorno"
              value={s.newPerDay}
              min={3}
              max={30}
              onChange={(newPerDay) => updateSettings({ newPerDay })}
            />
            <div className="setting">
              <div className="s-left">
                <span className="s-icon">🇰🇷</span>
                <div>
                  <strong>Data del trasferimento</strong>
                  <small className="muted">Su questa data si calcola il piano</small>
                </div>
              </div>
              <input
                type="date"
                value={s.goalDate}
                onChange={(e) => updateSettings({ goalDate: e.target.value })}
              />
            </div>
            <div className="setting">
              <div className="s-left">
                <span className="s-icon">📈</span>
                <div>
                  <strong>Parole nuove al mese</strong>
                  <small className="muted">Obiettivo del piano a lungo termine</small>
                </div>
              </div>
              <div className="stepper-ctrl">
                <button
                  onClick={() => updateSettings({ monthlyWords: Math.max(30, s.monthlyWords - 10) })}
                  aria-label="Diminuisci"
                >
                  −
                </button>
                <b>{s.monthlyWords}</b>
                <button
                  onClick={() => updateSettings({ monthlyWords: Math.min(600, s.monthlyWords + 10) })}
                  aria-label="Aumenta"
                >
                  +
                </button>
              </div>
            </div>
            <Stepper
              icon="🔁"
              label="Ripetizioni massime giornaliere"
              desc="Limite di parole per sessione di ripasso"
              value={s.maxReviews}
              min={5}
              max={60}
              onChange={(maxReviews) => updateSettings({ maxReviews })}
            />
          </Card>

          <Card className="pad">
            <CardTitle title="Apprendimento" />
            <Toggle
              icon="🔊"
              label="Riproduci audio automaticamente"
              desc="Pronuncia le parole appena compaiono"
              on={s.autoAudio}
              onChange={(autoAudio) => updateSettings({ autoAudio })}
            />
            <Toggle
              icon="🔤"
              label="Mostra romanizzazione"
              desc="La pronuncia in caratteri latini"
              on={s.showRomanization}
              onChange={(showRomanization) => updateSettings({ showRomanization })}
            />
            <Toggle
              icon="💡"
              label="Suggerimenti di memorizzazione"
              desc="Mostra i memory hook per ogni vocabolo"
              on={s.showHooks}
              onChange={(showHooks) => updateSettings({ showHooks })}
            />
            <Toggle
              icon="🐢"
              label="Pronuncia lenta"
              desc="Riproduci l'audio più lentamente"
              on={s.slowAudio}
              onChange={(slowAudio) => updateSettings({ slowAudio })}
            />
            <Toggle
              icon="📘"
              label="Spiegazioni grammaticali dettagliate"
              desc="Include gli errori tipici di chi parla italiano"
              on={s.detailedGrammar}
              onChange={(detailedGrammar) => updateSettings({ detailedGrammar })}
            />
            {d.learnedWords > 40 && s.showRomanization && (
              <p className="note">
                Hai già imparato {d.learnedWords} parole: prova a disattivare la romanizzazione per
                allenare la lettura diretta dell'Hangul.
              </p>
            )}
            {audio !== "ok" && (
              <p className="note">
                {audio === "unsupported"
                  ? "Questo browser non supporta la sintesi vocale: i pulsanti 🔊 resteranno silenziosi."
                  : "Nessuna voce coreana installata sul dispositivo. Su Windows: Impostazioni → Ora e lingua → Voce."}
              </p>
            )}
          </Card>
        </div>

        <div className="col">
          <Card className="pad">
            <CardTitle title="Aspetto" />
            <Toggle
              icon="🌙"
              label="Modalità scura"
              on={s.dark}
              onChange={(dark) => updateSettings({ dark })}
            />
            <div className="setting column">
              <div>
                <strong>Tema dell'app</strong>
                <small className="muted">Scegli il colore principale</small>
              </div>
              <div className="accents">
                {ACCENTS.map((c) => (
                  <button
                    key={c}
                    className={`accent-dot ${s.accent === c ? "on" : ""}`}
                    style={{ background: c }}
                    onClick={() => updateSettings({ accent: c })}
                    aria-label={`Colore ${c}`}
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card className="pad">
            <CardTitle title="Notifiche e promemoria" />
            <Toggle
              icon="🔔"
              label="Promemoria giornaliero"
              desc="Ricevi un promemoria per studiare"
              on={s.reminder}
              onChange={(reminder) => updateSettings({ reminder })}
            />
            <div className="setting">
              <div className="s-left">
                <div>
                  <strong>Orario promemoria</strong>
                  <small className="muted">A che ora vuoi essere ricordato</small>
                </div>
              </div>
              <input
                type="time"
                value={s.reminderTime}
                onChange={(e) => updateSettings({ reminderTime: e.target.value })}
              />
            </div>
            <div className="setting column">
              <div>
                <strong>Giorni promemoria</strong>
                <small className="muted">In quali giorni vuoi ricevere il promemoria</small>
              </div>
              <div className="day-picker">
                {DAYS.map((label, i) => {
                  const day = i + 1;
                  const on = s.reminderDays.includes(day);
                  return (
                    <button
                      key={label}
                      className={on ? "on" : ""}
                      onClick={() =>
                        updateSettings({
                          reminderDays: on
                            ? s.reminderDays.filter((x) => x !== day)
                            : [...s.reminderDays, day],
                        })
                      }
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <button className="btn ghost" onClick={testNotification}>
              Prova la notifica
            </button>
          </Card>

          <Card className="pad">
            <CardTitle title="Dati e sincronizzazione" />
            <div className="setting">
              <div className="s-left">
                <span className="s-icon">💾</span>
                <div>
                  <strong>Backup dei dati</strong>
                  <small className="muted">Scarica un file con i tuoi progressi</small>
                </div>
              </div>
              <button className="btn outline sm" onClick={doExport}>
                Esporta
              </button>
            </div>
            <div className="setting">
              <div className="s-left">
                <span className="s-icon">♻️</span>
                <div>
                  <strong>Ripristina dati</strong>
                  <small className="muted">Carica un file di backup</small>
                </div>
              </div>
              <button className="btn outline sm" onClick={() => fileRef.current?.click()}>
                Importa
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                hidden
                onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])}
              />
            </div>
            <div className="setting">
              <div className="s-left">
                <span className="s-icon">🗑️</span>
                <div>
                  <strong>Reset progressi</strong>
                  <small className="muted">Cancella tutti i dati e ricomincia</small>
                </div>
              </div>
              <button
                className="btn danger sm"
                onClick={() => {
                  if (confirm("Vuoi cancellare tutti i progressi? L'operazione non è reversibile.")) {
                    reset();
                    flash("Progressi azzerati");
                  }
                }}
              >
                Reset
              </button>
            </div>
          </Card>
        </div>

        <div className="col">
          <Card className="pad">
            <CardTitle title="Il tuo profilo" />
            <div className="setting column">
              <div>
                <strong>Nome</strong>
                <small className="muted">Usato solo per salutarti</small>
              </div>
              <input
                className="ex-input"
                value={state.name}
                placeholder="Il tuo nome"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <ul className="kv">
              <li>
                <span>Livello</span>
                <b>
                  {lvl.level} — {lvl.name}
                </b>
              </li>
              <li>
                <span>XP totali</span>
                <b>{state.xp}</b>
              </li>
              <li>
                <span>Dati salvati</span>
                <b>Solo su questo dispositivo</b>
              </li>
            </ul>
          </Card>

          <Card className="pad">
            <CardTitle title="Statistiche di studio" />
            <ul className="kv">
              <li>
                <span>Tempo totale di studio</span>
                <b>
                  {Math.floor(state.totals.minutes / 60)}h {state.totals.minutes % 60}m
                </b>
              </li>
              <li>
                <span>Lezioni completate</span>
                <b>{d.lessonsDone}</b>
              </li>
              <li>
                <span>Vocaboli incontrati</span>
                <b>{d.seenWords}</b>
              </li>
              <li>
                <span>Esercizi completati</span>
                <b>{state.totals.exercises}</b>
              </li>
              <li>
                <span>Parole da ripassare</span>
                <b>{d.dueWords}</b>
              </li>
            </ul>
          </Card>

          <Card className="pad about">
            <strong>Korean Journey</strong>
            <small className="muted">Versione 1.0.0</small>
            <small className="muted">
              I progressi restano nel localStorage del browser: esporta un backup prima di cambiare
              dispositivo.
            </small>
          </Card>
        </div>
      </div>
    </>
  );
};
